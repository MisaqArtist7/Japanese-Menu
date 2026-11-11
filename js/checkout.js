/**
 * صفحه پرداخت: سبد خرید + فرم اطلاعات + دو روش پرداخت (درب محل / کارت به کارت)
 */
document.addEventListener("DOMContentLoaded", () => {
  const { toman, faDigits, esc, Cart, toast } = window.App;
  const SHOP = window.SHOP;
  const root = document.getElementById("checkout");

  const state = { method: "cod", receipt: null };

  const cardGroups = SHOP.card.number.match(/.{1,4}/g).join("  ");

  // ---------- Empty ----------
  const renderEmpty = () => {
    root.innerHTML = `
      <div class="frame mx-auto max-w-lg p-12 text-center animate-fade-up">
        <p class="font-brush text-6xl text-ink/20">空</p>
        <h2 class="mt-4 text-2xl font-black">سبد خرید شما خالی است</h2>
        <p class="mt-2 text-ink-soft">از منوی ما یک کاسه رامن داغ انتخاب کنید 🍜</p>
        <a href="index.html#menu" class="btn-primary mt-8">مشاهده منو</a>
      </div>`;
  };

  // ---------- Cart rows ----------
  const rows = () =>
    Cart.detailed()
      .map(({ product: p, qty }) => `
      <li class="flex items-center gap-3 py-4">
        <a href="product.html?id=${p.id}" class="size-16 shrink-0 overflow-hidden rounded-lg border border-ink/10 bg-paper">
          <img src="${p.image}" alt="${esc(p.name)}" class="dish-img size-full object-contain" />
        </a>
        <div class="min-w-0 flex-1">
          <a href="product.html?id=${p.id}" class="block truncate font-bold hover:text-shu">${esc(p.name)}</a>
          <p class="text-xs text-ink-soft">${toman(p.price)}</p>
          <div class="mt-2 inline-flex items-center gap-1 rounded-full border border-ink/15 p-0.5">
            <button type="button" data-inc="${p.id}" class="grid size-6 cursor-pointer place-items-center rounded-full hover:bg-ink hover:text-paper">+</button>
            <span class="w-6 text-center text-sm font-bold">${faDigits(qty)}</span>
            <button type="button" data-dec="${p.id}" class="grid size-6 cursor-pointer place-items-center rounded-full hover:bg-ink hover:text-paper">−</button>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <span class="text-sm font-black">${toman(p.price * qty)}</span>
          <button type="button" data-del="${p.id}" class="cursor-pointer text-xs text-ink-soft hover:text-shu">حذف</button>
        </div>
      </li>`)
      .join("");

  const totals = () => {
    const sub = Cart.subtotal();
    return `
      <div class="space-y-3 text-sm">
        <div class="flex justify-between"><span class="text-ink-soft">جمع سفارش</span><span>${toman(sub)}</span></div>
        <div class="flex justify-between"><span class="text-ink-soft">هزینه ارسال</span><span>${toman(SHOP.deliveryFee)}</span></div>
        <div class="ink-divider"></div>
        <div class="flex items-center justify-between text-base"><span class="font-bold">مبلغ قابل پرداخت</span><span class="text-xl font-black text-shu">${toman(sub + SHOP.deliveryFee)}</span></div>
      </div>`;
  };

  const methodCard = (id, title, desc, icon) => `
    <label class="relative flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 transition
      has-checked:border-shu has-checked:bg-shu/5 border-ink/10 hover:border-ink/30">
      <input type="radio" name="method" value="${id}" class="peer sr-only" ${state.method === id ? "checked" : ""} />
      <span class="grid size-12 shrink-0 place-items-center rounded-xl bg-paper-dark text-2xl">${icon}</span>
      <span class="flex-1">
        <span class="block font-black">${title}</span>
        <span class="mt-1 block text-xs leading-6 text-ink-soft">${desc}</span>
      </span>
      <span class="mt-1 grid size-5 place-items-center rounded-full border-2 border-ink/30 peer-checked:border-shu peer-checked:[&>span]:scale-100">
        <span class="size-2.5 scale-0 rounded-full bg-shu transition"></span>
      </span>
    </label>`;

  // ---------- Main ----------
  const render = () => {
    if (!Cart.count()) return renderEmpty();

    root.innerHTML = `
      <form id="order-form" novalidate class="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div class="space-y-8">
          <!-- customer -->
          <section class="frame p-6 md:p-8">
            <h2 class="flex items-center gap-3 text-xl font-black"><span class="hanko size-8 text-sm">壱</span> اطلاعات تحویل</h2>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              <label class="block">
                <span class="mb-1.5 block text-sm font-bold">نام و نام خانوادگی <span class="text-shu">*</span></span>
                <input name="name" required minlength="3" class="field" placeholder="مثلاً: سارا محمدی" autocomplete="name" />
                <span data-err="name" class="mt-1 hidden text-xs text-shu">لطفاً نام خود را وارد کنید.</span>
              </label>
              <label class="block">
                <span class="mb-1.5 block text-sm font-bold">شماره موبایل <span class="text-shu">*</span></span>
                <input name="phone" required dir="ltr" inputmode="numeric" class="field text-left" placeholder="09xxxxxxxxx" autocomplete="tel" />
                <span data-err="phone" class="mt-1 hidden text-xs text-shu">شماره موبایل معتبر نیست (مثلاً 09121234567).</span>
              </label>
              <label class="block sm:col-span-2">
                <span class="mb-1.5 block text-sm font-bold">آدرس کامل <span class="text-shu">*</span></span>
                <textarea name="address" required minlength="10" rows="3" class="field resize-none" placeholder="شهر، خیابان، کوچه، پلاک، واحد"></textarea>
                <span data-err="address" class="mt-1 hidden text-xs text-shu">لطفاً آدرس کامل را وارد کنید.</span>
              </label>
              <label class="block sm:col-span-2">
                <span class="mb-1.5 block text-sm font-bold">توضیحات سفارش <span class="font-normal text-ink-soft">(اختیاری)</span></span>
                <input name="note" class="field" placeholder="مثلاً: بدون پیازچه، تندی کم" />
              </label>
            </div>
          </section>

          <!-- payment -->
          <section class="frame p-6 md:p-8">
            <h2 class="flex items-center gap-3 text-xl font-black"><span class="hanko size-8 text-sm">弐</span> روش پرداخت</h2>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              ${methodCard("cod", "پرداخت درب محل", "هنگام تحویل سفارش، به‌صورت نقدی یا با کارتخوان سیار پرداخت کنید.", "🏠")}
              ${methodCard("card", "کارت به کارت", "مبلغ را به شماره کارت رستوران واریز کرده و رسید را ثبت کنید.", "💳")}
            </div>

            <!-- card to card details -->
            <div id="card-panel" class="${state.method === "card" ? "" : "hidden"} mt-6 space-y-5 animate-fade-up">
              <div class="relative overflow-hidden rounded-2xl bg-ink p-6 text-paper shadow-card">
                <div class="absolute -top-10 -left-10 size-40 rounded-full bg-shu/80"></div>
                <p class="absolute top-4 left-6 font-brush text-3xl text-paper/90">桜</p>
                <div class="relative">
                  <p class="text-xs text-paper/60">${SHOP.card.bank}</p>
                  <p class="mt-6 text-center font-mono text-xl tracking-widest sm:text-2xl" dir="ltr">${cardGroups}</p>
                  <div class="mt-6 flex items-end justify-between">
                    <div><p class="text-[11px] text-paper/60">به نام</p><p class="font-bold">${SHOP.card.holder}</p></div>
                    <button type="button" data-copy class="cursor-pointer rounded-full bg-paper/15 px-4 py-2 text-xs font-bold transition hover:bg-paper hover:text-ink">کپی شماره کارت</button>
                  </div>
                </div>
              </div>
              <p class="rounded-xl bg-sakura-light/60 p-4 text-sm leading-7">
                لطفاً مبلغ <b class="text-shu" data-pay-total>${toman(Cart.subtotal() + SHOP.deliveryFee)}</b> را واریز کرده و شماره پیگیری یا تصویر رسید را وارد کنید.
              </p>
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="block">
                  <span class="mb-1.5 block text-sm font-bold">شماره پیگیری / ۴ رقم آخر کارت <span class="text-shu">*</span></span>
                  <input name="tracking" dir="ltr" inputmode="numeric" class="field text-left" placeholder="123456" />
                  <span data-err="tracking" class="mt-1 hidden text-xs text-shu">شماره پیگیری یا تصویر رسید الزامی است.</span>
                </label>
                <div>
                  <span class="mb-1.5 block text-sm font-bold">تصویر رسید <span class="font-normal text-ink-soft">(اختیاری)</span></span>
                  <label class="flex h-[50px] cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-ink/20 px-4 text-sm text-ink-soft transition hover:border-shu hover:text-shu">
                    <input type="file" name="receipt" accept="image/*" class="sr-only" />
                    <span>📎</span><span data-receipt-name class="truncate">انتخاب فایل</span>
                  </label>
                </div>
              </div>
              <img data-receipt-preview class="hidden max-h-48 rounded-xl border border-ink/10" alt="پیش‌نمایش رسید" />
            </div>
          </section>
        </div>

        <!-- summary -->
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="frame p-6">
            <h2 class="flex items-center justify-between text-lg font-black">خلاصه سفارش <span class="text-sm font-normal text-ink-soft">${faDigits(Cart.count())} آیتم</span></h2>
            <ul id="cart-rows" class="mt-2 max-h-[22rem] divide-y divide-ink/10 overflow-y-auto">${rows()}</ul>
            <div class="ink-divider my-4"></div>
            <div id="totals">${totals()}</div>
            <button type="submit" class="btn-primary mt-6 w-full py-4 text-lg">ثبت نهایی سفارش</button>
            <a href="index.html#menu" class="mt-3 block text-center text-sm text-ink-soft hover:text-shu">← افزودن غذای دیگر</a>
          </div>
        </aside>
      </form>`;

    bind();
  };

  // ---------- Events ----------
  const bind = () => {
    const form = document.getElementById("order-form");

    form.addEventListener("change", (e) => {
      if (e.target.name === "method") {
        state.method = e.target.value;
        document.getElementById("card-panel").classList.toggle("hidden", state.method !== "card");
      }
      if (e.target.name === "receipt") {
        const f = e.target.files[0];
        state.receipt = f || null;
        form.querySelector("[data-receipt-name]").textContent = f ? f.name : "انتخاب فایل";
        const img = form.querySelector("[data-receipt-preview]");
        if (f) { img.src = URL.createObjectURL(f); img.classList.remove("hidden"); } else img.classList.add("hidden");
      }
    });

    form.addEventListener("click", (e) => {
      const t = e.target.closest("button");
      if (!t) return;
      const item = (id) => Cart.items().find((i) => i.id === id);
      if (t.dataset.inc) Cart.setQty(t.dataset.inc, item(t.dataset.inc).qty + 1);
      else if (t.dataset.dec) Cart.setQty(t.dataset.dec, item(t.dataset.dec).qty - 1);
      else if (t.dataset.del) Cart.remove(t.dataset.del);
      else if ("copy" in t.dataset) {
        navigator.clipboard?.writeText(SHOP.card.number).then(() => toast("شماره کارت کپی شد"), () => toast(SHOP.card.number));
        return;
      } else return;
      refreshSummary();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validate(form)) submit(form);
    });
  };

  const refreshSummary = () => {
    if (!Cart.count()) return renderEmpty();
    document.getElementById("cart-rows").innerHTML = rows();
    document.getElementById("totals").innerHTML = totals();
    const pay = document.querySelector("[data-pay-total]");
    if (pay) pay.textContent = toman(Cart.subtotal() + SHOP.deliveryFee);
  };

  const toEn = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

  const validate = (form) => {
    const v = (n) => (form.elements[n]?.value || "").trim();
    const checks = {
      name: v("name").length >= 3,
      phone: /^09\d{9}$/.test(toEn(v("phone"))),
      address: v("address").length >= 10,
      tracking: state.method !== "card" || v("tracking").length >= 4 || !!state.receipt,
    };
    let first = null;
    Object.entries(checks).forEach(([k, ok]) => {
      form.querySelector(`[data-err="${k}"]`)?.classList.toggle("hidden", ok);
      const el = form.elements[k];
      el?.classList.toggle("border-shu", !ok);
      if (!ok && !first) first = el;
    });
    if (first) { first.focus(); first.scrollIntoView({ behavior: "smooth", block: "center" }); }
    return !first;
  };

  // TODO: بعد از آماده شدن بک‌اند، اینجا درخواست POST به API ارسال شود
  const submit = (form) => {
    const order = {
      code: "SR-" + Math.floor(100000 + Math.random() * 900000),
      items: Cart.items(),
      total: Cart.subtotal() + SHOP.deliveryFee,
      method: state.method,
      customer: { name: form.elements.name.value.trim(), phone: toEn(form.elements.phone.value.trim()), address: form.elements.address.value.trim() },
    };
    console.info("Order (mock):", order);
    Cart.clear();
    renderSuccess(order);
  };

  const renderSuccess = (o) => {
    const step3 = document.querySelector("[data-step3]");
    step3.className = "hanko size-9 text-sm";
    step3.parentElement.classList.remove("text-ink-soft");
    root.innerHTML = `
      <div class="frame mx-auto max-w-xl p-10 text-center animate-fade-up">
        <div class="mx-auto grid size-20 place-items-center rounded-full bg-shu text-4xl text-paper shadow-lg shadow-shu/30">✓</div>
        <p class="mt-6 font-brush text-2xl tracking-[.3em] text-shu">ありがとう</p>
        <h2 class="mt-2 text-3xl font-black">سفارش شما ثبت شد!</h2>
        <p class="mt-3 leading-8 text-ink-soft">${esc(o.customer.name)} عزیز، از انتخاب شما سپاسگزاریم.<br/>
          ${o.method === "card" ? "پس از تأیید واریز، سفارش شما آماده و ارسال می‌شود." : "مبلغ سفارش را هنگام تحویل پرداخت کنید."}</p>
        <dl class="mt-8 grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-xl bg-paper-dark/50 p-4"><dt class="text-ink-soft">کد سفارش</dt><dd class="mt-1 font-black" dir="ltr">${o.code}</dd></div>
          <div class="rounded-xl bg-paper-dark/50 p-4"><dt class="text-ink-soft">مبلغ</dt><dd class="mt-1 font-black text-shu">${toman(o.total)}</dd></div>
          <div class="col-span-2 rounded-xl bg-paper-dark/50 p-4"><dt class="text-ink-soft">روش پرداخت</dt><dd class="mt-1 font-bold">${o.method === "card" ? "💳 کارت به کارت" : "🏠 پرداخت درب محل"}</dd></div>
        </dl>
        <a href="index.html" class="btn-primary mt-8">بازگشت به صفحه اصلی</a>
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render();
});

