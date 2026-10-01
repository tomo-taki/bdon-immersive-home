// onp_release.h -- picks the update from the GitHub releases list
// (ReleaseFeed.swift parity). No Win32 here, so the host test runs it.
//
//   GET api.github.com/repos/<repo>/releases   (newest first)
//     tag    "b<commit count>"       compared with BDON_BUILD_NUMBER
//     name   "2026.09.29 (5786b63)"
//     body   the update summary, written by the human (tools/release.sh)
//     assets one package per platform + SHA256SUMS.txt
//
// tools/release.sh may publish some platforms only, so the update is the
// newest release carrying our package; releases without it are not ours.
// The summaries of every newer release with our package are shown, newest
// first, so a version skipped in between still tells what it changed.
#pragma once

#include <algorithm>
#include <optional>
#include <string>
#include <vector>

#include "json.hpp"

namespace onp {

struct ReleaseUpdate {
    int build = 0;
    std::string title;          // UTF-8
    std::string notes;          // UTF-8; "" when no newer release has a summary
    std::string packageUrl;
    std::string checksumUrl;
};

inline const char* const kChecksumAsset = "SHA256SUMS.txt";

// "b42" -> 42; -1 for any other tag (at most 9 digits, so no overflow).
inline int releaseBuild(const std::string& tag) {
    if (tag.size() < 2 || tag.size() > 10 || tag[0] != 'b') return -1;
    int build = 0;
    for (size_t i = 1; i < tag.size(); ++i) {
        if (tag[i] < '0' || tag[i] > '9') return -1;
        build = build * 10 + (tag[i] - '0');
    }
    return build;
}

namespace release_detail {

using json = nlohmann::json;

// Field as a string; "" when missing or null (GitHub sends null names/bodies).
inline std::string text(const json& object, const char* key) {
    auto it = object.find(key);
    return it != object.end() && it->is_string() ? it->get<std::string>() : std::string();
}

inline bool flag(const json& object, const char* key) {
    auto it = object.find(key);
    return it != object.end() && it->is_boolean() && it->get<bool>();
}

inline std::string assetUrl(const json& release, const std::string& name) {
    auto assets = release.find("assets");
    if (assets == release.end() || !assets->is_array()) return {};
    for (const auto& asset : *assets)
        if (asset.is_object() && text(asset, "name") == name) return text(asset, "browser_download_url");
    return {};
}

inline std::string title(const json& release) {
    std::string name = text(release, "name");
    return name.empty() ? text(release, "tag_name") : name;
}

// The body without CR and surrounding blanks. Releases from before summaries
// said only "BDON Immersive Home <title>": nothing to show.
inline std::string summary(const json& release) {
    std::string body;
    for (char c : text(release, "body")) if (c != '\r') body += c;
    const char* blank = " \t\n";
    size_t first = body.find_first_not_of(blank);
    if (first == std::string::npos) return {};
    body = body.substr(first, body.find_last_not_of(blank) - first + 1);
    return body == "BDON Immersive Home " + title(release) ? std::string() : body;
}

}  // namespace release_detail

// The newest release after build `current` that carries `package`, if any.
inline std::optional<ReleaseUpdate> pickUpdate(const nlohmann::json& releases, int current,
                                               const std::string& package) {
    using namespace release_detail;
    if (!releases.is_array()) return std::nullopt;

    // Published releases newer than us that ship our package, newest first.
    struct Entry { int build; const json* release; };
    std::vector<Entry> newer;
    for (const auto& r : releases) {
        if (!r.is_object() || flag(r, "draft") || flag(r, "prerelease")) continue;
        int build = releaseBuild(text(r, "tag_name"));
        if (build <= current) continue;
        if (assetUrl(r, package).empty() || assetUrl(r, kChecksumAsset).empty()) continue;
        newer.push_back({build, &r});
    }
    if (newer.empty()) return std::nullopt;
    std::stable_sort(newer.begin(), newer.end(), [](const Entry& a, const Entry& b) { return a.build > b.build; });

    // One summary as written; several under their release titles.
    std::vector<std::pair<std::string, std::string>> summaries;   // title, text
    for (const auto& e : newer) {
        std::string s = summary(*e.release);
        if (!s.empty()) summaries.emplace_back(title(*e.release), s);
    }
    std::string notes;
    if (summaries.size() == 1) notes = summaries[0].second;
    else for (const auto& [t, s] : summaries) notes += (notes.empty() ? "" : "\n\n") + t + "\n" + s;

    const json& newest = *newer.front().release;
    return ReleaseUpdate{newer.front().build, title(newest), notes,
                         assetUrl(newest, package), assetUrl(newest, kChecksumAsset)};
}

}  // namespace onp
