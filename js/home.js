/**
 * صفحه اصلی: تب‌های دسته‌بندی، جستجوی زنده، فیلترهای سریع و نمایش کارت‌های محصول
 */
document.addEventListener("DOMContentLoaded", () => {
  const { categories, products } = window.MENU;
  const { card, faDigits, esc } = window.App;

  const tabsEl = document.getElementById("categories");
  const gridEl = document.getElementById("products");
  const headEl = document.getElementById("cat-heading");
  const searchEl = document.getElementById("menu-search");
  const filtersEl = document.getElementById("quick-filters");

  const state = {
    cat: window.App.qs("cat") || "all",
    query: "",
    filter: null, // "popular" | "spicy" | "cheap" | null
  };

  if (!categories.some((c) => c.id === state.cat)) state.cat = "all";

  const countOf = (id) => (id === "all" ? products.length : products.filter((p) => p.category === id).length);

  const renderTabs = () => {
    tabsEl.innerHTML = categories
      .map((c) => {
        const on = c.id === state.cat;
        return `
        <button role="tab" aria-selected="${on}" data-cat="${c.id}"
          class="group flex shrink-0 cursor-pointer items-center gap-2.5 rounded-2xl border px-4 py-2 transition-all duration-200
          ${on
            ? "border-shu bg-gradient-to-r from-shu to-shu-dark text-surface shadow-md shadow-shu/25"
            : "border-ink/10 bg-paper/60 text-ink hover:border-ink/25 hover:bg-surface"}">
          <span class="text-lg">${c.icon}</span>
          <span class="text-right leading-tight">
            <span class="block text-xs font-black sm:text-sm">${c.name}</span>
            <span class="block font-brush text-[10px] ${on ? "text-surface/80" : "text-ink-soft"}">${c.jp}</span>
          </span>
          <span class="grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-black ${on ? "bg-surface/20 text-surface" : "bg-ink/[0.06] text-ink-soft"}">${faDigits(countOf(c.id))}</span>
        </button>`;
      })
      .join("");
  };

  const renderQuickFilters = () => {
    if (!filtersEl) return;
    filtersEl.querySelectorAll("[data-filter]").forEach((btn) => {
      const on = btn.dataset.filter === state.filter;
      btn.className = `shrink-0 cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold transition ${
        on
          ? "border-shu bg-shu/12 text-shu shadow-xs"
          : "border-ink/10 bg-paper/60 text-ink-soft hover:border-shu/40 hover:text-ink"
      }`;
    });
  };

  const getFilteredList = () => {
    let list = state.cat === "all" ? [...products] : products.filter((p) => p.category === state.cat);

    const q = state.query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.en.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          (p.ingredients && p.ingredients.some((ing) => ing.toLowerCase().includes(q)))
      );
    }

    if (state.filter === "popular") {
      list = list.filter((p) => Boolean(p.badge));
    } else if (state.filter === "spicy") {
      list = list.filter((p) => p.spicy > 0).sort((a, b) => b.spicy - a.spicy);
    } else if (state.filter === "cheap") {
      list.sort((a, b) => a.price - b.price);
    }

    return list;
  };

  const renderProducts = () => {
    const cat = categories.find((c) => c.id === state.cat);
    const list = getFilteredList();
    const hasActiveFilter = Boolean(state.query.trim() || state.filter);

    headEl.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="grid size-11 place-items-center rounded-2xl bg-shu/10 text-2xl">${cat.icon}</span>
        <div>
          <p class="font-brush text-xs tracking-[.25em] text-shu">${cat.jp}</p>
          <h3 class="text-xl font-black sm:text-2xl">${cat.name}</h3>
        </div>
      </div>
      <div class="flex items-center gap-3">
        ${hasActiveFilter ? `<button type="button" data-reset-filters class="cursor-pointer rounded-lg bg-shu/10 px-2.5 py-1 text-xs font-bold text-shu transition hover:bg-shu hover:text-surface">حذف فیلترها ×</button>` : ""}
        <span class="rounded-full border border-ink/10 bg-surface px-3 py-1 text-xs font-bold text-ink-soft">${faDigits(list.length)} آیتم</span>
      </div>`;

    gridEl.innerHTML = list.length
      ? list.map((p, i) => card(p, i)).join("")
      : `
        <div class="frame col-span-full py-14 text-center">
          <p class="font-brush text-4xl text-ink/25">無</p>
          <p class="mt-2 font-black text-ink">موردی با این فیلتر یافت نشد</p>
          <p class="mt-1 text-xs text-ink-soft">عبارت جستجو یا دسته‌بندی را تغییر دهید.</p>
          <button type="button" data-reset-filters class="btn-ghost mt-4 px-4 py-2 text-xs">نمایش همه غذاها</button>
        </div>`;
  };

  const syncAll = () => {
    renderTabs();
    renderQuickFilters();
    renderProducts();
    history.replaceState(null, "", state.cat === "all" ? location.pathname + location.hash : `?cat=${state.cat}${location.hash}`);
  };

  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.cat = btn.dataset.cat;
    syncAll();
    tabsEl.querySelector(`[data-cat="${state.cat}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });

  searchEl?.addEventListener("input", (e) => {
    state.query = e.target.value;
    renderProducts();
  });

  filtersEl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    const f = btn.dataset.filter;
    state.filter = state.filter === f ? null : f;
    syncAll();
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-reset-filters]")) {
      state.cat = "all";
      state.query = "";
      state.filter = null;
      if (searchEl) searchEl.value = "";
      syncAll();
    }
  });

  syncAll();
});
