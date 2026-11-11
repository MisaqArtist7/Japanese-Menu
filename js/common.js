/**
 * توابع مشترک همه صفحات: فرمت قیمت، سبد خرید، هدر/فوتر، توست و شکوفه‌ها
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
    detailed() {
      return Cart.items().map((i) => ({ ...i, product: getProduct(i.id) })).filter((i) => i.product);
    },
    subtotal() { return Cart.detailed().reduce((s, i) => s + i.product.price * i.qty, 0); },
  };

  // ---------- Layout ----------
  const header = () => `
    <header class="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="index.html" class="group flex items-center gap-3">
          <span class="hanko size-11 text-xl transition group-hover:rotate-6">桜</span>
          <span class="leading-tight">
            <span class="block text-lg font-black">ساکورا رامن</span>
            <span class="block font-brush text-xs tracking-widest text-ink-soft">さくら・ラーメン</span>
          </span>
        </a>
        <nav class="hidden items-center gap-7 text-sm font-medium md:flex">
          <a href="index.html" class="hover:text-shu transition">خانه</a>
          <a href="index.html#menu" class="hover:text-shu transition">منو</a>
          <a href="index.html#about" class="hover:text-shu transition">درباره ما</a>
          <a href="#contact" class="hover:text-shu transition">تماس</a>
        </nav>
        <a href="checkout.html" class="relative inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm font-bold transition hover:border-shu hover:text-shu" aria-label="سبد خرید">
          <svg class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"/></svg>
          <span class="hidden sm:inline">سبد خرید</span>
          <span data-cart-count class="absolute -top-2 -left-2 grid size-6 scale-0 place-items-center rounded-full bg-shu text-xs text-paper transition-transform">۰</span>
        </a>
      </div>
    </header>`;

  const footer = () => `
    <footer id="contact" class="relative mt-24 border-t border-ink/10 bg-ink text-paper/80">
      <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div class="flex items-center gap-3">
            <span class="hanko size-11 text-xl">桜</span>
            <span class="text-xl font-black text-paper">ساکورا رامن</span>
          </div>
          <p class="mt-4 text-sm leading-7">یک کاسه سنت، یک دنیا طعم. رامن و سوپ‌های اصیل ژاپنی با مواد تازه و دستور سرآشپز.</p>
        </div>
        <div class="text-sm leading-8">
          <h4 class="mb-2 font-bold text-paper">تماس با ما</h4>
          <p>📍 ${window.SHOP.address}</p>
          <p>📞 <span dir="ltr">${window.SHOP.phone}</span></p>
          <p>🕰 همه روزه ۱۲ ظهر تا ۱۲ شب</p>
        </div>
        <div class="flex flex-col items-start justify-between gap-6 md:items-end">
          <p class="font-brush text-4xl text-paper vertical-jp md:block hidden">いただきます</p>
          <p class="font-brush text-2xl text-paper md:hidden">いただきます</p>
          <p class="text-xs text-paper/50">© ${faDigits(1405)} ساکورا رامن — تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>`;

  const updateBadge = () => {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      const c = Cart.count();
      el.textContent = faDigits(c);
      el.classList.toggle("scale-0", c === 0);
      el.classList.toggle("scale-100", c > 0);
    });
  };

  // ---------- Toast ----------
  const toast = (msg) => {
    let box = document.getElementById("toast-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "toast-box";
      box.className = "fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 pointer-events-none px-4";
      document.body.append(box);
    }
    const t = document.createElement("div");
    t.className = "pointer-events-auto flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm text-paper shadow-2xl animate-fade-up";
    t.innerHTML = `<span class="hanko size-6 text-xs">✓</span>${esc(msg)}`;
    box.append(t);
    setTimeout(() => { t.style.transition = "opacity .3s"; t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 2200);
  };

  // ---------- Falling sakura petals ----------
  const petals = (n = 14) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = document.createElement("div");
    layer.className = "pointer-events-none fixed inset-0 z-30 overflow-hidden";
    layer.setAttribute("aria-hidden", "true");
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      const size = 8 + Math.random() * 10;
      p.className = "absolute top-0 animate-petal";
      p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size * 0.8}px;animation-duration:${10 + Math.random() * 12}s;animation-delay:${-Math.random() * 20}s;background:radial-gradient(circle at 30% 30%,#fbe3e4,#e8a3a6);border-radius:80% 0 80% 0;opacity:.8`;
      layer.append(p);
    }
    document.body.append(layer);
  };

  // ---------- Product card (shared) ----------
  const spicyIcons = (n) => (n ? "🌶".repeat(n) : "");
  const card = (p, i = 0) => `
    <a href="product.html?id=${p.id}" class="group frame flex flex-col overflow-hidden p-4 transition duration-300 hover:-translate-y-1 hover:shadow-card animate-fade-up" style="animation-delay:${i * 50}ms">
      <div class="relative aspect-[5/4] overflow-hidden rounded-sm bg-paper">
        <img src="${p.image}" alt="${esc(p.name)}" loading="lazy" class="dish-img size-full object-contain transition duration-500 group-hover:scale-105" />
        ${p.badge ? `<span class="absolute top-2 right-2 rounded-full bg-shu px-3 py-1 text-[11px] font-bold text-paper shadow">${esc(p.badge)}</span>` : ""}
        <span class="absolute bottom-1 left-1 rounded-sm bg-ink/85 px-1.5 py-1 font-brush text-[11px] leading-none text-paper vertical-jp max-h-24 overflow-hidden">${p.jp}</span>
      </div>
      <div class="mt-4 flex flex-1 flex-col">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-lg font-black group-hover:text-shu transition">${esc(p.name)}</h3>
          <span class="text-xs">${spicyIcons(p.spicy)}</span>
        </div>
        <p class="font-display text-sm text-ink-soft" dir="ltr" style="text-align:right">${p.en}</p>
        <p class="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">${esc(p.short)}</p>
        <div class="mt-auto flex items-center justify-between pt-4">
          <span class="font-black text-shu">${toman(p.price)}</span>
          <span class="grid size-9 place-items-center rounded-full border border-ink/15 transition group-hover:border-shu group-hover:bg-shu group-hover:text-paper">
            <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
          </span>
        </div>
      </div>
    </a>`;

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("[data-header]")?.insertAdjacentHTML("afterbegin", header());
    document.querySelector("[data-footer]")?.insertAdjacentHTML("afterbegin", footer());
    updateBadge();
    petals();
  });
  document.addEventListener("cart:change", updateBadge);
  window.addEventListener("storage", updateBadge);

  window.App = { faDigits, toman, getProduct, qs, esc, Cart, toast, card, spicyIcons };
})();

