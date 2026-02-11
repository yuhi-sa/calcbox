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

  /* ----- 初期化 ----- */
  function init() {
    ThemeManager.init();
    MobileMenu.init();
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
  };
})();
