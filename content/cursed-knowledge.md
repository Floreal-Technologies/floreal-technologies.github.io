+++
title = "Cursed Knowledge"
description = "What we learnt the hard way, and wish we had not."
template = "cursed-knowledge.html"

[[extra.items]]
title = "GTK always shows Shift before Ctrl in keyboard shortcuts"
date = 2026-10-21
description = "GTK reads a keyboard shortcut into a set of modifiers, then prints them in a fixed order: Shift, Ctrl, Alt, Super. A shortcut written as <Control><Shift>p thus shows as Shift+Ctrl+P, in `gtk_accelerator_get_label`, GtkShortcutLabel, AdwShortcutLabel and GtkShortcutsWindow alike. To show Ctrl+Shift+P, we must build the label ourselves from the name of each modifier."
icon = "cil-keyboard"
link = { href = "https://gitlab.gnome.org/GNOME/gtk/-/blob/main/gtk/gtkaccelgroup.c", text = "GNOME Gitlab" }

[[extra.items]]
title = "GHC heap corruption on Windows when using Template Haskell"
date = 2026-10-11
description = "On Windows, using Template Haskell alongside C FFI (like GTK…) can provoke heap corruption, leading to a crash. This is fixed by splitting off the Template Haskell from the C FFI in a different sub-library."
icon = "cib-windows"
link = { href = "https://gitlab.haskell.org/ghc/ghc/-/work_items/27927", text = "Haskell Gitlab" }

[[extra.items]]
title = "librsvg does not honour the prefers-color-scheme media query"
date = 2026-10-07
description = "librsvg does not support media queries (including prefers-color-scheme), which means we have to use GTK-specific strategies to make an SVG render differently depending on the desktop's preferred colour scheme."
icon = "cib-svg"
link = { href = "https://gitlab.gnome.org/GNOME/librsvg/-/work_items/620", text = "GNOME Gitlab" }

[[extra.items]]
title = "Recursive let-bindings can bite you at any time"
date = 2026-10-07
description = "Haskell in unable to let you explicitly annotate a let-binding as recursive, which can easily trigger an infinite loop. A proposal for a RecursiveLet extension has been dormant since 2025."
icon = "cib-haskell"
link = { href = "https://github.com/ghc-proposals/ghc-proposals/pull/401", text = "GHC Proposals" }
+++

Cursed knowledge is what we learnt while building our software, and wish we never had to.
