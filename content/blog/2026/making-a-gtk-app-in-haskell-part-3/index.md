+++
title = "Making a GTK application in Haskell, part 3"
date = 2026-10-12

[taxonomies]
tags = ["haskell", "gtk"]
categories = ["Tutorial"]
authors = ["Feriel Choutri de Tarlé"]
+++

In [Part 1], we showed how to build a minimal application using The Elm Architecture.

In [Part 2] we added more features to mark a task as done, delete it,
and filter the list on the tasks' status

We will now address some deficiencies that negatively impact the user experience
of the application, such as focus behaviour.
<!-- more -->

---

_To keep this post readable, the code that you will see will not be complete,
in order for me to underline the main concepts.<br>_
_You can find the whole project at <https://github.com/Floreal-Technologies/adwaita-todo>._

---

## The bugs

Upon inserting a new entry in our todo list, the focus goes back to the
first widget that GTK can find, which is the "All" filter.
This is obviously a counter-productive behaviour, as we want to
make more efficient the input of tasks.

<figure>
  <video controls>
    <source src="/blog/2026/making-a-gtk-app-in-haskell-part-3/pizza-focus.mp4" type="video/mp4"/>
  </video>

  <figcaption> 
    Hocus Pocus, there's pizza on your Focus
  </figcaption>
</figure>

---

Another issue we have is that each time we click a checkbox, the scrolling
state is reset and the list goes back to the top, with the focus also caught
by the first widget GTK can find: the "All" filter.

<figure>
  <video controls>
    <source src="/blog/2026/making-a-gtk-app-in-haskell-part-3/elder-scrolling.mp4" type="video/mp4"/>
  </video>

  <figcaption> 
    You're telling me an Elder scrolled this?
  </figcaption>
</figure>

Both these bugs can be traced to the heavy-handedness of our rendering strategy
so far. Starting from a blank slate each time there is an interaction with the
interface is both expensive and gives us these frustrating behaviours. Let's
fix it.

## Split the view 

One possible solution is to split our `view` function into three parts:

<dl>
  <dt><b>Build</b></dt>
  <dd>Widgets are assembled</dd>

  <dt><b>Connect</b></dt>
  <dd>Handlers are attached to the widgets</dd>

  <dt><b>Render</b></dt>
  <dd>Build the new model from the old, with only changed widgets being redrawn</dd>
</dl>

Once we start separating the concerns of building widgets, plugging the signals and performing rendering, the flow of data becomes clearer.

### Build

Let's define a record of our expected widgets:

```haskell,name=src/Todo/View.hs
data Widgets = Widgets
  { window :: Adw.ApplicationWindow
  , filters :: Adw.ToggleGroup
  , entry :: Adw.EntryRow
  , todoList :: Gtk.ListBox
  , count :: Gtk.Label
  }
```

We are then going to strip the existing `view` function of
everything related to handlers. It will only build the above
widgets, and become our `build` function:

```diff
-view
-  :: (Message -> IO ())
-  -> Model
-  -> IO Gtk.Widget
-view dispatch model = do
+build :: Adw.Application -> IO Widgets
+build app = do
   entry <- new Adw.EntryRow [#title := "New task"]
-  on entry #entryActivated $ do
-    text <- Gtk.editableGetText entry
-    dispatch (Add text)
   entryBox <- newBoxedList
   Gtk.listBoxAppend entryBox entry
 
   todoList <- newBoxedList
-  forM_ (Map.filter (matches model.filter) model.todos) $ \todo -> do
-    row <- todoRow dispatch todo
-    Gtk.listBoxAppend todoList row
 
   content <-
     new
@@ -46,7 +52,7 @@ view dispatch model = do
       [ #child := clamp
       ]
 
-  count <- new Gtk.Label [#label := Text.show (Map.size model.todos)]
+  count <- new Gtk.Label []
   footer <-
     new
       Gtk.Box
@@ -59,12 +65,6 @@ view dispatch model = do
   Gtk.boxAppend footer count
 
   filters <- filterGroup
-  Adw.toggleGroupSetActive filters (fromIntegral (fromEnum model.filter))
-  on filters (PropertyNotify #active) $ \_ -> do
-    index <- Adw.toggleGroupGetActive filters
-    forM_ (lookup index (zip [0 ..] allFilters)) $ \newFilter ->
-      dispatch (SetFilter newFilter)
-
   header <-
     new
       Adw.HeaderBar
@@ -73,7 +73,52 @@ view dispatch model = do
   toolbar <- new Adw.ToolbarView [#content := scrolled]
   Adw.toolbarViewAddTopBar toolbar header
   Adw.toolbarViewAddBottomBar toolbar footer
-  Gtk.toWidget toolbar
+
+  window <-
+    new
+      Adw.ApplicationWindow
+      [ #application := app
+      , #title := "Todos"
+      , #defaultWidth := 480
+      , #defaultHeight := 640
+      , #content := toolbar
+      ]
+  pure Widgets {window, filters, entry, todoList, count}
```


