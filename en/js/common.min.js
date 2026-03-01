/* =============================================
   CalcBox - Common JavaScript (English)
   Free online calculator tools
   ============================================= */

(function () {
  "use strict";

  /* ----- Dark Mode ----- */
  const ThemeManager = {
    STORAGE_KEY: "calcbox-theme",
    DARK: "dark",
    LIGHT: "light",

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.apply(saved);
      } else if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        this.apply(this.DARK);
      } else {
        this.apply(this.LIGHT);
      }

      // Watch for OS theme changes
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.apply(e.matches ? this.DARK : this.LIGHT);
          }
        });

      // Toggle button
      const toggleBtn = document.getElementById("theme-toggle");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => this.toggle());
      }
    },

    apply(theme) {
      document.documentElement.setAttribute("data-theme", theme);
    },

    toggle() {
      const current =
        document.documentElement.getAttribute("data-theme") || this.LIGHT;
      const next = current === this.DARK ? this.LIGHT : this.DARK;
      this.apply(next);
      localStorage.setItem(this.STORAGE_KEY, next);
    },

    get current() {
      return (
        document.documentElement.getAttribute("data-theme") || this.LIGHT
      );
    },
  };

  /* ----- Hamburger Menu ----- */
  const MobileMenu = {
    init() {
      const hamburger = document.getElementById("hamburger");
      const mobileNav = document.getElementById("mobile-nav");
      if (!hamburger || !mobileNav) return;

      hamburger.addEventListener("click", () => this.toggle());

      // Close menu on link click
      mobileNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => this.close());
      });

      // Close on ESC key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.close();
      });
    },

    toggle() {
      const hamburger = document.getElementById("hamburger");
      const mobileNav = document.getElementById("mobile-nav");
      const isOpen = mobileNav.classList.toggle("mobile-nav--open");
      hamburger.classList.toggle("hamburger--active", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    },

    close() {
      const hamburger = document.getElementById("hamburger");
      const mobileNav = document.getElementById("mobile-nav");
      if (!mobileNav) return;
      mobileNav.classList.remove("mobile-nav--open");
      if (hamburger) {
        hamburger.classList.remove("hamburger--active");
        hamburger.setAttribute("aria-expanded", "false");
      }
      document.body.style.overflow = "";
    },
  };

  /* ----- Toast Notifications ----- */
  const Toast = {
    _timeout: null,

    show(message, type, duration) {
      type = type || "default";
      duration = duration || 3000;

      let el = document.getElementById("calcbox-toast");
      if (!el) {
        el = document.createElement("div");
        el.id = "calcbox-toast";
        el.className = "toast";
        document.body.appendChild(el);
      }

      // Clear previous timer
      if (this._timeout) {
        clearTimeout(this._timeout);
      }

      el.textContent = message;
      el.className = "toast";
      if (type !== "default") {
        el.classList.add("toast--" + type);
      }

      // Show
      requestAnimationFrame(() => {
        el.classList.add("toast--visible");
      });

      // Auto-hide
      this._timeout = setTimeout(() => {
        el.classList.remove("toast--visible");
      }, duration);
    },
  };

  /* ----- Utilities ----- */
  const Utils = {
    /** Format number with comma separators */
    formatNumber(num, decimals) {
      decimals = decimals !== undefined ? decimals : 0;
      return Number(num).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    },

    /** Convert input value to number (returns NaN if invalid) */
    parseNum(value) {
      if (typeof value === "string") {
        value = value.replace(/,/g, "").trim();
      }
      var n = Number(value);
      return isFinite(n) ? n : NaN;
    },

    /** Convert date string to Date object */
    parseDate(str) {
      var d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    },

    /** Format date as Month D, YYYY */
    formatDate(date) {
      var months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return (
        months[date.getMonth()] +
        " " +
        date.getDate() +
        ", " +
        date.getFullYear()
      );
    },

    /** Show result card */
    showResult(id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.add("result-card--visible");
        el.style.display = "";
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },

    /** Hide result card */
    hideResult(id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.remove("result-card--visible");
      }
    },
  };

  /* ----- Tool Search ----- */
  const ToolSearch = {
    init() {
      var searchInput = document.getElementById("tool-search");
      if (!searchInput) return;
      searchInput.addEventListener("input", function () {
        ToolSearch.filter(searchInput.value);
      });
    },

    filter(query) {
      var cards = document.querySelectorAll(".tool-card");
      if (!cards.length) return;

      var q = query.trim().toLowerCase();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var title = (card.querySelector(".tool-card__title") || {}).textContent || "";
        var desc = (card.querySelector(".tool-card__desc") || {}).textContent || "";
        var text = (title + " " + desc).toLowerCase();
        var matchesSearch = !q || text.indexOf(q) !== -1;

        // Check category filter as well
        var matchesCategory = true;
        var activeTab = document.querySelector(".category-tab--active");
        if (activeTab) {
          var cat = activeTab.getAttribute("data-category");
          if (cat === "favorites") {
            matchesCategory = Favorites.getAll().indexOf(card.getAttribute("href")) !== -1;
          } else if (cat && cat !== "all") {
            matchesCategory = card.getAttribute("data-category") === cat;
          }
        }

        if (matchesSearch && matchesCategory) {
          card.classList.remove("tool-card--hidden");
          visibleCount++;
        } else {
          card.classList.add("tool-card--hidden");
        }
      });

      var noResults = document.querySelector(".tools-no-results");
      if (noResults) {
        if (visibleCount === 0) {
          noResults.classList.add("tools-no-results--visible");
        } else {
          noResults.classList.remove("tools-no-results--visible");
        }
      }
    },
  };

  /* ----- Category Tabs ----- */
  const CategoryFilter = {
    init() {
      var tabs = document.querySelectorAll(".category-tab");
      if (!tabs.length) return;
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          CategoryFilter.activate(tab);
        });
      });
    },

    activate(tab) {
      // Remove --active from all tabs, add to clicked tab
      document.querySelectorAll(".category-tab").forEach(function (t) {
        t.classList.remove("category-tab--active");
      });
      tab.classList.add("category-tab--active");

      var category = tab.getAttribute("data-category");
      var cards = document.querySelectorAll(".tool-card");
      var searchInput = document.getElementById("tool-search");
      var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var visibleCount = 0;

      cards.forEach(function (card) {
        var matchesCategory = true;
        if (category === "favorites") {
          matchesCategory = Favorites.getAll().indexOf(card.getAttribute("href")) !== -1;
        } else if (category && category !== "all") {
          matchesCategory = card.getAttribute("data-category") === category;
        }

        // Apply search filter on top
        var matchesSearch = true;
        if (q) {
          var title = (card.querySelector(".tool-card__title") || {}).textContent || "";
          var desc = (card.querySelector(".tool-card__desc") || {}).textContent || "";
          var text = (title + " " + desc).toLowerCase();
          matchesSearch = text.indexOf(q) !== -1;
        }

        if (matchesCategory && matchesSearch) {
          card.classList.remove("tool-card--hidden");
          visibleCount++;
        } else {
          card.classList.add("tool-card--hidden");
        }
      });

      var noResults = document.querySelector(".tools-no-results");
      if (noResults) {
        if (visibleCount === 0) {
          noResults.classList.add("tools-no-results--visible");
        } else {
          noResults.classList.remove("tools-no-results--visible");
        }
      }
    },
  };

  /* ----- Favorites ----- */
  const Favorites = {
    STORAGE_KEY: "calcbox-favorites",

    init() {
      var cards = document.querySelectorAll(".tool-card");
      if (!cards.length) return;
      this.render();
      document.addEventListener("click", function (e) {
        var btn = e.target.closest(".tool-card__favorite");
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        var card = btn.closest(".tool-card");
        if (card) {
          Favorites.toggle(card.getAttribute("href"));
        }
      });
    },

    toggle(toolHref) {
      var favs = this.getAll();
      var index = favs.indexOf(toolHref);
      if (index === -1) {
        favs.push(toolHref);
      } else {
        favs.splice(index, 1);
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favs));
      this.render();
    },

    getAll() {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
      } catch (e) {
        return [];
      }
    },

    render() {
      var favs = this.getAll();
      var cards = document.querySelectorAll(".tool-card");
      cards.forEach(function (card) {
        var href = card.getAttribute("href");
        var btn = card.querySelector(".tool-card__favorite");
        if (!btn) {
          btn = document.createElement("button");
          btn.type = "button";
          btn.className = "tool-card__favorite";
          btn.setAttribute("aria-label", "Favorite");
          card.appendChild(btn);
        }
        var isFav = favs.indexOf(href) !== -1;
        btn.innerHTML = isFav ? "&#9733;" : "&#9734;";
        if (isFav) {
          btn.classList.add("tool-card__favorite--active");
        } else {
          btn.classList.remove("tool-card__favorite--active");
        }
      });

      // If favorites category is active, refilter
      var activeTab = document.querySelector(".category-tab--active");
      if (activeTab && activeTab.getAttribute("data-category") === "favorites") {
        CategoryFilter.activate(activeTab);
      }
    },
  };

  /* ----- Recently Used Tools ----- */
  const RecentTools = {
    STORAGE_KEY: "calcbox-recent",
    MAX: 4,

    init() {
      this.recordVisit();
      this.renderOnHomepage();
    },

    recordVisit() {
      // Only record on tool pages (not homepage)
      var path = location.pathname;
      // Check if we're on a tool page (URL has a subdirectory under calcbox)
      var match = path.match(/\/calcbox\/(?:en\/)?([a-z0-9-]+)\//);
      if (!match) {
        // Also handle non-calcbox base paths
        var segments = path.replace(/\/$/, "").split("/");
        var last = segments[segments.length - 1];
        if (!last || last === "index.html" || last === "calcbox" || last === "en") return;
      }

      var title = document.title.replace(/ [-|].*/g, "").trim();
      if (!title) return;

      var href = path;
      // Normalize to relative href matching tool-card href format
      var enIndex = path.indexOf("/calcbox/en/");
      var calcboxIndex = path.indexOf("/calcbox/");
      if (enIndex !== -1) {
        href = path.substring(enIndex + "/calcbox/en/".length);
      } else if (calcboxIndex !== -1) {
        href = path.substring(calcboxIndex + "/calcbox/".length);
      } else {
        href = path.replace(/^\//, "");
      }
      // Ensure trailing slash
      if (href && href.charAt(href.length - 1) !== "/") {
        href += "/";
      }

      if (!href || href === "/" || href === "index.html") return;

      var recent = this._getAll();
      // Remove duplicate
      recent = recent.filter(function (item) {
        return item.href !== href;
      });
      // Add to front
      recent.unshift({ href: href, title: title });
      // Keep only MAX items
      if (recent.length > this.MAX) {
        recent = recent.slice(0, this.MAX);
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recent));
    },

    renderOnHomepage() {
      var container = document.querySelector(".recent-tools");
      if (!container) return;

      var recent = this._getAll();
      if (!recent.length) {
        container.classList.remove("recent-tools--visible");
        return;
      }

      var grid = container.querySelector(".recent-tools__grid");
      if (!grid) return;

      grid.innerHTML = "";
      recent.forEach(function (item) {
        var a = document.createElement("a");
        a.href = item.href;
        a.className = "recent-tools__item";

        var iconDiv = document.createElement("div");
        iconDiv.className = "recent-tools__item-icon";
        iconDiv.textContent = "\u{1F552}";

        var span = document.createElement("span");
        span.textContent = item.title;

        a.appendChild(iconDiv);
        a.appendChild(span);
        grid.appendChild(a);
      });

      container.classList.add("recent-tools--visible");
    },

    _getAll() {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
      } catch (e) {
        return [];
      }
    },
  };

  /* ----- PWA ----- */
  const PWA = {
    init() {
      if ("serviceWorker" in navigator) {
        var basePath = location.pathname.indexOf("/calcbox/") !== -1 ? "/calcbox/" : "/";
        navigator.serviceWorker.register(basePath + "sw.js").catch(function () {});
      }
    },
  };

  /* ----- Calculation History ----- */
  var CalcHistory = {
    STORAGE_KEY: "calcbox-history",
    MAX: 50,

    save: function (tool, input, result) {
      var entries = this.getAll();
      entries.unshift({
        tool: tool,
        input: input,
        result: result,
        timestamp: Date.now(),
      });
      if (entries.length > this.MAX) {
        entries = entries.slice(0, this.MAX);
      }
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
      } catch (e) {}
    },

    getAll: function () {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
      } catch (e) {
        return [];
      }
    },

    clear: function () {
      localStorage.removeItem(this.STORAGE_KEY);
    },

    getByTool: function (toolName) {
      return this.getAll().filter(function (entry) {
        return entry.tool === toolName;
      });
    },
  };

  /* ----- History Modal ----- */
  var HistoryModal = {
    _el: null,

    init: function () {
      var btn = document.getElementById("history-btn");
      if (btn) {
        btn.addEventListener("click", function () {
          HistoryModal.open();
        });
      }
    },

    _create: function () {
      if (this._el) return this._el;

      var overlay = document.createElement("div");
      overlay.className = "history-modal";
      overlay.innerHTML =
        '<div class="history-modal__content">' +
        '<div class="history-modal__header">' +
        '<h2 class="history-modal__title">Calculation History</h2>' +
        '<button type="button" class="history-modal__close" aria-label="Close">&times;</button>' +
        "</div>" +
        '<div class="history-modal__body"></div>' +
        '<div class="history-modal__footer">' +
        '<button type="button" class="btn btn--secondary history-modal__clear">Clear History</button>' +
        "</div>" +
        "</div>";

      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
          HistoryModal.close();
        }
      });

      overlay.querySelector(".history-modal__close").addEventListener("click", function () {
        HistoryModal.close();
      });

      overlay.querySelector(".history-modal__clear").addEventListener("click", function () {
        CalcHistory.clear();
        HistoryModal._render();
        Toast.show("History cleared", "success");
      });

      document.body.appendChild(overlay);
      this._el = overlay;
      return overlay;
    },

    _render: function () {
      if (!this._el) return;
      var body = this._el.querySelector(".history-modal__body");
      var entries = CalcHistory.getAll();

      if (!entries.length) {
        body.innerHTML = '<p class="history-modal__empty">No history</p>';
        return;
      }

      var html = "";
      entries.forEach(function (entry) {
        var date = new Date(entry.timestamp);
        var dateStr =
          date.getFullYear() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getDate() +
          " " +
          ("0" + date.getHours()).slice(-2) +
          ":" +
          ("0" + date.getMinutes()).slice(-2);
        html +=
          '<div class="history-item">' +
          '<div class="history-item__tool">' +
          escapeHtml(entry.tool) +
          "</div>" +
          '<div class="history-item__detail">' +
          '<span class="history-item__input">' +
          escapeHtml(entry.input) +
          "</span>" +
          '<span class="history-item__result">' +
          escapeHtml(entry.result) +
          "</span>" +
          "</div>" +
          '<div class="history-item__date">' +
          dateStr +
          "</div>" +
          "</div>";
      });
      body.innerHTML = html;
    },

    open: function () {
      var el = this._create();
      this._render();
      el.classList.add("history-modal--open");
      document.body.style.overflow = "hidden";
    },

    close: function () {
      if (this._el) {
        this._el.classList.remove("history-modal--open");
        document.body.style.overflow = "";
      }
    },
  };

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* ----- Clipboard Copy ----- */
  var CopyResult = {
    copyText: function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(function () {
          Toast.show("Copied", "success");
        });
      }
      // Fallback
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        Toast.show("Copied", "success");
      } catch (e) {
        Toast.show("Copy failed", "error");
      }
      document.body.removeChild(textarea);
      return Promise.resolve();
    },
  };

  /* ----- Share ----- */
  var ShareResult = {
    share: function (title, text) {
      if (navigator.share) {
        return navigator.share({ title: title, text: text, url: location.href }).catch(function () {});
      }
      return CopyResult.copyText(text);
    },
  };

  /* ----- Keyboard Shortcuts ----- */
  var KeyboardShortcuts = {
    init: function () {
      // Close history modal on Escape (all pages)
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && HistoryModal._el && HistoryModal._el.classList.contains("history-modal--open")) {
          HistoryModal.close();
          return;
        }
      });

      // Tool pages only (when calc-btn exists)
      var calcBtn = document.getElementById("calc-btn");
      if (!calcBtn) return;

      document.addEventListener("keydown", function (e) {
        // Escape: Reset (only when modal is not open)
        if (e.key === "Escape") {
          if (HistoryModal._el && HistoryModal._el.classList.contains("history-modal--open")) return;
          var resetBtn = document.getElementById("reset-btn");
          if (resetBtn) {
            resetBtn.click();
          }
          return;
        }

        // Enter: Execute calculation from input fields
        if (e.key === "Enter" && e.target.matches("input, select")) {
          e.preventDefault();
          var btn = document.getElementById("calc-btn");
          if (btn) {
            btn.click();
          }
        }
      });
    },
  };

  /* ----- Initialize ----- */
  function init() {
    ThemeManager.init();
    MobileMenu.init();
    ToolSearch.init();
    CategoryFilter.init();
    Favorites.init();
    RecentTools.init();
    PWA.init();
    HistoryModal.init();
    KeyboardShortcuts.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ----- Global Exports ----- */
  window.CalcBox = {
    theme: ThemeManager,
    menu: MobileMenu,
    toast: Toast,
    utils: Utils,
    search: ToolSearch,
    category: CategoryFilter,
    favorites: Favorites,
    recent: RecentTools,
    pwa: PWA,
    history: CalcHistory,
    copy: CopyResult,
    share: ShareResult,
  };
})();
