+++
title = "Cursed Knowledge"
description = "What we learnt the hard way, and wish we had not."
template = "cursed-knowledge.html"

[[extra.items]]
title = "librsvg does not honour the prefers-color-scheme media query"
date = 2026-10-07
description = "librsvg does not support media queries (including prefers-color-scheme), which means we have to use GTK-specific strategies to make an SVG render differently depending on the desktop's preferred colour scheme."
icon = "cib-svg"
link = { href = "https://gitlab.gnome.org/GNOME/librsvg/-/work_items/620", text = "GNOME Gitlab" }
+++

Cursed knowledge is what we learnt while building our software, and wish we never had to.
