+++
title = "Why we use Haskell for MediaCopy 3000"
date = 2026-09-20

[taxonomies]
tags = ["haskell", "mediacopy3000"]
categories = ["In the forest"]
authors = ["Feriel Choutri de Tarlé"]
+++

It is quite unorthodox to use the Haskell programming language for a desktop application, but so far the language
has proven to be a robust platform to tackle the inherent complexity of graphical user interfaces.

<!-- more -->

## Taming GTK with an Elm architecture

Coming from the C world, GTK 4 is a very imperative UI toolkit. It is also
one of the best FOSS toolkits around in terms of accessibility, debugging and
providing you with a flurry of utilities to make graphical interfaces that we
would usually reinvent in a website.

The GTK developers have poured immense efforts into making GTK 4 and Adwaita
an excellent toolkit, but the problem remains: It's still **very** imperative.

However, The [Elm programming language](https://elm-lang.org/)
and its famed architecture, itself an adaptation of
[Moore machines](https://en.wikipedia.org/wiki/Moore_machine), is very well-suited
for bringing some predictability into all of this.

The architecture goes as follow:

* The **Model**, is a record holding our application state;
* The **View** expresses the interface in terms of Haskell data structures;
* User interactions send *Messages*, which trigger an **Update** function that rebuilds the **View** (via other messages);
* The **Render** function that takes your **View** and turns it into GTK widgets.

This buys us something incredible: We do not litter the codebase with effectful
calls to the GTK library to update widgets. Instead, the UI is completely
built in terms of Haskell data structures, and the rendering is done at a very
specific place.

In practice, this means that we can build the UI in ways that are
completely artificial, since we do not need click on the UI to change the views,
but simply sending messages to the engine.

This enabled us to make a screenshot-taking utility that builds _Scenes_ and sets those scenes
as the default state during application start-up. This is a particularly nifty way
of doing so, because if the application is a complete black box, you have to resort
to automating user clicks, which is a massive hassle.

<a href="/blog/2026/09/20/using-haskell-for-mediacopy3000/queue-catppuccin-light-latte.png">
  <img src="/blog/2026/09/20/using-haskell-for-mediacopy3000/queue-catppuccin-light-latte.png" width="700" style="max-width: 100%;"/>
</a>

And as a bonus, because so much happens on the Haskell side, we can emulate the
filesystem in memory during tests.

---

## Reliable domain modelling with rich and powerful types

Amongst all of the domain modelling that we have done thanks to Haskell types,
we'd like to put the spotlight on Job events.

Jobs are the abstract actions of offloading, verifying and sealing a media
source. They are composed of many steps, and these steps emit events as they
progress. Here is a simplified list of those events:

* A job is **Planned**, **Finished** or has **Failed**;
* The **Status** of a file has **Changed**;
* There is **Progress** with copying data;
* The **Manifest** is being written and is done being written;

or in Haskell:

```haskell
data JobEvent
  = Planned PlannedWork
  | FileStatusChanged RelPath FileStatus
  | Progress Int64
  | ManifestWriting
  | MhlWritten OsPath
  | JobFinished JobResult
  | JobFailed Text

data FileStatus
  = Pending
  | Hashing
  | Copying
  | Flushing
  | Publishing
  | Verifying
  | Done FileOutcome

data FileOutcome
  = Ok
  | HashMismatch Mismatch
  | Missing
  | New
  | IoError Text
  | Replaced Mismatch
  -- […]
```

As you can see, the types are separated in a way that there are no possible confusion
between success and failure states.

Not only we emit events when data is being moved around, but we have an
exhaustive enough view of the times where the application is waiting on the
operating system to synchronise the file system and the memory.

Since it's hard to tell what's going on when the external drive doesn't have a
blinking LED, we have to tell the end-user that _something_ is happening.
Otherwise they might believe that the application has frozen and would kill it.

## In Conclusion

An unorthodox choice, but so far Haskell is a perfectly fine language
to interface with GTK. The documentation on the Haskell side is a bit lacking,
but we expect to write about our applications' internals enough to help others
do it too. Thank you Haskell!