### Connect

Our `connect` function will take a dispatching function, our widget record, and perform the signal handling that we have removed from above:

```haskell
connect :: (Message -> IO ()) -> Widgets -> IO ()
connect dispatch widgets = do
  on widgets.entry #entryActivated $ do
    text <- Gtk.editableGetText widgets.entry
    dispatch (Add text)
    Gtk.editableSetText widgets.entry ""

  on widgets.filters (PropertyNotify #active) $ \_ -> do
    index <- Adw.toggleGroupGetActive widgets.filters
    for_ (lookup index (zip [0 ..] allFilters)) $ \newFilter ->
      dispatch (SetFilter newFilter)

  pure ()
```

### Render

```haskell
render
  :: (Message -> IO ())
  -> Widgets
  -> Maybe Model
  -> Model
  -> IO ()
render dispatch widgets previous model = do
  -- Apply an action on a field of the 'Widgets' record
  -- if the content of the previous and the current model differ.
  let changed :: (Eq a) => (Model -> a) -> (a -> IO ()) -> IO ()
      changed field action =
        when (fmap field previous /= Just (field model)) (action (field model))

  -- Should the 'filter' field change, let's make its toggle the active one
  changed (.filter) $ \newFilter ->
    Adw.toggleGroupSetActive widgets.filters (fromIntegral (fromEnum newFilter))

  -- Should the amount of tasks to do change, let's display its new value
  changed (Map.size . (.todos)) $ \size ->
    Gtk.labelSetLabel widgets.count (Text.show size) 

  -- The rows are still built again on each render
  Gtk.listBoxRemoveAll widgets.todoList
  forM_ (Map.filter (matches model.filter) model.todos) $ \todo -> do
    row <- todoRow dispatch todo
    Gtk.listBoxAppend widgets.todoList row
```

---

It is now time to wire everything in the `Runtime` module.

Since we now build the window in the View, we do not have to do it here anymore:

```diff,name=src/Todo/Runtime.hs
 run :: Adw.Application -> IO ()
 run app = do
-  window <-
-    new
-      Adw.ApplicationWindow
-      [ #application := app
-      , #title := "Todos"
-      , #defaultWidth := 480
-      , #defaultHeight := 640
-      ]
   ref <- newIORef Model.init
+  widgets <- View.build app
```

Then, the `step` helper, which you may recall from our previous installments, calls to `render` with the widgets, the old model and the new model:

```diff,name=src/Todo/Runtime.hs
 step :: Model.Message -> IO ()
 step message = do
   oldModel <- readIORef ref
   let newModel = Model.update message oldModel
-  content <- View.view dispatch newModel
-  Adw.applicationWindowSetContent window (Just content)
+  View.render dispatch widgets (Just oldModel) newModel
```

And we conclude by connecting our widgets to the signal handlers, and proceeding with the actual rendering to widgets:

```diff,name=src/Todo/Runtime.hs
      step :: Model.Message -> IO ()
      step message = do
        oldModel <- readIORef ref
        let newModel = Model.update message oldModel
        writeIORef ref newModel
        View.render dispatch widgets (Just oldModel) newModel
-  content <- View.view dispatch Model.init
-  Adw.applicationWindowSetContent window (Just content)
-  Gtk.windowPresent window
+  View.connect dispatch widgets
+  View.render dispatch widgets Nothing Model.init
+  Gtk.windowPresent widgets.window
```

