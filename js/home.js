/**
 * صفحه اصلی: تب‌های دسته‌بندی و نمایش محصولات مرتبط زیر آن
 */
document.addEventListener("DOMContentLoaded", () => {
  const { categories, products } = window.MENU;
  const { card, faDigits } = window.App;

  const tabsEl = document.getElementById("categories");
  const gridEl = document.getElementById("products");
  const headEl = document.getElementById("cat-heading");

  const countOf = (id) => (id === "all" ? products.length : products.filter((p) => p.category === id).length);

  const renderTabs = (active) => {
    tabsEl.innerHTML = categories
      .map((c) => {
        const on = c.id === active;
        return `
        <button role="tab" aria-selected="${on}" data-cat="${c.id}"
          class="group flex shrink-0 cursor-pointer items-center gap-3 rounded-full border px-5 py-2.5 transition-all duration-200
          ${on ? "border-shu bg-shu text-paper shadow-lg shadow-shu/25" : "border-ink/15 bg-paper/70 hover:border-ink/40"}">
          <span class="text-xl">${c.icon}</span>
          <span class="text-right leading-tight">
            <span class="block text-sm font-bold">${c.name}</span>
            <span class="block font-brush text-[11px] ${on ? "text-paper/80" : "text-ink-soft"}">${c.jp}</span>
          </span>
          <span class="grid min-w-6 place-items-center rounded-full px-1.5 text-[11px] font-bold ${on ? "bg-paper/20" : "bg-ink/5"}">${faDigits(countOf(c.id))}</span>
        </button>`;
      })
      .join("");
  };

  const renderProducts = (active) => {
    const cat = categories.find((c) => c.id === active);
    const list = active === "all" ? products : products.filter((p) => p.category === active);

    headEl.innerHTML = `
      <div>
        <p class="font-brush text-sm tracking-[.3em] text-shu">${cat.jp}</p>
        <h3 class="text-2xl font-black">${cat.name}</h3>
      </div>
      <p class="text-sm text-ink-soft">${faDigits(list.length)} آیتم</p>`;

    gridEl.innerHTML = list.length
      ? list.map((p, i) => card(p, i)).join("")
      : `<p class="col-span-full py-16 text-center text-ink-soft">موردی یافت نشد.</p>`;
  };

  const select = (id, { scroll = false } = {}) => {
    if (!categories.some((c) => c.id === id)) id = "all";
    renderTabs(id);
    renderProducts(id);
    history.replaceState(null, "", id === "all" ? location.pathname + location.hash : `?cat=${id}${location.hash}`);
    if (scroll) headEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    select(btn.dataset.cat);
    tabsEl.querySelector(`[data-cat="${btn.dataset.cat}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });

  select(window.App.qs("cat") || "all");
});
