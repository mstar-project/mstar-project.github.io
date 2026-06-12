# M\* — project website & blog

Source for the public landing page and blog post for **M\*** ("M-star"), a universal serving system for
composite, any-to-any multimodal models.

> **M\*: A Modular, Extensible, Serving System for Multimodal Models**
> [Paper](https://arxiv.org/abs/2606.12688) · [Code](https://github.com/mstar-project/mstar) · [Docs](https://mstar-project.github.io/mstar/)

This is a **self-contained static site**: no build step, no dependencies. Open `index.html` in a browser,
or serve the folder:

```bash
python3 -m http.server 8080   # → http://localhost:8080
```

## Repository layout

| Path | Purpose |
|------|---------|
| `index.html` | The post + landing hub. Two color themes (Minimal / Bold) via the in-page toggle. |
| `blog.md` | The post as portable Markdown — the **canonical text** (mirrors `index.html`). |
| `assets/css/` | Design system (`base.css`) + the two themes (`theme-minimal.css`, `theme-bold.css`). |
| `assets/js/` | Theme switcher + lightweight diagram animations (no external dependencies). |
| `assets/img/` | Figures: concept diagrams, result charts, and sample outputs. |

## Editing the post

The prose lives in **`blog.md`** — the single source of truth for text and figure placement. `index.html`
is the styled, animated rendering of that same content. Small wording fixes can be made in both; larger
edits are made in `blog.md` and then ported into `index.html`. See `CONTRIBUTING.md` for how we collaborate.

## License

[Apache License 2.0](LICENSE).
