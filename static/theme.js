/* Background switcher.
   The palette follows [data-theme] on <html> (set in the page head, before paint);
   this script swaps the backdrop photo and remembers the choice. */
(function () {
  "use strict";

  var KEY = "floreal-theme";

  var root = document.documentElement;
  var nav = document.querySelector(".themes");
  var backdrop = document.querySelector(".backdrop");
  var picture = backdrop && backdrop.querySelector("picture");
  var data = document.getElementById("backdrops");
  if (!nav || !picture || !data) return;

  /* The list comes from config.toml, through the template. */
  var SHOTS = {};
  JSON.parse(data.textContent).forEach(function (shot) {
    SHOTS[shot.id] = shot;
  });

  var source = picture.querySelector("source");
  var img = picture.querySelector("img");
  /* Whichever photo the markup shipped, whatever the stored theme is. */
  var shown = backdrop.dataset.shot;

  function srcset(shot, ext) {
    return shot.widths.map(function (w) {
      return shot.base + w + "." + ext + " " + w + "w";
    }).join(", ");
  }

  function swap(name) {
    var shot = SHOTS[name];
    backdrop.classList.add("swapping");
    source.srcset = srcset(shot, "webp");
    img.srcset = srcset(shot, "jpg");
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
  apply(SHOTS[root.dataset.theme] ? root.dataset.theme : shown, false);
})();
