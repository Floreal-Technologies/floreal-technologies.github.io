+++
title = "Cursed Knowledge"
description = "What we learnt the hard way, and wish we had not."
template = "cursed-knowledge.html"

[[extra.items]]
title = "GHCi runs code off the main thread and macOS hates it"
date = 2026-10-24
description = "GHCi runs each statement sandboxed in a new thread. On macOS, Cocoa refuses to make a window outside the main thread, so a GTK application started from GHCi (for example with ghcid) crashes with 'NSWindow should only be instantiated on the main thread!'. The undocumented -fno-ghci-sandbox flag makes GHCi run the statement on the main thread, but this turns off the GHCi debugger (but who does use the GHCi debugger, we do wonder…)."
icon = "cib-apple"
link = { href = "https://gitlab.haskell.org/ghc/ghc/-/blob/8ab506ff3219560b20e1d9040e793371ba0efc52/libraries/ghci/GHCi/Run.hs#L231-257", text = "Haskell Gitlab" }

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
