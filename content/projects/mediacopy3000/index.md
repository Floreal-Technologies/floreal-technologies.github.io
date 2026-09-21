+++
title = "MediaCopy 3000"
description = "MediaCopy 3000 offloads camera media between storage volumes and verifies every copy against an ASC MHL manifest."

[extra]
what = "Desktop application"

[[extra.actions]]
label = "Read more…"
url = "/projects/mediacopy3000/"
primary = true

[[extra.actions]]
label = "Install it"
url = "https://docs.floreal.tech/mediacopy3000/installation"

[[extra.actions]]
label = "Source on GitHub"
url = "https://github.com/Floreal-Technologies"
+++

Secure media transfers between storage volumes, from set to post-prod.
Ensure the **completeness** and **safety** of your data.

<!-- more -->

## What it does

MediaCopy 3000 (MC3K) copies your media from a camera card to your storage volumes.
It computes a hash of each file, then it reads each copy back and compares the
hashes. A copy that does not match is reported. You know that the transfer is
complete before you format the card.

<video controls width=700>
  <source src="/projects/mediacopy3000/mc3k-offload.mp4" type="video/mp4" />
</video>

## Integrity that stays with the data

MC3K writes an ASC Media Hash List (MHL) manifest next to your files. The
format is open. Any tool that reads MHL can check the same data later, on a
different machine and with different software.

You can also **seal** a source in place. MC3K reads the volume and writes the
manifest without a copy. A copy that you make later then has the original
hashes to check against.

## No surprises

MC3K shows an execution plan before it starts. The plan lists each source, each
destination and each action. You approve the plan, then the queue runs it.

## Supported platforms

MC3K is available on the following platforms

* Microsoft Windows
* macOS 15+
* Debian/Ubuntu
* Fedora
* Arch Linux

The source code is published under the GPL-3.0 licence.
