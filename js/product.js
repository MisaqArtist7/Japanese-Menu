/**
 * صفحه تک محصول: جزئیات، انتخاب تعداد، افزودنی‌های پیشنهادی، افزودن به سبد و خرید
 */
document.addEventListener("DOMContentLoaded", () => {
  const { categories, products } = window.MENU;
  const { getProduct, qs, toman, faDigits, esc, Cart, toast, card } = window.App;

  const p = getProduct(qs("id"));
  const root = document.getElementById("product");

  if (!p) {
    root.innerHTML = `
      <div class="frame mx-auto max-w-lg p-12 text-center">
        <p class="font-brush text-5xl text-shu">無</p>
        <h1 class="mt-4 text-2xl font-black">غذای مورد نظر پیدا نشد</h1>
        <p class="mt-2 text-sm text-ink-soft">ممکن است آدرس تغییر کرده باشد یا غذا در منو موجود نباشد.</p>
        <a href="index.html#menu" class="btn-primary mt-8">بازگشت به منو</a>
      </div>`;
    document.getElementById("mobile-bar")?.remove();
    return;
  }

  const cat = categories.find((c) => c.id === p.category);
  document.title = `${p.name} | ساکورا رامن`;

  document.getElementById("breadcrumb").innerHTML = `
    <a href="index.html" class="transition hover:text-shu">🏠 خانه</a>
    <span class="text-ink/25">/</span>
    <a href="index.html?cat=${cat.id}#menu" class="transition hover:text-shu">${cat.icon} ${cat.name}</a>
    <span class="text-ink/25">/</span>
    <span class="font-black text-ink">${esc(p.name)}</span>`;

  const spicyBar = [1, 2, 3]
    .map((n) => `<span class="h-2 w-6 rounded-full ${n <= p.spicy ? "bg-shu" : "bg-ink/10"}"></span>`)
    .join("");

  const toppings = p.category !== "topping" ? products.filter((x) => x.category === "topping").slice(0, 4) : [];

  let qty = 1;

  root.innerHTML = `
    <div class="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <!-- Visual Stage -->
      <div class="lg:col-span-6">
        <div class="dish-stage frame sticky top-24 flex aspect-square items-center justify-center overflow-hidden p-8 md:p-12 animate-fade-up">
          <div class="pointer-events-none absolute top-8 left-8 size-24 rounded-full bg-gradient-to-br from-shu to-shu-dark opacity-90 shadow-glow md:size-28"></div>
          <img src="${p.image}" alt="${esc(p.name)}" class="dish-img mask-fade relative z-10 mx-auto size-full max-w-md object-contain transition duration-500 hover:scale-105" />
          <span class="hanko absolute top-6 right-6 z-20 px-2.5 py-3.5 text-lg vertical-jp">${p.jp}</span>
          ${p.badge ? `<span class="absolute bottom-6 right-6 z-20 rounded-2xl bg-ink/90 px-4 py-2 text-xs font-bold text-paper shadow-lg backdrop-blur-md">✨ ${esc(p.badge)}</span>` : ""}
        </div>
      </div>

      <!-- Product Details -->
      <div class="flex flex-col lg:col-span-6 animate-fade-up" style="animation-delay:70ms">
        <div class="frame p-6 sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="index.html?cat=${cat.id}#menu" class="inline-flex items-center gap-2 rounded-xl bg-shu/10 px-3.5 py-1.5 text-xs font-bold text-shu transition hover:bg-shu hover:text-surface">
              <span>${cat.icon}</span>
              <span>${cat.name}</span>
            </a>
            <span class="font-display text-xl text-ink-soft" dir="ltr">${p.en}</span>
          </div>

          <h1 class="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">${esc(p.name)}</h1>
          <p class="mt-4 text-sm leading-8 text-ink-soft sm:text-base">${esc(p.description)}</p>

          <!-- Nutrition & Prep Bento Widgets -->
          <dl class="mt-7 grid grid-cols-3 gap-3 text-center">
            <div class="rounded-2xl border border-ink/[0.07] bg-paper/70 p-3.5">
              <dt class="text-[11px] text-ink-soft">⏱ آماده‌سازی</dt>
              <dd class="mt-1 text-sm font-black sm:text-base">${p.time}</dd>
            </div>
            <div class="rounded-2xl border border-ink/[0.07] bg-paper/70 p-3.5">
              <dt class="text-[11px] text-ink-soft">🔥 انرژی</dt>
              <dd class="mt-1 text-sm font-black sm:text-base">${faDigits(p.calories)} کالری</dd>
            </div>
            <div class="rounded-2xl border border-ink/[0.07] bg-paper/70 p-3.5">
              <dt class="text-[11px] text-ink-soft">🌶 درجه تندی</dt>
              <dd class="mt-2.5 flex justify-center gap-1">${spicyBar}</dd>
            </div>
          </dl>

          <!-- Ingredients -->
          <div class="mt-7">
            <h2 class="mb-2.5 text-xs font-black tracking-wide text-ink-soft">مواد تشکیل‌دهنده</h2>
            <ul class="flex flex-wrap gap-2">
              ${p.ingredients.map((x) => `<li class="rounded-xl border border-ink/10 bg-surface px-3.5 py-1.5 text-xs font-bold text-ink shadow-2xs">${esc(x)}</li>`).join("")}
            </ul>
          </div>

          ${toppings.length ? `
            <div class="mt-7">
              <div class="mb-2.5 flex items-center justify-between">
                <h2 class="text-xs font-black text-ink-soft">🥚 افزودنی‌های پیشنهادی کنار غذا</h2>
                <span class="text-[11px] text-ink-soft">افزودن با یک کلیک</span>
              </div>
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                ${toppings.map((t) => `
                  <button type="button" data-quick-add="${t.id}" class="group flex cursor-pointer items-center gap-2 rounded-2xl border border-ink/10 bg-paper/60 p-2 text-right transition hover:border-shu hover:bg-surface">
                    <img src="${t.image}" alt="${esc(t.name)}" class="dish-img size-10 shrink-0 rounded-xl object-contain" />
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-xs font-black group-hover:text-shu">${esc(t.name)}</p>
                      <p class="text-[10px] font-bold text-ink-soft">+ ${faDigits((t.price / 1000).toLocaleString("en-US"))} هزار</p>
                    </div>
                  </button>`).join("")}
              </div>
            </div>` : ""}

          <div class="ink-divider my-7"></div>

          <!-- Price & Stepper -->
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="text-xs text-ink-soft">مبلغ قابل پرداخت</p>
              <p class="mt-0.5 text-2xl font-black text-shu sm:text-3xl" data-total>${toman(p.price)}</p>
            </div>

            <div class="flex items-center gap-1.5 rounded-2xl border border-ink/12 bg-paper p-1.5" aria-label="تعداد">
              <button type="button" data-qty="+1" class="grid size-10 cursor-pointer place-items-center rounded-xl text-xl font-bold transition hover:bg-shu hover:text-surface">+</button>
              <span data-qty-val class="w-10 text-center text-lg font-black">۱</span>
              <button type="button" data-qty="-1" class="grid size-10 cursor-pointer place-items-center rounded-xl text-xl font-bold transition hover:bg-ink hover:text-surface">−</button>
            </div>
          </div>

          <!-- Desktop Action Buttons -->
          <div class="mt-6 hidden gap-3 md:flex">
            <button type="button" data-buy class="btn-primary flex-1 py-4 text-base">
              <span>خرید و تکمیل سفارش</span>
              <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
            </button>
            <button type="button" data-add class="btn-ghost px-6 py-4 text-base">＋ افزودن به سبد</button>
          </div>

          <div class="mt-5 flex items-center gap-3 rounded-2xl border border-shu/15 bg-sakura-light/50 p-3.5 text-xs leading-6 text-ink-soft">
            <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-surface text-lg shadow-2xs">🛵</span>
            <p>ارسال گرم در کمتر از ۴۵ دقیقه · امکان پرداخت <b class="text-ink">درب محل</b> یا <b class="text-ink">کارت به کارت</b></p>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById("mobile-bar").innerHTML = `
    <div class="mx-auto flex max-w-lg items-center gap-2.5">
      <div class="flex-1">
        <p class="text-[10px] text-ink-soft">جمع (${faDigits(qty)} عدد)</p>
        <p class="text-sm font-black text-shu" data-total>${toman(p.price)}</p>
      </div>
      <button type="button" data-add class="btn-ghost px-4 py-3 text-xs">＋ سبد خرید</button>
      <button type="button" data-buy class="btn-primary px-6 py-3 text-xs">خرید سریع</button>
    </div>`;
  document.body.classList.add("pb-24", "md:pb-0");

  const sync = () => {
    document.querySelectorAll("[data-qty-val]").forEach((el) => (el.textContent = faDigits(qty)));
    document.querySelectorAll("[data-total]").forEach((el) => (el.textContent = toman(p.price * qty)));
  };

  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-qty]");
    if (q) {
      qty = Math.min(20, Math.max(1, qty + Number(q.dataset.qty)));
      sync();
    }
    if (e.target.closest("[data-add]")) {
      Cart.add(p.id, qty);
      toast(`${faDigits(qty)} × ${p.name} به سبد اضافه شد`);
    }
    if (e.target.closest("[data-buy]")) {
      Cart.add(p.id, qty);
      location.href = "checkout.html";
    }
  });

  // Related products (same category)
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  document.getElementById("related").innerHTML = related.map((x, i) => card(x, i)).join("");
  document.getElementById("related-more").href = `index.html?cat=${cat.id}#menu`;
});