Giving us this `run` function:

```haskell,name=src/Todo/Runtime.hs
run :: Adw.Application -> IO ()
run app = do
  ref <- newIORef Model.init
  widgets <- View.build app
  let {- rec -}
      dispatch :: Model.Message -> IO ()
      dispatch message =
        void $ GLib.idleAdd GLib.PRIORITY_DEFAULT $ do
          step message
          pure GLib.SOURCE_REMOVE

      step :: Model.Message -> IO ()
      step message = do
        oldModel <- readIORef ref
        let newModel = Model.update message oldModel
        writeIORef ref newModel
        View.render dispatch widgets (Just oldModel) newModel

  View.connect dispatch widgets
  View.render dispatch widgets Nothing Model.init
  Gtk.windowPresent widgets.window
```

And indeed it works, focus is not lost!

<figure>
  <video controls>
    <source src="/blog/2026/making-a-gtk-app-in-haskell-part-3/we-have-focus-at-home.mp4" type="video/mp4"/>
  </video>

  <figcaption> 
   We have focus at home! 
  </figcaption>
</figure>

---

## Doom-scrolling

Let's now implement selective re-rendering for our task rows.

Since indiscriminately re-painting those widgets gets us back at the top of the list,
we want to keep finer track of them in the widgets, and we will diff them by hand.

This technique is not very different from virtual DOMs in the web frontend world.

### Row

Since user-defined types are cheap in Haskell, let's create our own record
for a row. It holds the Adwaita `ActionRow` and the GTK check button:

```haskell,name=src/Todo/View.hs
data Row = Row
  { actionRow :: Adw.ActionRow
  , check :: Gtk.CheckButton
  }
```

The rows on the screen are state, like the model. The runtime owns the model,
so it owns the rows too, in a `Map` from `TodoId` to `Row`:

```diff,name=src/Todo/Runtime.hs
-  ref <- newIORef Model.init
   widgets <- View.build app
+  modelRef <- newIORef Model.init
+  rowsRef <- newIORef Map.empty
```

`render` takes the rows that are on the screen, and gives back the rows that
are on the screen after the render:

```diff,name=src/Todo/Runtime.hs
       step message = do
-        oldModel <- readIORef ref
-        let newModel = Model.update message oldModel
-        writeIORef ref newModel
-        View.render dispatch widgets (Just oldModel) newModel
+        oldModel <- readIORef modelRef
+        oldRows <- readIORef rowsRef
+        let newModel = Model.update message oldModel
+        newRows <- View.render dispatch widgets oldRows (Just oldModel) newModel
+        writeIORef modelRef newModel
+        writeIORef rowsRef newRows

   View.connect dispatch widgets
-  View.render dispatch widgets Nothing Model.init
+  rows <- View.render dispatch widgets Map.empty Nothing Model.init
+  writeIORef rowsRef rows
   Gtk.windowPresent widgets.window
```

The View keeps no state of its own. It reads and writes widgets, and that is all.

### Render the rows

`render` gets the rows as a new parameter, and gives back the new rows:

```diff,name=src/Todo/View.hs
 render
   :: (Message -> IO ())
   -> Widgets
+  -> Map TodoId Row
   -> Maybe Model
   -> Model
-  -> IO ()
-render dispatch widgets previous model = do
+  -> IO (Map TodoId Row)
+render dispatch widgets rows previous model = do
```

It stops rebuilding the list. It hands the rows to a new function:

```diff,name=src/Todo/View.hs
-  -- The rows are still built again on each render
-  Gtk.listBoxRemoveAll widgets.todoList
-  forM_ (Map.filter (matches model.filter) model.todos) $ \todo -> do
-    row <- todoRow dispatch todo
-    Gtk.listBoxAppend widgets.todoList row
+  renderRows dispatch widgets rows previous model
```

`renderRows` does the diff by hand, in two steps. Before the first step,
it moves the focus out of the rows that leave. More on that in a moment.

