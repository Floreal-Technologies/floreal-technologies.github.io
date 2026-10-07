+++
title = "La malédiction du savoir"
description = "Ce que nous avons appris à la dure, et que nous aurions aimé ne pas connaitre"
template = "cursed-knowledge.html"

[[extra.items]]
title = "librsvg n'honore pas la media query \"prefers-color-scheme\""
date = 2026-10-07
description = "librsvg ne supporte pas les media queries (y compris \"prefers-color-scheme\"), ce qui implique de devoir utiliser une stratégie spécifique à GTK pour rendre un SVG différemment selon le thème couleur de l'environnement de bureau."
icon = "cib-svg"
link = { href = "https://gitlab.gnome.org/GNOME/librsvg/-/work_items/620", text = "Gitlab GNOME" }

[[extra.items]]
title = "Les assignements recursif peuvent revenir vous hanter à n'importe-quel moment"
date = 2026-10-07
description = "Haskell n'est pas capable de vous laisser annoter explicitement un assignement comme étant récursif, ce qui peut facilement mener à écrire une boucle infinie. Une proposition pour une extension du compilateur, nommée RecursiveLet, est dormante depuis 2025"
icon = "cib-haskell"
link = { href = "https://github.com/ghc-proposals/ghc-proposals/pull/401", text = "Propositions GHC" }
+++

La malédiction du savoir acquis pendant nos aventures, et que nous aurions aimé ne ne pas connaître.
