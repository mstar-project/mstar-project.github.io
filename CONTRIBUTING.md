# Contributing to the M\* site

Thanks for helping improve the M\* post! This is a small static site; here's how we collaborate so edits
flow cleanly to the published page.

## Where the content lives

- **`blog.md`** is the single source of truth for the post's **text** and figure placement.
- **`index.html`** is the styled, animated rendering of that same content (two themes + interactive
  diagrams). It mirrors `blog.md`.
- Figures live in `assets/img/`; styles in `assets/css/`; the small animation scripts in `assets/js/`.

## How we edit (Google Docs → repo)

For rounds of co-author / PI feedback we use a shared **Google Doc**, so everyone can edit and comment
without touching git or HTML:

1. The working draft is the Google Doc: **[add link here]**. It holds the post's prose, kept in sync with
   `blog.md`.
2. Co-authors edit in **Suggesting mode** and leave **comments**.
3. A maintainer accepts the edits and **ports the final prose back into `blog.md`, then into `index.html`**
   (the two mirror each other, so this is a quick, mechanical step) and commits.
4. Figures / numbers: drop replacements into `assets/img/` (keep the same filenames); the figure list is in
   `blog.md` / `index.html`.

Prefer to work in the repo directly? Small wording fixes can be made straight in `blog.md` (and the matching
line in `index.html`) via a pull request.

## Preview locally

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

Use the in-page **Minimal / Bold** toggle to check both themes.

## Please don't hand-edit (ask a maintainer first)

- The inline **SVG diagrams** and their animation logic (`assets/js/animations.js`).
- The **theme CSS** / design system (`assets/css/`), unless you're making a deliberate design change.

## Style notes

- Write the system name as **M\*** ("M-star").
- Every performance number carries its context (model, hardware, batch, percentile); keep claims consistent
  with the paper and the benchmark figures.
- Keep code snippets short — they're illustrative and simplified from the real source.

## Questions / larger changes

Open an issue or contact **<atindra@cs.stanford.edu>**.
