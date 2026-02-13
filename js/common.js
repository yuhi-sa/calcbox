/* =============================================
   CalcBox - 共通JavaScript
   暮らしに役立つ計算ツール集
   ============================================= */

(function () {
  "use strict";

  /* ----- ダークモード ----- */
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

      // OS設定の変更を監視
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.apply(e.matches ? this.DARK : this.LIGHT);
          }
        });

      // 切替ボタン
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

  /* ----- ハンバーガーメニュー ----- */
  const MobileMenu = {
    init() {
      const hamburger = document.getElementById("hamburger");
      const mobileNav = document.getElementById("mobile-nav");
      if (!hamburger || !mobileNav) return;

      hamburger.addEventListener("click", () => this.toggle());

      // メニュー内リンクをクリックしたら閉じる
      mobileNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => this.close());
      });

      // ESCキーで閉じる
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

  /* ----- トースト通知 ----- */
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

      // 前のタイマーをクリア
      if (this._timeout) {
        clearTimeout(this._timeout);
      }

      el.textContent = message;
      el.className = "toast";
      if (type !== "default") {
        el.classList.add("toast--" + type);
      }

      // 表示
      requestAnimationFrame(() => {
        el.classList.add("toast--visible");
      });

      // 自動非表示
      this._timeout = setTimeout(() => {
        el.classList.remove("toast--visible");
      }, duration);
    },
  };

  /* ----- ユーティリティ ----- */
  const Utils = {
    /** 数値を3桁カンマ区切りにフォーマット */
    formatNumber(num, decimals) {
      decimals = decimals !== undefined ? decimals : 0;
      return Number(num).toLocaleString("ja-JP", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    },

    /** 入力値を数値に変換（無効な場合はNaN） */
    parseNum(value) {
      if (typeof value === "string") {
        value = value.replace(/,/g, "").trim();
      }
      var n = Number(value);
      return isFinite(n) ? n : NaN;
    },

    /** 日付文字列をDateオブジェクトに変換 */
    parseDate(str) {
      var d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    },

    /** 日付を YYYY年M月D日 形式にフォーマット */
    formatDate(date) {
      return (
        date.getFullYear() +
        "年" +
        (date.getMonth() + 1) +
        "月" +
        date.getDate() +
        "日"
      );
    },

    /** 結果カードを表示 */
    showResult(id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.add("result-card--visible");
        el.style.display = "";
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },

    /** 結果カードを非表示 */
    hideResult(id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.remove("result-card--visible");
      }
    },
  };

  /* ----- ツール検索 ----- */
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

  /* ----- カテゴリタブ ----- */
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

  /* ----- お気に入り ----- */
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
          btn.setAttribute("aria-label", "お気に入り");
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

  /* ----- 最近使ったツール ----- */
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
      var match = path.match(/\/calcbox\/([a-z0-9-]+)\//);
      if (!match) {
        // Also handle non-calcbox base paths
        var segments = path.replace(/\/$/, "").split("/");
        var last = segments[segments.length - 1];
        if (!last || last === "index.html" || last === "calcbox") return;
      }

      var title = document.title.replace(/ [-|].*/g, "").trim();
      if (!title) return;

      var href = path;
      // Normalize to relative href matching tool-card href format
      var calcboxIndex = path.indexOf("/calcbox/");
      if (calcboxIndex !== -1) {
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

  /* ----- 初期化 ----- */
  function init() {
    ThemeManager.init();
    MobileMenu.init();
    ToolSearch.init();
    CategoryFilter.init();
    Favorites.init();
    RecentTools.init();
    PWA.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ----- グローバル公開 ----- */
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
  };
})();
