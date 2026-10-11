+++
title = "La malédiction du savoir"
description = "Ce que nous avons appris à la dure, et que nous aurions aimé ne pas connaitre"
template = "cursed-knowledge.html"

[[extra.items]]
title = "Corruption du tas dans GHC sur Windows avec Template Haskell"
date = 2026-10-11
description = "Sur Windows, l'utilisation de Template Haskel avec la FFI C (comme GTK…) peut provoquer une corruption du tas, menant à un crash du compilateur. Le problème est réglé en séparant le code utilisant Template Haskell du code utilisant la FFI dans une sous-bibliothèque séparée."
icon = "cib-windows"
link = { href = "https://gitlab.haskell.org/ghc/ghc/-/work_items/27927", text = "Gitlab Haskell" }

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
