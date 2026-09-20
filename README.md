# floreal.tech

The landing page for Floréal Technologies. It is a [Zola](https://www.getzola.org/)
site, version 0.22.1.

## Build

```sh
zola serve
zola build
```

## Layout

| Path | What it holds |
| --- | --- |
| `config.toml` | site settings, the two languages' words, the friends list, the backdrop list |
| `content/_index.md` | the landing page: tagline, and which products it shows |
| `content/products/` | one file per product, per language |
| `templates/` | `base.html`, `index.html`, `macros.html`, `partials/` |
| `static/` | images, stylesheet, `theme.js`, licences, `CNAME` |

Files that end in `.fr.md` are the French versions. `content/_index.md` serves `/`
and `content/_index.fr.md` serves `/fr/`.

## Adding a product

1. Write `content/products/<name>.md` and `content/products/<name>.fr.md`. The body
   is the card text; `extra.what` is the small label above the title, and each
   `[[extra.actions]]` is a button.
2. Add the file's path to `extra.products` in `content/_index.md`, and the French
   path to `content/_index.fr.md`. That list sets the order of the cards.

## Adding a background

The switcher at the top of the page reads `[[extra.backdrops]]` in `config.toml`.
For a new one:

1. Put `<id>-1000`, `<id>-1600` and `<id>-2560`, as both `.jpg` and `.webp`, in
   `static/img/`.
2. Add an `[[extra.backdrops]]` block with the id, the base path, the widths and
   the intrinsic size.
3. Add `backdrop_<id>` (the button label) and `credit_<id>` (the footer line) to
   both `[translations]` tables.
4. Add an `html[data-theme="<id>"]` block to `static/styles.css` with that photo's
   palette and scrim.
