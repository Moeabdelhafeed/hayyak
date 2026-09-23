# Backend request — Hayyak

Nothing here is blocking. The site passes its SEO audit without any of it. These are
small API gaps we hit while closing that audit, listed shortest-path first.


---

## 1. Poster frame for the hero video

The homepage hero is a video. Until it downloads, the hero is black — and Google measures
that wait as the page's load time (currently 4.6s on mobile; the target is 2.5s).

**Ask:** when a hero video is uploaded, save its first frame as an image and return it as
the hero's `image_url`.

```bash
ffmpeg -i <uploaded>.mp4 -frames:v 1 -q:v 5 -vf scale=1600:-2 poster.jpg
```

The frontend already reads `image_url` and uses it as the video's poster, so nothing has
to change on our side. A frame is ~140KB against a multi-megabyte video.

Doing it on upload rather than by hand matters: otherwise the next person to swap the
video has to remember, and the page gets slow again quietly.

---


## 4. `updated_at` on blog posts

`general/blog/posts/{slug}` returns `published_at` but no `updated_at`, so an edited post
shows no sign of being edited. Please expose the record's existing timestamp.