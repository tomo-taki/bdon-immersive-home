#ifndef SPINE_BRIDGE_H
#define SPINE_BRIDGE_H

// Thin C layer over spine-c for the Metal renderer: one resident = one
// SBDrawable. Each frame, sb_update() advances the pose and sb_render() emits
// world-space (skeleton space) triangles plus one command per texture/blend run.

#include <stdint.h>

typedef struct {
    float x, y;          // skeleton space (already scaled by the data scale)
    float u, v;
    float r, g, b, a;    // premultiplied light color
    float dr, dg, db;    // premultiplied dark color (tint black)
} SBVertex;

typedef struct {
    void *texture;       // what sb_texture_load returned for the atlas page
    int blend;           // 0 normal, 1 additive, 2 multiply, 3 screen
    int indexStart;
    int indexCount;
} SBCommand;

typedef struct SBAtlas SBAtlas;
typedef struct SBDrawable SBDrawable;

// Supplied by the app: decode an atlas page image and return a retained
// texture handle; release it again.
extern void *(*sb_texture_load)(const char *path, int *width, int *height);
extern void (*sb_texture_release)(void *texture);

SBAtlas *sb_atlas_load(const char *path);
void sb_atlas_dispose(SBAtlas *atlas);

// NULL on failure; `error` gets the reason.
SBDrawable *sb_create(SBAtlas *atlas, const char *skeletonPath, float scale, char *error, int errorLength);
void sb_dispose(SBDrawable *drawable);

// 1 when the animation exists and was set.
int sb_set_animation(SBDrawable *drawable, const char *name, int loop);
// 1 while a clip is playing (looping or not yet complete).
int sb_is_animating(SBDrawable *drawable);
// Number of clip completions since the last call.
int sb_take_completions(SBDrawable *drawable);

void sb_update(SBDrawable *drawable, float delta);
void sb_setup_slots(SBDrawable *drawable);

int sb_slot_count(SBDrawable *drawable);
const char *sb_slot_name(SBDrawable *drawable, int index);
// Blanked slots draw nothing (character toggle / easter egg).
void sb_set_blank(SBDrawable *drawable, int index, int blank);

// Pointers stay valid until the next sb_render / sb_dispose.
void sb_render(SBDrawable *drawable,
               const SBVertex **vertices, int *vertexCount,
               const uint32_t **indices, int *indexCount,
               const SBCommand **commands, int *commandCount);

#endif
