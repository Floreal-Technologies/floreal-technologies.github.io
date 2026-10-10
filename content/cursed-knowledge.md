+++
title = "Cursed Knowledge"
description = "What we learnt the hard way, and wish we had not."
template = "cursed-knowledge.html"

[[extra.items]]
title = "GHC heap corruption on Windows when using Template Haskell"
date = 2026-10-10
description = "On Windows, using Template Haskell can provoke heap corruption, leading to a crash. This is fixed by using the external code interpreter so that the Template Haskell code is executed in a different process (called iserv)."
icon = "cib-windows"
link = { href = "https://github.com/Floreal-Technologies/MediaCopy3000/pull/49", text = "MediaCopy 3000 PR" }

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
