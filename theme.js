/* Background switcher.
   The palette follows [data-theme] on <html> (set in the page head, before paint);
   this script swaps the backdrop photo and remembers the choice. */
(function () {
  "use strict";

  var KEY = "floreal-theme";
  var WIDTHS = [1000, 1600, 2560];
  var SHOTS = {
    path: { base: "/img/path-", width: 2560, height: 1600 },
    mountains: { base: "/img/mountains-", width: 2560, height: 1708 }
  };

  var root = document.documentElement;
  var nav = document.querySelector(".themes");
  var backdrop = document.querySelector(".backdrop");
  var picture = backdrop && backdrop.querySelector("picture");
  if (!nav || !picture) return;

  var source = picture.querySelector("source");
  var img = picture.querySelector("img");
  /* The markup ships the path photo, whatever the stored theme is. */
  var shown = "path";

  function srcset(base, ext) {
    return WIDTHS.map(function (w) {
      return base + w + "." + ext + " " + w + "w";
    }).join(", ");
  }

  function swap(name) {
    var shot = SHOTS[name];
    backdrop.classList.add("swapping");
    source.srcset = srcset(shot.base, "webp");
    img.srcset = srcset(shot.base, "jpg");
    img.width = shot.width;
    img.height = shot.height;
    img.src = shot.base + "1600.jpg";
    shown = name;

    var done = function () { backdrop.classList.remove("swapping"); };
    if (img.decode) {
      img.decode().then(done, done);
    } else {
      done();
    }
  }

  function apply(name, remember) {
    if (!SHOTS[name]) return;
    root.dataset.theme = name;
    Array.prototype.forEach.call(nav.querySelectorAll("button"), function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.shot === name));
    });
    if (shown !== name) swap(name);
    if (remember) {
      try { localStorage.setItem(KEY, name); } catch (e) { /* private mode */ }
    }
  }

  nav.addEventListener("click", function (event) {
    var button = event.target.closest("button[data-shot]");
    if (button) apply(button.dataset.shot, true);
  });

  nav.hidden = false;
  apply(SHOTS[root.dataset.theme] ? root.dataset.theme : "path", false);
})();
