+++
title = "La malédiction du savoir"
description = "Ce que nous avons appris à la dure, et que nous aurions aimé ne pas connaitre"
template = "cursed-knowledge.html"

[[extra.items]]
title = "GHCi exécute le code hors du fil principal et macOS déteste ça"
date = 2026-10-24
description = "GHCi exécute chaque instruction sandboxée dans un nouveau fil. Sur macOS, Cocoa refuse de créer une fenêtre hors du fil principal : une application GTK lancée depuis GHCi (par exemple avec ghcid) plante avec « NSWindow should only be instantiated on the main thread! ». L'option (non documentée) -fno-ghci-sandbox fait exécuter l'instruction sur le fil principal, mais désactive le debugger intégré GHCi (mais qui utilise le debugger GHCi, on se le demande…)."
icon = "cib-apple"
link = { href = "https://gitlab.haskell.org/ghc/ghc/-/blob/8ab506ff3219560b20e1d9040e793371ba0efc52/libraries/ghci/GHCi/Run.hs#L231-257", text = "Gitlab Haskell" }

[[extra.items]]
title = "GTK affiche toujours Maj avant Ctrl pour les raccourcis clavier"
date = 2026-10-21
description = "GTK lit un raccourci clavier comme un ensemble de modificateurs, puis les affiche dans un ordre fixe : Maj, Ctrl, Alt, Super. Un raccourci écrit <Control><Shift>p s'affiche donc Maj+Ctrl+P, dans gtk_accelerator_get_label, GtkShortcutLabel, AdwShortcutLabel et GtkShortcutsWindow. Pour afficher Ctrl+Maj+P, nous devons construire l'étiquette nous-mêmes à partir du nom de chaque modificateur."
icon = "cil-keyboard"
link = { href = "https://gitlab.gnome.org/GNOME/gtk/-/blob/main/gtk/gtkaccelgroup.c", text = "Gitlab GNOME" }

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
