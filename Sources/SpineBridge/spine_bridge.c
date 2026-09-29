// spine-c glue for the Metal prototype. Mirrors spine-threejs SkeletonMesh:
// premultiplied vertex colors, tint black, clipping, and one draw command per
// run of (atlas page, blend mode).

#include "spine_bridge.h"

#include <spine/spine.h>
#include <spine/extension.h>
#include <stdlib.h>
#include <string.h>

void *(*sb_texture_load)(const char *path, int *width, int *height) = 0;
void (*sb_texture_release)(void *texture) = 0;

// spine-c extension points.
void _spAtlasPage_createTexture(spAtlasPage *self, const char *path) {
    int width = 0, height = 0;
    self->rendererObject = sb_texture_load ? sb_texture_load(path, &width, &height) : 0;
    self->width = width;
    self->height = height;
}

void _spAtlasPage_disposeTexture(spAtlasPage *self) {
    if (self->rendererObject && sb_texture_release) {
        sb_texture_release(self->rendererObject);
    }
    self->rendererObject = 0;
}

char *_spUtil_readFile(const char *path, int *length) {
    return _spReadFile(path, length);
}

struct SBAtlas {
    spAtlas *atlas;
};

struct SBDrawable {
    spSkeletonData *data;
    spSkeleton *skeleton;
    spAnimationStateData *stateData;
    spAnimationState *state;
    spSkeletonClipping *clipper;
    unsigned char *blank;          // per slot (by slot index)
    int completions;

    // Output, grown as needed.
    SBVertex *vertices;
    int vertexCount, vertexCapacity;
    uint32_t *indices;
    int indexCount, indexCapacity;
    SBCommand *commands;
    int commandCount, commandCapacity;
    float *world;                  // scratch world positions (x, y pairs)
    int worldCapacity;
};

static const unsigned short QUAD[6] = {0, 1, 2, 2, 3, 0};

static void *grow(void *buffer, int *capacity, int needed, size_t size) {
    if (needed <= *capacity) {
        return buffer;
    }
    int next = *capacity ? *capacity : 1024;
    while (next < needed) {
        next *= 2;
    }
    *capacity = next;
    return realloc(buffer, (size_t) next * size);
}

SBAtlas *sb_atlas_load(const char *path) {
    spAtlas *atlas = spAtlas_createFromFile(path, 0);
    if (!atlas) {
        return 0;
    }
    SBAtlas *result = calloc(1, sizeof(SBAtlas));
    result->atlas = atlas;
    return result;
}

void sb_atlas_dispose(SBAtlas *atlas) {
    if (!atlas) {
        return;
    }
    spAtlas_dispose(atlas->atlas);
    free(atlas);
}

static void listener(spAnimationState *state, spEventType type, spTrackEntry *entry, spEvent *event) {
    (void) entry;
    (void) event;
    if (type == SP_ANIMATION_COMPLETE) {
        ((SBDrawable *) state->rendererObject)->completions++;
    }
}

static int ends_with(const char *text, const char *suffix) {
    size_t a = strlen(text), b = strlen(suffix);
    return a >= b && strcmp(text + a - b, suffix) == 0;
}

SBDrawable *sb_create(SBAtlas *atlas, const char *skeletonPath, float scale, char *error, int errorLength) {
    spSkeletonData *data = 0;

    // Spot exports are Spine 4.2 JSON, a few are 4.2 binary (.skel).
    if (ends_with(skeletonPath, ".skel")) {
        spSkeletonBinary *binary = spSkeletonBinary_create(atlas->atlas);
        binary->scale = scale;
        data = spSkeletonBinary_readSkeletonDataFile(binary, skeletonPath);
        if (!data && error) {
            strncpy(error, binary->error ? binary->error : "binary read failed", errorLength - 1);
        }
        spSkeletonBinary_dispose(binary);
    } else {
        spSkeletonJson *json = spSkeletonJson_create(atlas->atlas);
        json->scale = scale;
        data = spSkeletonJson_readSkeletonDataFile(json, skeletonPath);
        if (!data && error) {
            strncpy(error, json->error ? json->error : "json read failed", errorLength - 1);
        }
        spSkeletonJson_dispose(json);
    }
    if (!data) {
        return 0;
    }

    SBDrawable *d = calloc(1, sizeof(SBDrawable));
    d->data = data;
    d->skeleton = spSkeleton_create(data);
    d->stateData = spAnimationStateData_create(data);
    d->state = spAnimationState_create(d->stateData);
    d->state->rendererObject = d;
    d->state->listener = listener;
    d->clipper = spSkeletonClipping_create();
    d->blank = calloc((size_t) d->skeleton->slotsCount, 1);

    spSkeleton_setToSetupPose(d->skeleton);
    spSkeleton_updateWorldTransform(d->skeleton, SP_PHYSICS_UPDATE);
    return d;
}