```haskell,name=src/Todo/View.hs
-- | Make the rows match the todos of the model.
renderRows
  :: (Message -> IO ())
  -> Widgets
  -> Map TodoId Row
  -> Maybe Model
  -> Model
  -> IO (Map TodoId Row)
renderRows dispatch widgets rows previous model = do
  let visible todoId = maybe False (matches model.filter) (Map.lookup todoId model.todos)
      (staying, leaving) = Map.partitionWithKey (\todoId _ -> visible todoId) rows

  -- A row that goes away takes the focus with it. Move the focus first.
  keepFocus widgets leaving staying

  -- Step 1: Remove the rows of the todos that do not exist any more.
  for_ (Map.difference rows model.todos) $ \row ->
    Gtk.listBoxRemove widgets.todoList row.actionRow

  -- Step 2: Create or change the rows, in the order of the todos.
  next <- for (zip [0 ..] (Map.toAscList model.todos)) $ \(index, (todoId, todo)) -> do
    row <- case Map.lookup todoId rows of
      Nothing -> insertRow dispatch widgets index model.filter todo
      Just row -> do
        refreshRow previous model todo row
        pure row
    pure (todoId, row)
  pure (Map.fromList next)
```

<dl>
  <dt><b>Step 1</b></dt>
  <dd>
  <code>Map.difference rows model.todos</code> gives the rows whose todo
  is gone. We remove them from the list box.
  </dd>

  <dt><b>Step 2</b></dt>
  <dd>
  We walk the todos in order of their identifier.
  A todo without a row gets a new one at its index.
  A todo with a row gets <code>refreshRow</code>.
  </dd>
</dl>

The filter only hides rows. <code>insertRow</code> and <code>refreshRow</code>
set the visibility, so that switching from "All" to "Active" and back does not
rebuild anything.

### _A note on the focus_

A row that leaves can hold focus. For instance, the user pressed Tab to its
delete button, or clicked its check under the "Active" filter. GTK will not
immediately drop the focus when the focused widget goes away.
It moves the focus after the next paint, to the first parent that accepts it.

For a hidden row, that parent is the list box, and the next Tab goes to the
first row. For a removed row, the parent is already gone, and the focus goes to
the first row at once. In both cases the user lands at the top of the list,
which is a counter-productive behaviour.

So the rows that leave give the focus away first, while they are still in the
list box. `staying` holds the rows that are visible after this render, so the
focus never lands on a row that leaves in the same render:

```haskell,name=src/Todo/View.hs
keepFocus :: Widgets -> Map TodoId Row -> Map TodoId Row -> IO ()
keepFocus widgets leaving staying = do
  -- Step 1: Get the row that holds the focus, if any
  focused <- Gtk.widgetGetFocusChild widgets.todoList
  for_ focused $ \focusedRow -> do
    -- Step 2: Find out if that row leaves
    leavingRows <- for (Map.toList leaving) $ \(todoId, row) -> do
      widget <- Gtk.toWidget row.actionRow
      pure (widget, todoId)
    for_ (lookup focusedRow leavingRows) $ \todoId -> do
      -- Step 3: Pick the nearest row that stays
      let (earlier, later) = Map.split todoId staying
          target = Map.lookupMin later <|> Map.lookupMax earlier
      -- Step 4: Give it the focus
      moved <- case target of
        Just (_, row) -> Gtk.widgetGrabFocus row.actionRow
        Nothing -> pure False
      unless moved $ void (Gtk.widgetGrabFocus widgets.entry)
```

Step by step:

1. GTK keeps a chain of "focus children": each ancestor of the focused widget
   records which of its children leads to it. `widgetGetFocusChild` on the list
   box gives the row that holds the focus, whether the focus is on the row
   itself or on one of its buttons.
2. `lookup` finds that row among the leaving rows, and gives its identifier.
3. `Map.split` gives us the staying rows before and after it. The next one
   wins, else the previous one. This is the same rule as the list box's own
   arrow-key navigation.
4. `widgetGrabFocus` gives the focus to that row. If no row stays, the entry
   takes the focus.

