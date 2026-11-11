/**
 * صفحه تک محصول: جزئیات، انتخاب تعداد، افزودن به سبد و خرید
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
        <a href="index.html#menu" class="btn-primary mt-8">بازگشت به منو</a>
      </div>`;
    document.getElementById("mobile-bar").remove();
    return;
  }

  const cat = categories.find((c) => c.id === p.category);
  document.title = `${p.name} | ساکورا رامن`;

  document.getElementById("breadcrumb").innerHTML = `
    <a href="index.html" class="hover:text-shu">خانه</a><span>/</span>
    <a href="index.html?cat=${cat.id}#menu" class="hover:text-shu">${cat.name}</a><span>/</span>
    <span class="font-bold text-ink">${esc(p.name)}</span>`;

  const spicyBar = [1, 2, 3]
    .map((n) => `<span class="h-2 w-6 rounded-full ${n <= p.spicy ? "bg-shu" : "bg-ink/10"}"></span>`)
    .join("");

  let qty = 1;

  root.innerHTML = `
    <div class="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <!-- image -->
      <div class="frame relative flex items-center justify-center p-6 md:p-10 animate-fade-up">
        <div class="pointer-events-none absolute top-6 left-6 size-16 rounded-full bg-shu/90 md:size-20"></div>
        <img src="${p.image}" alt="${esc(p.name)}" class="dish-img mask-fade relative mx-auto aspect-square w-full max-w-md object-contain" />
        <span class="hanko absolute top-6 right-6 px-2 py-3 text-lg vertical-jp">${p.jp}</span>
        ${p.badge ? `<span class="absolute bottom-6 right-6 rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-paper">${esc(p.badge)}</span>` : ""}
      </div>

      <!-- info -->
      <div class="flex flex-col animate-fade-up" style="animation-delay:80ms">
        <a href="index.html?cat=${cat.id}#menu" class="inline-flex w-fit items-center gap-2 rounded-full bg-sakura-light px-3 py-1 text-xs font-bold text-shu-dark">${cat.icon} ${cat.name}</a>
        <h1 class="mt-4 text-4xl font-black md:text-5xl">${esc(p.name)}</h1>
        <p class="mt-1 font-display text-2xl text-ink-soft" dir="ltr" style="text-align:right">${p.en}</p>
        <p class="mt-6 leading-8 text-ink-soft">${esc(p.description)}</p>

        <dl class="mt-8 grid grid-cols-3 gap-3 text-center">
          <div class="rounded-xl border border-ink/10 bg-paper-dark/40 p-3">
            <dt class="text-xs text-ink-soft">زمان آماده‌سازی</dt><dd class="mt-1 font-bold">${p.time}</dd>
          </div>
          <div class="rounded-xl border border-ink/10 bg-paper-dark/40 p-3">
            <dt class="text-xs text-ink-soft">کالری</dt><dd class="mt-1 font-bold">${faDigits(p.calories)}</dd>
          </div>
          <div class="rounded-xl border border-ink/10 bg-paper-dark/40 p-3">
            <dt class="text-xs text-ink-soft">میزان تندی</dt><dd class="mt-2 flex justify-center gap-1">${spicyBar}</dd>
          </div>
        </dl>

        <div class="mt-8">
          <h2 class="mb-3 text-sm font-bold">مواد تشکیل‌دهنده</h2>
          <ul class="flex flex-wrap gap-2">
            ${p.ingredients.map((x) => `<li class="rounded-full border border-ink/15 px-3 py-1 text-sm">${esc(x)}</li>`).join("")}
          </ul>
        </div>

        <div class="ink-divider my-8"></div>

        <div class="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p class="text-xs text-ink-soft">قیمت</p>
            <p class="text-3xl font-black text-shu" data-total>${toman(p.price)}</p>
          </div>
          <div class="flex items-center gap-1 rounded-full border border-ink/15 bg-paper p-1" aria-label="تعداد">
            <button data-qty="+1" class="grid size-10 cursor-pointer place-items-center rounded-full text-xl transition hover:bg-ink hover:text-paper">+</button>
            <span data-qty-val class="w-10 text-center text-lg font-black">۱</span>
            <button data-qty="-1" class="grid size-10 cursor-pointer place-items-center rounded-full text-xl transition hover:bg-ink hover:text-paper">−</button>
          </div>
        </div>

        <div class="mt-6 hidden gap-3 md:flex">
          <button data-buy class="btn-primary flex-1 py-4 text-lg">خرید
            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
          </button>
          <button data-add class="btn-ghost py-4">افزودن به سبد</button>
        </div>

        <div class="mt-6 flex items-center gap-3 rounded-xl bg-sakura-light/60 p-4 text-sm">
          <span class="text-xl">🛵</span>
          <p>ارسال در کمتر از ۴۵ دقیقه · پرداخت <b>درب محل</b> یا <b>کارت به کارت</b></p>
        </div>
      </div>
    </div>`;

  document.getElementById("mobile-bar").innerHTML = `
    <div class="flex items-center gap-3">
      <div class="flex-1"><p class="text-[11px] text-ink-soft">جمع</p><p class="font-black text-shu" data-total>${toman(p.price)}</p></div>
      <button data-add class="btn-ghost px-4">＋ سبد</button>
      <button data-buy class="btn-primary px-8">خرید</button>
    </div>`;
  document.body.classList.add("pb-24", "md:pb-0");

  const sync = () => {
    document.querySelectorAll("[data-qty-val]").forEach((el) => (el.textContent = faDigits(qty)));
    document.querySelectorAll("[data-total]").forEach((el) => (el.textContent = toman(p.price * qty)));
  };

  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-qty]");
    if (q) { qty = Math.min(20, Math.max(1, qty + Number(q.dataset.qty))); sync(); }
    if (e.target.closest("[data-add]")) { Cart.add(p.id, qty); toast(`${faDigits(qty)} × ${p.name} به سبد اضافه شد`); }
    if (e.target.closest("[data-buy]")) { Cart.add(p.id, qty); location.href = "checkout.html"; }
  });

  // related products (same category)
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  document.getElementById("related").innerHTML = related.map((x, i) => card(x, i)).join("");
  document.getElementById("related-more").href = `index.html?cat=${cat.id}#menu`;
});
