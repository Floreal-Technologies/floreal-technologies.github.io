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
| `config.toml` | site settings, `theme = "floreal"`, the two languages' words, the friends list, the backdrop list |
| `content/_index.md` | the landing page: tagline, and which products it shows |
| `content/products/` | one file per product, per language, and the section that lists them |
| `themes/floreal/` | the theme: `theme.toml`, `templates/`, `sass/`, `static/floreal.js` |
| `static/` | this site's own files: the backdrop photos, the licences, `CNAME` |

Nothing outside `config.toml`, `content/` and `static/` is about this site in
particular. The theme in `themes/floreal/` names no product, no photo and no
domain; it reads all of that from the site's config and content.

Files that end in `.fr.md` are the French versions. `content/_index.md` serves `/`
and `content/_index.fr.md` serves `/fr/`.

## Pages

| URL | Template | What it is |
| --- | --- | --- |
| `/`, `/fr/` | `index.html` | the landing page, with a card per product |
| `/products/`, `/fr/products/` | `products.html` | every product, as the same cards |
| `/products/<name>/` | `product.html` | one product, with its whole text |

A card's title links to that product's page. Every page but the landing page
carries breadcrumbs, and the language nav switches to the same page in the other
language — to the landing page of that language when the page has no translation
yet.

## The parts a page is built from

| File | What it draws |
| --- | --- |
| `macros.html` | `card()`, one product as a card; `actions()`, the row of buttons under a card or a product page; `btn()`, one button; `srcset()` and `fallback()`, a backdrop's URLs; `lang_url()`, a page in the other language |
| `partials/header.html` | the name of the house, the backdrop switcher, the language nav |
| `partials/crumbs.html` | the breadcrumbs |

Every URL the templates write is a full one, built by `get_url()` or taken from a
page's `permalink`. That is what lets the same theme serve a site that lives at
the root of a domain and one that lives under a sub-path of it.

A part is a macro when it can be: a macro takes named arguments, so the call says
what it is given. A part that calls `trans()` has to be an include instead, because
a macro cannot see the context that `trans()` reads — that is the whole of the rule,
and the two includes say at the top which variables they expect.

`themes/floreal/sass/floreal.scss` lists the stylesheet's parts in cascade order — `_tokens` (the
palette of each backdrop), `_base` (the page, its links and its two paragraph
styles), then one file per component: `_header`, `_menu`, `_crumbs`, `_prose`,
`_card`, `_button`, `_footer`, `_media`. Zola compiles them into the single
`/floreal.css` the pages ask for, so a rule for a component is added to that
component's file and nothing else changes.

## Adding a product

1. Write `content/products/<name>.md` and `content/products/<name>.fr.md`.
   `extra.what` is the small label above the title, and each `[[extra.actions]]`
   is a button. Both are optional: a product that gives neither gets neither — `label`, `url`, and `primary = true` on the one the reader is
   meant to take. The same list draws the buttons on the card and on the page. The body is the text of the product's own page.
2. Put `<!-- more -->` in the body after the opening sentences. Everything above
   it is the card text; the page shows the whole body. Without the marker, the
   card shows the body entire.
3. Add the file's path to `extra.products` in `content/_index.md`, and the French
   path to `content/_index.fr.md`. That list sets which products the landing page
   shows, and in what order.

A product gets its page and its place on `/products/` from the file alone; step 3
is only about the landing page. `/products/` lists them by title.

## Adding a background

The switcher at the top of the page reads `[[extra.backdrops]]` in `config.toml`.
For a new one:

1. Put `<id>-1000`, `<id>-1600` and `<id>-2560`, as both `.jpg` and `.webp`, in
   `static/img/`.
2. Add an `[[extra.backdrops]]` block with the id, the base path (relative to
   `static/`, so `img/<id>-`), the widths and the intrinsic size.
3. Add `backdrop_<id>` (the button label) and `credit_<id>` (the footer line) to
   both `[translations]` tables. The credit shows itself when that photo is the
   one on: `base.html` writes the rule that pairs the two.
4. Give it an `[extra.backdrops.palette]` table, under its own
   `[[extra.backdrops]]` block: `ink`, `ink-dim`, `line`, `tint`, `card`,
   `card-solid`, `accent`, `sand`, `sand-lift`, `on-sand`, `bg`, `focus-pos`
   and `scrim`. Each key becomes a custom property on
   `html[data-theme="<id>"]`, written into the page by `base.html`. A photo
   that is given no palette is read against the one on `:root`, in
   `themes/floreal/sass/_tokens.scss`, which belongs to no photo.

## Licence

The theme in `themes/floreal/` is given away under the GNU General Public
Licence, version 3 only. Its text is `themes/floreal/LICENSE`.

The photographs are not ours to licence and carry their own terms, which the
footer names: `Path` is LGPL-3.0, from the KDE Plasma wallpapers, and the aerial
photograph is from Unsplash.
