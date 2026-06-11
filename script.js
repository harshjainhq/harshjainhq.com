/* ============================================================
   Harsh Jain - site script
   - Theme toggle with localStorage persistence
   - Essay contents sidebar/drawer with active section tracking
   - Dynamic footnote tooltips
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "hj-theme";
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme !== "light" && theme !== "dark") theme = "dark";
    root.setAttribute("data-theme", theme);

    var toggles = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    }
  }

  function getInitialTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    return "dark";
  }

  function bindThemeToggle() {
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    toggles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var current = root.getAttribute("data-theme") || "dark";
        var next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      });
    });
  }

  function slugify(text) {
    return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function buildContentsList() {
    var contentsRoot = document.querySelector("[data-contents-list]");
    var headings = Array.prototype.slice.call(document.querySelectorAll(".essay-body h2"));
    if (!contentsRoot || !headings.length) return;

    var list = document.createElement("ol");
    list.className = "contents-list";

    headings.forEach(function (heading) {
      if (!heading.id) heading.id = slugify(heading.textContent);

      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent.trim();
      item.appendChild(link);
      list.appendChild(item);
    });

    contentsRoot.replaceChildren(list);
  }

  function bindContents() {
    var toggle = document.querySelector("[data-contents-toggle]");
    var panel = document.querySelector("[data-contents]");
    var scrim = document.querySelector("[data-contents-scrim]");
    if (!toggle || !panel) return;

    var desktopQuery = window.matchMedia("(min-width: 992px)");

    function setOpen(open, shouldFocus) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.classList.toggle("open", open);
      document.body.classList.toggle("contents-open", open);
      if (scrim) scrim.classList.toggle("open", open);

      if (open && shouldFocus) {
        var firstLink = panel.querySelector("a");
        if (firstLink) firstLink.focus({ preventScroll: true });
      }
    }

    function syncLayoutMode() {
      setOpen(desktopQuery.matches, false);
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open, true);
    });

    if (scrim) scrim.addEventListener("click", function () { setOpen(false, false); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false, false);
        toggle.focus();
      }
    });

    panel.addEventListener("click", function (e) {
      var target = e.target;
      if (target && target.tagName === "A" && !desktopQuery.matches) {
        setOpen(false, false);
      }
    });

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", syncLayoutMode);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(syncLayoutMode);
    }

    syncLayoutMode();
  }

  function bindActiveContents() {
    var panel = document.querySelector("[data-contents]");
    var links = panel ? Array.prototype.slice.call(panel.querySelectorAll("a[href^='#']")) : [];
    if (!links.length) return;

    var headings = links.map(function (link) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      return target ? { link: link, heading: target } : null;
    }).filter(Boolean);
    if (!headings.length) return;

    function updateActiveLink() {
      var scrollPosition = window.pageYOffset + 160;
      var active = headings[0];
      headings.forEach(function (item) {
        var top = item.heading.getBoundingClientRect().top + window.pageYOffset;
        if (top <= scrollPosition) active = item;
      });

      headings.forEach(function (item) {
        var isActive = item === active;
        item.link.classList.toggle("active", isActive);
        if (isActive) {
          item.link.setAttribute("aria-current", "true");
        } else {
          item.link.removeAttribute("aria-current");
        }
      });
    }

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
  }

  function bindFootnotes() {
    var refs = document.querySelectorAll(".footnote-ref");
    refs.forEach(function (ref) {
      var link = ref.querySelector("a");
      if (!link) return;

      var targetId = link.getAttribute("href");
      if (!targetId || targetId[0] !== "#") return;

      var targetEl = document.getElementById(targetId.substring(1));
      if (!targetEl) return;

      var contentHtml = targetEl.innerHTML;
      contentHtml = contentHtml.replace(/<a[^>]*class="footnote-backref"[^>]*>.*?<\/a>/g, "");
      contentHtml = contentHtml.replace(/\u21a9/g, "");

      var tooltip = document.createElement("span");
      tooltip.className = "footnote-tooltip";
      tooltip.innerHTML = contentHtml.trim();
      ref.appendChild(tooltip);
    });
  }

  applyTheme(getInitialTheme());

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(root.getAttribute("data-theme") || getInitialTheme());
    bindThemeToggle();
    buildContentsList();
    bindContents();
    bindActiveContents();
    bindFootnotes();
  });
})();