A filter switch can hide the focused row and show the target row in the same
render. At this point, `refreshRow` has not run on the target row, and the row
is still hidden.
`widgetGrabFocus` does not care. `widgetChildFocus` refuses a hidden row, so
it is the wrong tool here.

The two helpers are short. `insertRow` builds a row, sets its visibility one
time, and puts it at its index:

```haskell,name=src/Todo/View.hs
insertRow :: (Message -> IO ()) -> Widgets -> Int32 -> Filter -> Todo -> IO Row
insertRow dispatch widgets index activeFilter todo = do
  row <- todoRow dispatch todo
  Gtk.widgetSetVisible row.actionRow (matches activeFilter todo)
  Gtk.listBoxInsert widgets.todoList row.actionRow index
  pure row
```

`refreshRow` is the `changed` of `render`, one level down. A field is now a
function of the model and of the todo of the row. The old value comes from the
previous model, when it has the todo. With no old value, the property is set:

```haskell,name=src/Todo/View.hs
refreshRow :: Maybe Model -> Model -> Todo -> Row -> IO ()
refreshRow previous model todo row = do
  let changed :: (Eq a) => (Model -> Todo -> a) -> (a -> IO ()) -> IO ()
      changed field action = do
        let before = do
              old <- previous
              oldTodo <- Map.lookup todo.id old.todos
              pure (field old oldTodo)
        when (before /= Just (field model todo)) (action (field model todo))

  changed (\_ t -> t.title) (Adw.preferencesRowSetTitle row.actionRow)
  changed (\_ t -> t.done) (Gtk.checkButtonSetActive row.check)
  changed (\m t -> matches m.filter t) (Gtk.widgetSetVisible row.actionRow)
```

This deserves a closer look: A live widget does not know who set its
property. `checkButtonSetActive` emits `toggled` exactly as a click does, and
our handler from [Part 2] sends `SetDoneStatus id done` back to the runtime.
This echo is harmless, for two reasons:

- The message carries the value that the model already has (so`update`
  changes nothing).
- `refreshRow` sets the property only when the model changed. So the echo
  happens only when the user clicked the check, and the model already
  agrees with the widget.

Keep this echo in mind. It is harmless here, but it decides the shape of a
widget later in this post.

Finally, `todoRow` returns a `Row` instead of a bare `ActionRow`:

```diff,name=src/Todo/View.hs
 todoRow
   :: (Message -> IO ())
   -> Todo
-  -> IO Adw.ActionRow
+  -> IO Row
 todoRow dispatch todo = do
   check <- new Gtk.CheckButton [#active := todo.done]
   on check #toggled $ do
     active <- Gtk.checkButtonGetActive ?self
     dispatch (SetDoneStatus todo.id active)
 -- […]
   on delete #clicked (dispatch (Delete todo.id))
-  row <- new Adw.ActionRow [#title := todo.title, #useMarkup := False]
-  Adw.actionRowAddSuffix row check
-  Adw.actionRowAddSuffix row delete
-  pure row
+  actionRow <- new Adw.ActionRow [#title := todo.title, #useMarkup := False]
+  Adw.actionRowAddSuffix actionRow check
+  Adw.actionRowAddSuffix actionRow delete
+  pure Row {actionRow, check}
```

The handlers capture the todo's `id`, a plain value, and read the button from
`?self`. The reason is the same as in [Part 2]: a handler that captures
`check` keeps the button alive after its row is deleted.

With this, a click on a check changes one property of one widget. The list
keeps its scroll position, and the focus stays near the row that left.

---

## Toggle all

With the rows in place, let's add a feature: one click marks every task as
done, or as not done when all are done already.

The model side is small. A predicate, a message, and a case in `update`:

```diff,name=src/Todo/Model.hs
+-- | True when there is at least one todo and all todos are done.
+allDone :: Model -> Bool
+allDone model =
+  not (Map.null model.todos) && all (\todo -> todo.done) model.todos
```

```diff,name=src/Todo/Model.hs
 data Message
   = Add Text
   | SetDoneStatus TodoId Bool
+  | ToggleAll
   | Delete TodoId
   | SetFilter Filter
   deriving stock (Eq, Show)
```

