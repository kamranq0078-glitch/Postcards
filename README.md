# A Piece of Home, Every Day

A small static postcard site, built with plain HTML, CSS and JavaScript. Daily content lives in `content/days.json`.

## Preview locally

Run `python3 -m http.server 8000` from this folder and open http://localhost:8000. The site needs HTTP so the browser can fetch the JSON.

## Add a postcard

Append an entry to `content/days.json` with a unique date, title, short body and one visual style. Use `familyNote` for one note or `familyNotes` for several. Choose from `snowfall`, `chinar`, `dallake`, `saffron`, `dusk-call`, `chillai-kalan`, and `garden`. The first entry for today is featured; older entries appear in the archive.

```json
{
  "date": "YYYY-MM-DD",
  "visualStyle": "chinar",
  "title": "Your title",
  "body": "A short line or two.",
  "familyNote": { "from": "Mama", "message": "A note from home." }
}
```

## Publish

This repository is public. GitHub Pages will make the site and its family messages visible to anyone with the URL; `noindex, nofollow` is not an access gate. The Pages workflow deploys the repository root on pushes to `main`. In Settings → Pages, choose **GitHub Actions** as the build source. The site URL is https://kamranq0078-glitch.github.io/Postcards/. Future daily updates are edits to `content/days.json`, then commit and push.

The site matches dates in the visitor's local time zone and supports reduced-motion preferences.
