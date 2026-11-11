/**
 * توابع مشترک همه صفحات: فرمت قیمت، سبد خرید، دراور سبد خرید، هدر/فوتر، کارت محصول، توست و شکوفه‌ها
 */
(() => {
  const { products } = window.MENU;

  // ---------- Helpers ----------
  const faDigits = (v) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const toman = (n) => `${faDigits(Number(n).toLocaleString("en-US").replace(/,/g, "٬"))} تومان`;
  const getProduct = (id) => products.find((p) => p.id === id);
  const qs = (k) => new URLSearchParams(location.search).get(k);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- Cart (localStorage) ----------
  const KEY = "sakura_cart_v1";
  const Cart = {
    items() {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
    },
    save(items) {
      localStorage.setItem(KEY, JSON.stringify(items));
      document.dispatchEvent(new CustomEvent("cart:change"));
    },
    add(id, qty = 1) {
      const items = Cart.items();
      const row = items.find((i) => i.id === id);
      row ? (row.qty += qty) : items.push({ id, qty });
      Cart.save(items);
    },
    setQty(id, qty) {
      Cart.save(Cart.items().map((i) => (i.id === id ? { ...i, qty } : i)).filter((i) => i.qty > 0));
    },
    remove(id) { Cart.save(Cart.items().filter((i) => i.id !== id)); },
    clear() { Cart.save([]); },
    count() { return Cart.items().reduce((s, i) => s + i.qty, 0); },
    qtyOf(id) { return Cart.items().find((i) => i.id === id)?.qty || 0; },
    detailed() {
      return Cart.items().map((i) => ({ ...i, product: getProduct(i.id) })).filter((i) => i.product);
    },
    subtotal() { return Cart.detailed().reduce((s, i) => s + i.product.price * i.qty, 0); },
  };

  // ---------- Layout: Modern Floating Glass Header ----------
  const isCheckoutPage = () => location.pathname.endsWith("checkout.html");

  const header = () => `
    <header class="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-ink/[0.08] bg-surface/80 px-4 py-2.5 shadow-card backdrop-blur-xl transition-all">
        <a href="index.html" class="group flex items-center gap-3">
          <span class="hanko size-11 text-xl transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6">桜</span>
          <span class="leading-tight">
            <span class="block text-lg font-black tracking-tight text-ink group-hover:text-shu transition-colors">ساکورا رامن</span>
            <span class="block font-brush text-[11px] tracking-widest text-ink-soft">さくら・ラーメン</span>
          </span>
        </a>

        <nav class="hidden items-center gap-1 rounded-full border border-ink/[0.06] bg-paper/70 p-1 text-sm font-medium md:flex">
          <a href="index.html" class="rounded-full px-4 py-1.5 text-ink transition hover:bg-surface hover:text-shu">خانه</a>
          <a href="index.html#menu" class="rounded-full px-4 py-1.5 text-ink transition hover:bg-surface hover:text-shu">منوی غذا</a>
          <a href="index.html#about" class="rounded-full px-4 py-1.5 text-ink transition hover:bg-surface hover:text-shu">فلسفه ما</a>
          <a href="#contact" class="rounded-full px-4 py-1.5 text-ink transition hover:bg-surface hover:text-shu">تماس</a>
        </nav>

        <div class="flex items-center gap-2">
          <button type="button" data-open-cart class="group relative inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-ink/10 bg-paper/80 px-3.5 py-2 text-sm font-bold text-ink transition-all hover:border-shu/40 hover:bg-surface hover:shadow-sm" aria-label="سبد خرید">
            <span class="relative grid size-7 place-items-center rounded-lg bg-shu/10 text-shu transition-colors group-hover:bg-shu group-hover:text-surface">
              <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"/></svg>
            </span>
            <span class="hidden sm:inline">سبد خرید</span>
            <span data-cart-subtotal class="hidden border-r border-ink/10 pr-2.5 text-xs font-extrabold text-shu lg:inline"></span>
            <span data-cart-count class="grid min-w-5 scale-0 place-items-center rounded-full bg-shu px-1.5 py-0.5 text-[11px] font-black text-surface shadow-sm transition-transform">۰</span>
          </button>

          <button type="button" data-mobile-nav-btn class="grid size-10 cursor-pointer place-items-center rounded-xl border border-ink/10 bg-paper/80 text-ink transition hover:border-shu hover:text-shu md:hidden" aria-label="منو">
            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div id="mobile-nav" class="mx-auto mt-2 hidden max-w-6xl overflow-hidden rounded-2xl border border-ink/10 bg-surface/95 p-3 shadow-elevated backdrop-blur-xl md:hidden animate-scale-in">
        <nav class="grid gap-1 text-sm font-bold">
          <a href="index.html" class="flex items-center justify-between rounded-xl px-4 py-2.5 hover:bg-paper"><span>🏠 خانه</span><span class="font-brush text-xs text-ink-soft">ホーム</span></a>
          <a href="index.html#menu" class="flex items-center justify-between rounded-xl px-4 py-2.5 hover:bg-paper"><span>🍜 منوی غذا</span><span class="font-brush text-xs text-ink-soft">お品書き</span></a>
          <a href="index.html#about" class="flex items-center justify-between rounded-xl px-4 py-2.5 hover:bg-paper"><span>🏮 فلسفه ساکورا</span><span class="font-brush text-xs text-ink-soft">こだわり</span></a>
          <a href="#contact" class="flex items-center justify-between rounded-xl px-4 py-2.5 hover:bg-paper"><span>📞 تماس با ما</span><span class="font-brush text-xs text-ink-soft">連絡先</span></a>
        </nav>
      </div>
    </header>`;

  // ---------- Slide-Over Cart Drawer ----------
  const cartDrawerShell = () => `
    <div id="cart-drawer" class="fixed inset-0 z-50 hidden" aria-hidden="true">
      <div data-close-cart class="fixed inset-0 bg-ink/45 backdrop-blur-xs transition-opacity"></div>
      <aside class="fixed inset-y-0 left-0 flex w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300">
        <div class="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div class="flex items-center gap-3">
            <span class="hanko size-9 text-sm">買</span>
            <div>
              <h2 class="text-lg font-black">سبد خرید شما</h2>
              <p class="text-xs text-ink-soft"><span data-drawer-count>۰</span> آیتم انتخاب شده</p>
            </div>
          </div>
          <button type="button" data-close-cart class="grid size-9 cursor-pointer place-items-center rounded-xl border border-ink/10 text-ink-soft transition hover:border-shu hover:bg-shu/10 hover:text-shu" aria-label="بستن">
            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div id="cart-drawer-body" class="flex-1 overflow-y-auto px-6 py-4"></div>

        <div id="cart-drawer-footer" class="border-t border-ink/10 bg-paper/60 p-6"></div>
      </aside>
    </div>`;

  const renderCartDrawer = () => {
    const body = document.getElementById("cart-drawer-body");
    const foot = document.getElementById("cart-drawer-footer");
    const countEl = document.querySelector("[data-drawer-count]");
    if (!body || !foot) return;

    const count = Cart.count();
    if (countEl) countEl.textContent = faDigits(count);

    if (!count) {
      body.innerHTML = `
        <div class="flex h-full flex-col items-center justify-center py-12 text-center">
          <div class="grid size-20 place-items-center rounded-3xl bg-paper-dark/60 font-brush text-4xl text-ink/25">空</div>
          <p class="mt-4 text-lg font-black">سبد خرید شما خالی است</p>
          <p class="mt-1 max-w-xs text-xs leading-6 text-ink-soft">از منوی رامن‌های دست‌ساز و سوپ‌های گرم ژاپنی غذای دلخواهتان را انتخاب کنید.</p>
          <a href="index.html#menu" data-close-cart class="btn-primary mt-6 px-6 py-2.5 text-sm">مشاهده منو</a>
        </div>`;
      foot.classList.add("hidden");
      return;
    }

    foot.classList.remove("hidden");
    const sub = Cart.subtotal();
    const fee = window.SHOP.deliveryFee;

    body.innerHTML = `
      <ul class="divide-y divide-ink/[0.08]">
        ${Cart.detailed().map(({ product: p, qty }) => `
          <li class="flex items-center gap-3.5 py-4">
            <a href="product.html?id=${p.id}" class="dish-stage size-18 shrink-0 overflow-hidden rounded-2xl border border-ink/[0.08] p-1.5">
              <img src="${p.image}" alt="${esc(p.name)}" class="dish-img size-full object-contain" />
            </a>
            <div class="min-w-0 flex-1">
              <a href="product.html?id=${p.id}" class="block truncate font-black hover:text-shu transition">${esc(p.name)}</a>
              <p class="mt-0.5 text-xs text-ink-soft">${toman(p.price)}</p>
              <div class="mt-2.5 flex items-center justify-between">
                <div class="inline-flex items-center gap-1 rounded-xl border border-ink/12 bg-paper/70 p-0.5">
                  <button type="button" data-drawer-inc="${p.id}" class="grid size-6 cursor-pointer place-items-center rounded-lg text-sm font-bold transition hover:bg-shu hover:text-surface">+</button>
                  <span class="w-6 text-center text-xs font-black">${faDigits(qty)}</span>
                  <button type="button" data-drawer-dec="${p.id}" class="grid size-6 cursor-pointer place-items-center rounded-lg text-sm font-bold transition hover:bg-ink hover:text-surface">−</button>
                </div>
                <span class="text-xs font-black text-shu">${toman(p.price * qty)}</span>
              </div>
            </div>
            <button type="button" data-drawer-del="${p.id}" class="cursor-pointer rounded-lg p-1.5 text-ink/35 transition hover:bg-shu/10 hover:text-shu" aria-label="حذف">
              <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
            </button>
          </li>`).join("")}
      </ul>`;

    foot.innerHTML = `
      <div class="space-y-2 text-xs">
        <div class="flex justify-between text-ink-soft"><span>جمع سفارش</span><span class="font-bold text-ink">${toman(sub)}</span></div>
        <div class="flex justify-between text-ink-soft"><span>هزینه ارسال</span><span class="font-bold text-ink">${toman(fee)}</span></div>
        <div class="ink-divider my-2"></div>
        <div class="flex items-center justify-between text-sm"><span class="font-bold">مبلغ قابل پرداخت</span><span class="text-base font-black text-shu">${toman(sub + fee)}</span></div>
      </div>
      <div class="mt-4 grid gap-2">
        <a href="checkout.html" class="btn-primary w-full py-3.5 text-sm">
          تکمیل خرید و پرداخت
          <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
        </a>
      </div>`;
  };

  const openCart = () => {
    if (isCheckoutPage()) return;
    const d = document.getElementById("cart-drawer");
    if (!d) return;
    renderCartDrawer();
    d.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeCart = () => {
    const d = document.getElementById("cart-drawer");
    if (!d) return;
    d.classList.add("hidden");
    document.body.style.overflow = "";
  };

  // ---------- Modern Bento Footer ----------
  const footer = () => `
    <footer id="contact" class="relative mt-28 px-3 pb-4 sm:px-4">
      <div class="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink text-paper/85 shadow-elevated">
        <div class="relative grid gap-10 px-6 py-14 sm:px-10 md:grid-cols-12">
          <!-- subtle glow -->
          <div class="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-shu/25 blur-3xl"></div>

          <div class="md:col-span-5">
            <div class="flex items-center gap-3.5">
              <span class="hanko size-12 text-2xl">桜</span>
              <div>
                <span class="block text-xl font-black text-paper">ساکورا رامن</span>
                <span class="block font-brush text-xs tracking-widest text-paper/50">本格日本ラーメン専門店</span>
              </div>
            </div>
            <p class="mt-4 max-w-sm text-sm leading-7 text-paper/70">
              یک کاسه سنت، یک دنیا طعم. رامن و سوپ‌های اصیل ژاپنی با آب‌گوشت ۱۸ ساعته، نودل‌های دست‌ساز روزانه و مواد اولیه تازه.
            </p>
            <div class="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-paper/90">
              <span class="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
              سفارش‌گیری آنلاین فعال است · ارسال سریع
            </div>
          </div>

          <div class="text-sm leading-8 md:col-span-4">
            <h4 class="mb-3 font-black text-paper">اطلاعات تماس و ساعت کاری</h4>
            <ul class="space-y-2.5 text-paper/75">
              <li class="flex items-start gap-2.5"><span>📍</span><span>${window.SHOP.address}</span></li>
              <li class="flex items-center gap-2.5"><span>📞</span><span dir="ltr" class="font-bold text-paper">${window.SHOP.phone}</span></li>
              <li class="flex items-center gap-2.5"><span>🕰</span><span>همه‌روزه ۱۲ ظهر تا ۱۲ شب (بدون تعطیلی)</span></li>
            </ul>
          </div>

          <div class="flex flex-col items-start justify-between gap-6 md:col-span-3 md:items-end">
            <p class="font-brush text-4xl text-paper/90 vertical-jp hidden md:block">いただきます</p>
            <p class="font-brush text-2xl text-paper/90 md:hidden">いただきます</p>
            <a href="index.html#menu" class="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-paper transition hover:bg-shu hover:border-shu">سفارش آنلاین از منو ←</a>
          </div>
        </div>

        <div class="border-t border-white/10 bg-black/20 px-6 py-4 text-center text-xs text-paper/45 sm:flex sm:items-center sm:justify-between sm:px-10">
          <p>© ${faDigits(1405)} ساکورا رامن — تمامی حقوق محفوظ است.</p>
          <p class="mt-1 sm:mt-0" dir="ltr">Crafted with ♥ in Tokyo Style</p>
        </div>
      </div>
    </footer>`;

  // ---------- Badge & Card UI Sync ----------
  const updateBadge = () => {
    const c = Cart.count();
    const sub = Cart.subtotal();

    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = faDigits(c);
      el.classList.toggle("scale-0", c === 0);
      el.classList.toggle("scale-100", c > 0);
    });

    document.querySelectorAll("[data-cart-subtotal]").forEach((el) => {
      el.textContent = c > 0 ? toman(sub) : "";
      el.classList.toggle("hidden", c === 0);
      el.classList.toggle("lg:inline", c > 0);
    });

    document.querySelectorAll("[data-quick-add]").forEach((btn) => {
      const id = btn.dataset.quickAdd;
      const q = Cart.qtyOf(id);
      const badge = btn.querySelector("[data-card-qty]");
      if (badge) {
        badge.textContent = faDigits(q);
        badge.classList.toggle("hidden", q === 0);
      }
    });

    renderCartDrawer();
  };

  // ---------- Modern Toast ----------
  const toast = (msg) => {
    let box = document.getElementById("toast-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "toast-box";
      box.className = "fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2.5 pointer-events-none px-4";
      document.body.append(box);
    }
    const t = document.createElement("div");
    t.className = "pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/15 bg-ink/95 px-4 py-3 text-sm text-paper shadow-elevated backdrop-blur-xl animate-fade-up";
    t.innerHTML = `
      <span class="hanko size-6 rounded-lg text-xs">✓</span>
      <span class="font-medium">${esc(msg)}</span>
      ${!isCheckoutPage() ? `<button type="button" data-toast-cart class="mr-1 cursor-pointer rounded-lg bg-white/15 px-2.5 py-1 text-xs font-bold text-paper transition hover:bg-shu">سبد خرید</button>` : ""}
    `;
    t.querySelector("[data-toast-cart]")?.addEventListener("click", () => {
      t.remove();
      openCart();
    });
    box.append(t);
    setTimeout(() => {
      t.style.transition = "opacity .3s, transform .3s";
      t.style.opacity = "0";
      t.style.transform = "translateY(8px)";
      setTimeout(() => t.remove(), 300);
    }, 2600);
  };

  // ---------- Falling sakura petals ----------
  const petals = (n = 12) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = document.createElement("div");
    layer.className = "pointer-events-none fixed inset-0 z-30 overflow-hidden";
    layer.setAttribute("aria-hidden", "true");
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      const size = 8 + Math.random() * 9;
      p.className = "absolute top-0 animate-petal";
      p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size * 0.8}px;animation-duration:${12 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s;background:radial-gradient(circle at 30% 30%,#fde8e9,#eca4a8);border-radius:80% 0 80% 0;opacity:.65`;
      layer.append(p);
    }
    document.body.append(layer);
  };

  // ---------- Modern Product Card (shared) ----------
  const spicyIcons = (n) => (n ? "🌶".repeat(n) : "");
  const card = (p, i = 0) => {
    const inCartQty = Cart.qtyOf(p.id);
    const metaChips = [
      p.time && p.time !== "—" ? `⏱ ${p.time}` : null,
      p.calories ? `🔥 ${faDigits(p.calories)} کالری` : null,
    ].filter(Boolean);

    return `
    <article class="group frame-interactive flex flex-col overflow-hidden p-3.5 animate-fade-up" style="animation-delay:${i * 45}ms">
      <a href="product.html?id=${p.id}" class="dish-stage relative aspect-[5/4] overflow-hidden rounded-2xl p-3">
        <img src="${p.image}" alt="${esc(p.name)}" loading="lazy" class="dish-img size-full object-contain transition duration-500 ease-out group-hover:scale-108" />
        ${p.badge ? `<span class="absolute top-2.5 right-2.5 rounded-xl bg-gradient-to-r from-shu to-shu-dark px-3 py-1 text-[11px] font-bold text-surface shadow-sm">${esc(p.badge)}</span>` : ""}
        ${p.spicy ? `<span class="absolute top-2.5 left-2.5 rounded-xl bg-surface/85 px-2 py-0.5 text-[11px] shadow-xs backdrop-blur-md" title="تند">${spicyIcons(p.spicy)}</span>` : ""}
        <span class="absolute bottom-2 left-2 rounded-lg bg-ink/80 px-1.5 py-1 font-brush text-[10px] leading-none text-paper/95 backdrop-blur-xs vertical-jp max-h-20 overflow-hidden">${p.jp}</span>
      </a>

      <div class="mt-3.5 flex flex-1 flex-col px-1">
        <div class="flex items-baseline justify-between gap-2">
          <a href="product.html?id=${p.id}" class="text-lg font-black text-ink transition group-hover:text-shu">${esc(p.name)}</a>
          <span class="font-display text-xs text-ink-soft/80" dir="ltr">${p.en}</span>
        </div>

        <p class="mt-1.5 line-clamp-2 text-xs leading-6 text-ink-soft">${esc(p.short)}</p>

        ${metaChips.length ? `
          <div class="mt-3 flex flex-wrap gap-1.5">
            ${metaChips.map((m) => `<span class="rounded-lg bg-paper-dark/55 px-2 py-0.5 text-[11px] font-medium text-ink-soft">${m}</span>`).join("")}
          </div>` : ""}

        <div class="mt-auto flex items-center justify-between border-t border-ink/[0.06] pt-3.5 mt-4">
          <div>
            <span class="block text-[10px] text-ink-soft">قیمت</span>
            <span class="text-base font-black text-shu">${toman(p.price)}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <button type="button" data-quick-add="${p.id}"
              class="relative inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-shu/10 px-3 py-2 text-xs font-bold text-shu transition-all hover:bg-shu hover:text-surface hover:shadow-md hover:shadow-shu/20 active:scale-95"
              title="افزودن سریع به سبد خرید">
              <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              <span>افزودن</span>
              <span data-card-qty class="${inCartQty ? "" : "hidden"} grid min-w-4 place-items-center rounded-full bg-shu px-1 text-[10px] text-surface group-hover:bg-surface group-hover:text-shu">${faDigits(inCartQty)}</span>
            </button>
          </div>
        </div>
      </div>
    </article>`;
  };

  // ---------- Init & Global Listeners ----------
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("[data-header]")?.insertAdjacentHTML("afterbegin", header());
    document.querySelector("[data-footer]")?.insertAdjacentHTML("afterbegin", footer());
    document.body.insertAdjacentHTML("beforeend", cartDrawerShell());
    updateBadge();
    petals();

    document.addEventListener("click", (e) => {
      // Quick-add on any product card
      const qa = e.target.closest("[data-quick-add]");
      if (qa) {
        e.preventDefault();
        const id = qa.dataset.quickAdd;
        const p = getProduct(id);
        if (p) {
          Cart.add(id, 1);
          toast(`${p.name} به سبد خرید اضافه شد`);
        }
        return;
      }

      // Open / Close Cart Drawer
      if (e.target.closest("[data-open-cart]")) {
        if (isCheckoutPage()) return;
        e.preventDefault();
        openCart();
        return;
      }
      if (e.target.closest("[data-close-cart]")) {
        closeCart();
        return;
      }

      // Cart Drawer quantity controls
      const inc = e.target.closest("[data-drawer-inc]");
      if (inc) {
        const id = inc.dataset.drawerInc;
        Cart.setQty(id, Cart.qtyOf(id) + 1);
        return;
      }
      const dec = e.target.closest("[data-drawer-dec]");
      if (dec) {
        const id = dec.dataset.drawerDec;
        Cart.setQty(id, Cart.qtyOf(id) - 1);
        return;
      }
      const del = e.target.closest("[data-drawer-del]");
      if (del) {
        Cart.remove(del.dataset.drawerDel);
        return;
      }

      // Mobile nav toggle
      if (e.target.closest("[data-mobile-nav-btn]")) {
        document.getElementById("mobile-nav")?.classList.toggle("hidden");
        return;
      }
      if (e.target.closest("#mobile-nav a")) {
        document.getElementById("mobile-nav")?.classList.add("hidden");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCart();
    });
  });

  document.addEventListener("cart:change", updateBadge);
  window.addEventListener("storage", updateBadge);

  window.App = { faDigits, toman, getProduct, qs, esc, Cart, toast, card, spicyIcons, openCart, closeCart };
})();
