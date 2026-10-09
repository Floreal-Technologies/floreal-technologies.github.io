+++
title = "Making a GTK application in Haskell, part 3"
date = 2026-10-12

[taxonomies]
tags = ["haskell", "gtk"]
categories = ["Tutorial"]
authors = ["Feriel Choutri de Tarlé"]
+++

In [Part 1], we showed how to build a minimal application using The Elm Architecture, and in [Part 2] we added more features to it.

We will now address some deficiencies that negatively impact the user experience
of the application, such as focus behaviour.
<!-- more -->

---

_To keep this post readable, the code that you will see will not be complete,
in order for me to underline the main concepts.<br>_
_You can find the whole project at <https://github.com/Floreal-Technologies/adwaita-todo>._

---

## The bugs

> _Hocus Pocus, there's pizza on your Focus_

Upon inserting a new entry in our todo list, the focus goes back to the
first widget that GTK can find, which is the "All" filter.
This is obviously a counter-productive behaviour, as we want to 
make more efficient the input of tasks.

> _You're telling me an Elder scrolled this?_

Another issue we have is that each time we click a checkbox, the scrolling
state is reset and the list goes back to the top, with the focus also caught
by the first widget GTK can find: the "All" filter.

Both these bugs can be traced to the heavy-handedness of our rendering strategy so far. Starting from a blank slate each time there is an interaction with the
interface is both expensive and gives us these frustrating behaviours. Let's fix it.


[Part 1]: /blog/2026/making-a-gtk-app-in-haskell-part-1/
[Part 2]: /blog/2026/making-a-gtk-app-in-haskell-part-2/