```diff,name=src/Todo/Model.hs
   SetDoneStatus todoId value ->
     model {todos = Map.adjust (\todo -> todo {done = value}) todoId model.todos}
+  ToggleAll ->
+    let value = not (allDone model)
+    in model {todos = Map.map (\todo -> todo {done = value}) model.todos}
```

### A button, not a check button

The obvious widget is a check button: checked when all tasks are done, with
a message `SetAllDone Bool`. Let's follow that idea to its end.

All tasks are done, so the toggle-all check is checked. The user clears the
check of one task. `render` runs, `allDone` is now `False`, and `render`
clears the toggle-all check. That is a set property on a live widget. As we
saw with `refreshRow`, it emits `toggled` exactly as a click does. The
handler sends `SetAllDone False`. Every task becomes not done.

The two rules that made the echo harmless earlier do not help here. The
message does not carry a value that the model already has: the model has
one task not done, the message says all. And `render` did change the widget,
so "set only what changed" does not skip it.

A plain button has no state that `render` sets. Code never emits `clicked`,
so the handler only ever reports a user action, and a relative message is
safe. So, a button:

```diff,name=src/Todo/View.hs
 data Widgets = Widgets
   { window :: Adw.ApplicationWindow
   , filters :: Adw.ToggleGroup
   , entry :: Adw.EntryRow
+  , toggleAll :: Gtk.Button
   , todoList :: Gtk.ListBox
   , count :: Gtk.Label
   }
```

`build` creates it and puts it in the prefix of the entry row, where it
reads as "act on the list":

```diff,name=src/Todo/View.hs
 build app = do
+  -- A button, not a check button. See 'connect'.
+  toggleAll <-
+    new
+      Gtk.Button
+      [ #iconName := "object-select-symbolic"
+      , #valign := Gtk.AlignCenter
+      , #cssClasses := ["flat"]
+      ]
   entry <- new Adw.EntryRow [#title := "New task"]
+  Adw.entryRowAddPrefix entry toggleAll
   entryBox <- newBoxedList
   Gtk.listBoxAppend entryBox entry
```

```diff,name=src/Todo/View.hs
-  pure Widgets {window, filters, entry, todoList, count}
+  pure Widgets {window, filters, entry, toggleAll, todoList, count}
```

`connect` attaches the handler, once:

```diff,name=src/Todo/View.hs
     Gtk.editableSetText widgets.entry ""
+  -- Toggle-all is a button on purpose. Assume a check button with
+  -- `SetAllDone Bool`, and all todos done. The user clears one check.
+  -- Render clears the toggle-all check, its `toggled` sends
+  -- `SetAllDone False`, and every todo becomes not done. A button has
+  -- no state that render sets, so code never emits `clicked`, and the
+  -- relative message `ToggleAll` is safe.
+  on widgets.toggleAll #clicked (dispatch ToggleAll)
   on widgets.filters (PropertyNotify #active) $ \_ -> do
```

The button still has two things to show: what a click will do, and whether
a click makes sense at all. `render` sets both with `changed`, so they are
set only when the answer changes:

```diff,name=src/Todo/View.hs
   changed (Map.size . (.todos)) $ \size ->
     Gtk.labelSetLabel widgets.count (Text.show size)
+  changed allDone $ \done ->
+    Gtk.widgetSetTooltipText widgets.toggleAll (Just (toggleAllTooltip done))
+  changed (not . Map.null . (.todos)) (Gtk.widgetSetSensitive widgets.toggleAll)
```

```haskell,name=src/Todo/View.hs
toggleAllTooltip :: Bool -> Text
toggleAllTooltip True = "Mark all as not done"
toggleAllTooltip False = "Mark all as done"
```

A tooltip and a sensitivity flag emit no signal that we listen to.

---

We now have a view that builds its widgets once, changes only what the model
changed, and keeps both the scroll position and the focus across renders.
Along the way, the echo of a set property told us which widget to pick for
toggle-all.

[Part 1]: /blog/2026/making-a-gtk-app-in-haskell-part-1/
[Part 2]: /blog/2026/making-a-gtk-app-in-haskell-part-2/