void sb_dispose(SBDrawable *d) {
    if (!d) {
        return;
    }
    spSkeletonClipping_dispose(d->clipper);
    spAnimationState_dispose(d->state);
    spAnimationStateData_dispose(d->stateData);
    spSkeleton_dispose(d->skeleton);
    spSkeletonData_dispose(d->data);
    free(d->blank);
    free(d->vertices);
    free(d->indices);
    free(d->commands);
    free(d->world);
    free(d);
}

int sb_set_animation(SBDrawable *d, const char *name, int loop) {
    if (!name || !spSkeletonData_findAnimation(d->data, name)) {
        return 0;
    }
    spAnimationState_setAnimationByName(d->state, 0, name, loop);
    return 1;
}

int sb_is_animating(SBDrawable *d) {
    spTrackEntry *entry = d->state->tracksCount > 0 ? d->state->tracks[0] : 0;
    if (!entry) {
        return 0;
    }
    return entry->loop || entry->trackTime < entry->animationEnd - entry->animationStart;
}

int sb_take_completions(SBDrawable *d) {
    int count = d->completions;
    d->completions = 0;
    return count;
}

void sb_update(SBDrawable *d, float delta) {
    spAnimationState_update(d->state, delta);
    spAnimationState_apply(d->state, d->skeleton);

    // Blank after the pose is applied; clipping masks stay (clearing one
    // would unclip the slots after it).
    for (int i = 0; i < d->skeleton->slotsCount; i++) {
        spSlot *slot = d->skeleton->slots[i];
        if (!d->blank[i] || !slot->attachment || slot->attachment->type == SP_ATTACHMENT_CLIPPING) {
            continue;
        }
        spSlot_setAttachment(slot, 0);
    }

    spSkeleton_update(d->skeleton, delta);
    spSkeleton_updateWorldTransform(d->skeleton, SP_PHYSICS_UPDATE);
}

void sb_setup_slots(SBDrawable *d) {
    spSkeleton_setSlotsToSetupPose(d->skeleton);
}

int sb_slot_count(SBDrawable *d) {
    return d->skeleton->slotsCount;
}

const char *sb_slot_name(SBDrawable *d, int index) {
    return d->skeleton->slots[index]->data->name;
}

void sb_set_blank(SBDrawable *d, int index, int blank) {
    if (index >= 0 && index < d->skeleton->slotsCount) {
        d->blank[index] = (unsigned char) (blank != 0);
    }
}

static int blend_of(spBlendMode mode) {
    switch (mode) {
        case SP_BLEND_MODE_ADDITIVE: return 1;
        case SP_BLEND_MODE_MULTIPLY: return 2;
        case SP_BLEND_MODE_SCREEN: return 3;
        default: return 0;
    }
}

// Append triangles for one slot; merges with the previous command when the
// page and blend mode match.
static void emit(SBDrawable *d, const float *xy, const float *uv, int vertexCount,
                 const unsigned short *triangles, int triangleIndexCount,
                 void *texture, int blend, const float light[4], const float dark[3]) {
    if (vertexCount == 0 || triangleIndexCount == 0) {
        return;
    }
    int base = d->vertexCount;
    d->vertices = grow(d->vertices, &d->vertexCapacity, base + vertexCount, sizeof(SBVertex));
    for (int i = 0; i < vertexCount; i++) {
        SBVertex *v = &d->vertices[base + i];
        v->x = xy[i * 2];
        v->y = xy[i * 2 + 1];
        v->u = uv[i * 2];
        v->v = uv[i * 2 + 1];
        v->r = light[0]; v->g = light[1]; v->b = light[2]; v->a = light[3];
        v->dr = dark[0]; v->dg = dark[1]; v->db = dark[2];
    }
    d->vertexCount += vertexCount;

    int start = d->indexCount;
    d->indices = grow(d->indices, &d->indexCapacity, start + triangleIndexCount, sizeof(uint32_t));
    for (int i = 0; i < triangleIndexCount; i++) {
        d->indices[start + i] = (uint32_t) (base + triangles[i]);
    }
    d->indexCount += triangleIndexCount;

    SBCommand *last = d->commandCount ? &d->commands[d->commandCount - 1] : 0;
    if (last && last->texture == texture && last->blend == blend) {
        last->indexCount += triangleIndexCount;
        return;
    }
    d->commands = grow(d->commands, &d->commandCapacity, d->commandCount + 1, sizeof(SBCommand));
    d->commands[d->commandCount++] = (SBCommand) {texture, blend, start, triangleIndexCount};
}

void sb_render(SBDrawable *d, const SBVertex **vertices, int *vertexCount,
               const uint32_t **indices, int *indexCount,
               const SBCommand **commands, int *commandCount) {
    d->vertexCount = d->indexCount = d->commandCount = 0;
    spSkeleton *skeleton = d->skeleton;
    spSkeletonClipping *clipper = d->clipper;

    for (int i = 0; i < skeleton->slotsCount; i++) {
        spSlot *slot = skeleton->drawOrder[i];
        spAttachment *attachment = slot->attachment;
        if (!slot->bone->active || !attachment) {
            spSkeletonClipping_clipEnd(clipper, slot);
            continue;
        }

        const float *uvs = 0;
        const unsigned short *triangles = 0;
        int triangleCount = 0, floats = 0;
        spColor *color = 0;
        void *texture = 0;

        if (attachment->type == SP_ATTACHMENT_REGION) {
            spRegionAttachment *region = (spRegionAttachment *) attachment;
            d->world = grow(d->world, &d->worldCapacity, 8, sizeof(float));
            spRegionAttachment_computeWorldVertices(region, slot, d->world, 0, 2);
            floats = 8;
            uvs = region->uvs;
            triangles = QUAD;
            triangleCount = 6;
            color = &region->color;
            texture = ((spAtlasRegion *) region->region)->page->rendererObject;
        } else if (attachment->type == SP_ATTACHMENT_MESH) {
            spMeshAttachment *mesh = (spMeshAttachment *) attachment;
            floats = mesh->super.worldVerticesLength;
            d->world = grow(d->world, &d->worldCapacity, floats, sizeof(float));
            spVertexAttachment_computeWorldVertices(&mesh->super, slot, 0, floats, d->world, 0, 2);
            uvs = mesh->uvs;
            triangles = mesh->triangles;
            triangleCount = mesh->trianglesCount;
            color = &mesh->color;
            texture = ((spAtlasRegion *) mesh->region)->page->rendererObject;
        } else if (attachment->type == SP_ATTACHMENT_CLIPPING) {
            spSkeletonClipping_clipStart(clipper, slot, (spClippingAttachment *) attachment);
            continue;
        } else {
            spSkeletonClipping_clipEnd(clipper, slot);
            continue;
        }

        float alpha = skeleton->color.a * slot->color.a * color->a;
        float light[4] = {
            skeleton->color.r * slot->color.r * color->r * alpha,
            skeleton->color.g * slot->color.g * color->g * alpha,
            skeleton->color.b * slot->color.b * color->b * alpha,
            alpha,
        };
        float dark[3] = {0, 0, 0};
        if (slot->darkColor) {
            dark[0] = slot->darkColor->r * alpha;
            dark[1] = slot->darkColor->g * alpha;
            dark[2] = slot->darkColor->b * alpha;
        }
        int blend = blend_of(slot->data->blendMode);

        if (spSkeletonClipping_isClipping(clipper)) {
            spSkeletonClipping_clipTriangles(clipper, d->world, floats, (unsigned short *) triangles,
                                             triangleCount, (float *) uvs, 2);
            emit(d, clipper->clippedVertices->items, clipper->clippedUVs->items,
                 clipper->clippedVertices->size / 2, clipper->clippedTriangles->items,
                 clipper->clippedTriangles->size, texture, blend, light, dark);
        } else {
            emit(d, d->world, uvs, floats / 2, triangles, triangleCount, texture, blend, light, dark);
        }
        spSkeletonClipping_clipEnd(clipper, slot);
    }
    spSkeletonClipping_clipEnd2(clipper);

    *vertices = d->vertices;
    *vertexCount = d->vertexCount;
    *indices = d->indices;
    *indexCount = d->indexCount;
    *commands = d->commands;
    *commandCount = d->commandCount;
}
