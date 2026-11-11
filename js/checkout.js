/**
 * صفحه پرداخت مدرن: مدیریت اقلام سبد خرید، اعتبارسنجی زنده فرم، انتخاب شیوه پرداخت و ثبت سفارش
 */
document.addEventListener("DOMContentLoaded", () => {
  const { toman, faDigits, esc, Cart, toast } = window.App;
  const SHOP = window.SHOP;
  const root = document.getElementById("checkout");

  const state = { method: "cod", receipt: null };
  const cardGroups = SHOP.card.number.match(/.{1,4}/g).join("  ");

  // ---------- Empty State ----------
  const renderEmpty = () => {
    root.innerHTML = `
      <div class="frame mx-auto max-w-md p-10 text-center animate-fade-up">
        <div class="mx-auto grid size-20 place-items-center rounded-3xl bg-paper-dark/60 font-brush text-4xl text-ink/25">空</div>
        <h2 class="mt-4 text-2xl font-black">سبد خرید شما خالی است</h2>
        <p class="mt-2 text-sm leading-6 text-ink-soft">هیچ غذایی در سبد خرید نیست. از منوی ژاپنی ما انتخاب کنید 🍜</p>
        <a href="index.html#menu" class="btn-primary mt-6 inline-flex px-7 py-3.5">مشاهده منوی غذا</a>
      </div>`;
  };

  // ---------- Cart Item Rows ----------
  const rows = () =>
    Cart.detailed()
      .map(({ product: p, qty }) => `
      <li class="flex items-center gap-3.5 py-3.5">
        <a href="product.html?id=${p.id}" class="dish-stage size-16 shrink-0 overflow-hidden rounded-2xl border border-ink/[0.08] p-1">
          <img src="${p.image}" alt="${esc(p.name)}" class="dish-img size-full object-contain" />
        </a>
        <div class="min-w-0 flex-1">
          <a href="product.html?id=${p.id}" class="block truncate text-sm font-black text-ink hover:text-shu transition">${esc(p.name)}</a>
          <p class="text-xs text-ink-soft">${toman(p.price)}</p>
          <div class="mt-2 inline-flex items-center gap-1 rounded-xl border border-ink/12 bg-paper/70 p-0.5">
            <button type="button" data-inc="${p.id}" class="grid size-6 cursor-pointer place-items-center rounded-lg text-xs font-bold transition hover:bg-shu hover:text-surface">+</button>
            <span class="w-6 text-center text-xs font-black">${faDigits(qty)}</span>
            <button type="button" data-dec="${p.id}" class="grid size-6 cursor-pointer place-items-center rounded-lg text-xs font-bold transition hover:bg-ink hover:text-surface">−</button>
          </div>
        </div>
        <div class="flex flex-col items-end gap-1.5">
          <span class="text-xs font-black text-shu">${toman(p.price * qty)}</span>
          <button type="button" data-del="${p.id}" class="cursor-pointer text-[11px] text-ink-soft hover:text-shu transition">حذف</button>
        </div>
      </li>`)
      .join("");

  const totals = () => {
    const sub = Cart.subtotal();
    return `
      <div class="space-y-2.5 text-xs">
        <div class="flex justify-between text-ink-soft"><span>جمع اقلام سفارش</span><span class="font-bold text-ink">${toman(sub)}</span></div>
        <div class="flex justify-between text-ink-soft"><span>هزینه بسته‌بندی و ارسال</span><span class="font-bold text-ink">${toman(SHOP.deliveryFee)}</span></div>
        <div class="ink-divider my-2"></div>
        <div class="flex items-center justify-between text-sm"><span class="font-bold">مبلغ نهایی قابل پرداخت</span><span class="text-lg font-black text-shu">${toman(sub + SHOP.deliveryFee)}</span></div>
      </div>`;
  };

  const methodCard = (id, title, desc, icon, badge) => `
    <label class="group relative flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 sm:p-5 transition-all
      has-checked:border-shu has-checked:bg-shu/[0.04] has-checked:shadow-xs border-ink/10 bg-surface/80 hover:border-ink/25">
      <input type="radio" name="method" value="${id}" class="peer sr-only" ${state.method === id ? "checked" : ""} />
      <span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper-dark/70 text-2xl transition group-hover:scale-105">${icon}</span>
      <span class="flex-1">
        <span class="flex items-center gap-2 font-black text-sm sm:text-base">
          <span>${title}</span>
          ${badge ? `<span class="rounded-lg bg-shu/10 px-2 py-0.5 text-[10px] font-bold text-shu">${badge}</span>` : ""}
        </span>
        <span class="mt-1 block text-xs leading-6 text-ink-soft">${desc}</span>
      </span>
      <span class="mt-1 grid size-5 place-items-center rounded-full border-2 border-ink/30 peer-checked:border-shu peer-checked:[&>span]:scale-100">
        <span class="size-2.5 scale-0 rounded-full bg-shu transition-transform"></span>
      </span>
    </label>`;

  // ---------- Main Form Render ----------
  const render = () => {
    if (!Cart.count()) return renderEmpty();

    root.innerHTML = `
      <form id="order-form" novalidate class="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div class="space-y-6">
          <!-- Step 1: Customer Info -->
          <section class="frame p-6 sm:p-8">
            <div class="flex items-center gap-3">
              <span class="hanko size-9 text-sm">壱</span>
              <div>
                <h2 class="text-lg font-black">اطلاعات گیرنده و آدرس تحویل</h2>
                <p class="text-xs text-ink-soft">لطفاً مشخصات دقیق خود را برای ارسال پیک وارد کنید.</p>
              </div>
            </div>

            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              <label class="block">
                <span class="mb-1.5 block text-xs font-black text-ink">نام و نام خانوادگی <span class="text-shu">*</span></span>
                <input name="name" required minlength="3" class="field text-sm" placeholder="مثلاً: علیرضا رضایی" autocomplete="name" />
                <span data-err="name" class="mt-1.5 hidden text-xs text-shu">لطفاً نام و نام خانوادگی خود را کامل وارد کنید (حداقل ۳ حرف).</span>
              </label>

              <label class="block">
                <span class="mb-1.5 block text-xs font-black text-ink">شماره تماس موبایل <span class="text-shu">*</span></span>
                <input name="phone" required dir="ltr" inputmode="numeric" class="field text-left text-sm" placeholder="09xxxxxxxxx" autocomplete="tel" />
                <span data-err="phone" class="mt-1.5 hidden text-xs text-shu">شماره موبایل نامعتبر است (مانند: 09123456789).</span>
              </label>

              <label class="block sm:col-span-2">
                <span class="mb-1.5 block text-xs font-black text-ink">نشانی دقیق جهت ارسال <span class="text-shu">*</span></span>
                <textarea name="address" required minlength="10" rows="3" class="field resize-none text-sm leading-6" placeholder="تهران، منطقه، خیابان اصلی، کوچه، پلاک، واحد"></textarea>
                <span data-err="address" class="mt-1.5 hidden text-xs text-shu">لطفاً آدرس کامل و پلاک را با دقت درج کنید.</span>
              </label>

              <label class="block sm:col-span-2">
                <span class="mb-1.5 block text-xs font-black text-ink">توضیحات خاص سرآشپز یا پیک <span class="font-medium text-ink-soft">(اختیاری)</span></span>
                <input name="note" class="field text-sm" placeholder="مثلاً: نودل خوب پخته شود، زنگ واحد خراب است و..." />
              </label>
            </div>
          </section>

          <!-- Step 2: Payment Method -->
          <section class="frame p-6 sm:p-8">
            <div class="flex items-center gap-3">
              <span class="hanko size-9 text-sm">弐</span>
              <div>
                <h2 class="text-lg font-black">انتخاب شیوه پرداخت</h2>
                <p class="text-xs text-ink-soft">روش پرداخت مورد نظر خود را انتخاب کنید.</p>
              </div>
            </div>

            <div class="mt-6 grid gap-3.5 sm:grid-cols-2">
              ${methodCard("cod", "پرداخت درب محل (کارتخوان)", "تحویل حضوری با دستگاه پوز سیار یا نقدی", "🛵", "ساده‌ترین")}
              ${methodCard("card", "کارت به کارت آنلاین", "انتقال مستقیم به شماره حساب رستوران با فیش", "💳", "سریع")}
            </div>

            <!-- Card Transfer Widget -->
            <div id="card-panel" class="${state.method === "card" ? "" : "hidden"} mt-6 space-y-4 animate-fade-up">
              <!-- Obsidian Bank Card Mockup -->
              <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-ink-soft p-6 text-paper shadow-elevated">
                <div class="pointer-events-none absolute -top-12 -left-12 size-48 rounded-full bg-shu/35 blur-2xl"></div>
                <div class="relative flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="hanko size-7 text-xs">桜</span>
                    <span class="text-xs font-bold text-paper/70">${SHOP.card.bank}</span>
                  </div>
                  <span class="font-brush text-2xl text-paper/80">本格拉麺</span>
                </div>

                <div class="relative my-6 text-center">
                  <p class="font-mono text-xl tracking-[0.25em] font-bold sm:text-2xl" dir="ltr">${cardGroups}</p>
                </div>

                <div class="relative flex items-end justify-between">
                  <div>
                    <p class="text-[10px] text-paper/50">صاحب حساب</p>
                    <p class="text-sm font-black">${SHOP.card.holder}</p>
                  </div>
                  <button type="button" data-copy class="cursor-pointer rounded-xl bg-surface/15 px-3.5 py-1.5 text-xs font-bold text-surface backdrop-blur-md transition hover:bg-shu hover:shadow-xs">کپی شماره کارت 📋</button>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-2xl bg-sakura-light/60 p-4 text-xs leading-6 text-ink-soft">
                <span class="text-lg">ℹ️</span>
                <p>مبلغ قابل واریز: <b class="text-shu text-sm" data-pay-total>${toman(Cart.subtotal() + SHOP.deliveryFee)}</b>. پس از واریز، شماره پیگیری یا فیش را ضمیمه کنید.</p>
              </div>

              <div class="grid gap-3.5 sm:grid-cols-2">
                <label class="block">
                  <span class="mb-1.5 block text-xs font-black">شماره پیگیری واریز <span class="text-shu">*</span></span>
                  <input name="tracking" dir="ltr" inputmode="numeric" class="field text-left text-sm" placeholder="مثلاً: 987654" />
                  <span data-err="tracking" class="mt-1.5 hidden text-xs text-shu">لطفاً شماره پیگیری یا رسید واریز را وارد کنید.</span>
                </label>
                <div>
                  <span class="mb-1.5 block text-xs font-black">تصویر رسید واریز <span class="font-medium text-ink-soft">(اختیاری)</span></span>
                  <label class="flex h-[52px] cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed border-ink/15 bg-surface px-4 text-xs font-medium text-ink-soft transition hover:border-shu hover:text-shu">
                    <input type="file" name="receipt" accept="image/*" class="sr-only" />
                    <span data-receipt-name class="truncate">انتخاب تصویر فیش</span>
                    <span>📎</span>
                  </label>
                </div>
              </div>

              <img data-receipt-preview class="hidden max-h-40 rounded-2xl border border-ink/10 object-contain" alt="رسید" />
            </div>
          </section>
        </div>

        <!-- Order Summary Sidebar -->
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="frame p-6">
            <div class="flex items-center justify-between border-b border-ink/[0.08] pb-4">
              <h3 class="text-base font-black">خلاصه سفارش</h3>
              <span class="rounded-full bg-paper px-2.5 py-0.5 text-xs font-bold text-ink-soft">${faDigits(Cart.count())} آیتم</span>
            </div>

            <ul id="cart-rows" class="mt-2 max-h-80 divide-y divide-ink/[0.07] overflow-y-auto">${rows()}</ul>

            <div class="ink-divider my-4"></div>

            <div id="totals">${totals()}</div>

            <button type="submit" class="btn-primary mt-6 w-full py-4 text-base">
              <span>تأیید و ثبت سفارش نهایی</span>
              <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
            </button>

            <a href="index.html#menu" class="mt-3.5 block text-center text-xs font-bold text-ink-soft hover:text-shu transition">← بازگشت به منو برای افزودن غذای دیگر</a>
          </div>
        </aside>
      </form>`;

    bind();
  };

  // ---------- Event Binding ----------
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
        form.querySelector("[data-receipt-name]").textContent = f ? f.name : "انتخاب تصویر فیش";
        const img = form.querySelector("[data-receipt-preview]");
        if (f) {
          img.src = URL.createObjectURL(f);
          img.classList.remove("hidden");
        } else {
          img.classList.add("hidden");
        }
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
        navigator.clipboard?.writeText(SHOP.card.number).then(
          () => toast("شماره کارت کپی شد ✓"),
          () => toast(SHOP.card.number)
        );
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
      tracking: state.method !== "card" || v("tracking").length >= 4 || Boolean(state.receipt),
    };
    let first = null;
    Object.entries(checks).forEach(([k, ok]) => {
      form.querySelector(`[data-err="${k}"]`)?.classList.toggle("hidden", ok);
      const el = form.elements[k];
      el?.classList.toggle("border-shu", !ok);
      if (!ok && !first) first = el;
    });
    if (first) {
      first.focus();
      first.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return !first;
  };

  const submit = (form) => {
    const order = {
      code: "SR-" + Math.floor(100000 + Math.random() * 900000),
      items: Cart.items(),
      total: Cart.subtotal() + SHOP.deliveryFee,
      method: state.method,
      customer: {
        name: form.elements.name.value.trim(),
        phone: toEn(form.elements.phone.value.trim()),
        address: form.elements.address.value.trim(),
      },
    };
    Cart.clear();
    renderSuccess(order);
  };

  const renderSuccess = (o) => {
    const step3 = document.querySelector("[data-step3]");
    if (step3) {
      step3.className = "hanko size-8 text-xs";
      step3.parentElement.classList.remove("text-ink-soft");
    }
    const line = document.querySelector("[data-step-line]");
    if (line) {
      line.className = "mx-2 h-0.5 flex-1 rounded-full bg-gradient-to-l from-shu to-shu/40";
    }

    root.innerHTML = `
      <div class="frame mx-auto max-w-xl p-8 sm:p-12 text-center animate-fade-up">
        <div class="mx-auto grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-shu to-shu-dark text-3xl text-surface shadow-glow">✓</div>
        <span class="mt-6 inline-block rounded-full bg-shu/10 px-3.5 py-1 font-brush text-xs tracking-[.3em] text-shu">ありがとう · ARIGATOU</span>
        <h2 class="mt-3 text-3xl font-black">سفارش شما با موفقیت ثبت شد!</h2>
        <p class="mt-3 text-sm leading-8 text-ink-soft">${esc(o.customer.name)} عزیز، سفارش شما دریافت شد و آشپزخانه ساکورا رامن در حال آماده‌سازی آن است.<br/>
          ${o.method === "card" ? "پس از تأیید واریز، پیک عازم آدرس شما می‌شود." : "مبلغ را هنگام تحویل غذا درب محل با پوز سیار یا نقدی تسویه نمایید."}</p>

        <div class="mt-8 grid grid-cols-2 gap-3 text-right text-xs">
          <div class="rounded-2xl border border-ink/[0.08] bg-paper/70 p-4">
            <span class="text-ink-soft">کد پیگیری سفارش</span>
            <p class="mt-1 font-mono text-base font-black text-ink" dir="ltr">${o.code}</p>
          </div>
          <div class="rounded-2xl border border-ink/[0.08] bg-paper/70 p-4">
            <span class="text-ink-soft">مبلغ کل پرداختی</span>
            <p class="mt-1 text-base font-black text-shu">${toman(o.total)}</p>
          </div>
          <div class="col-span-2 rounded-2xl border border-ink/[0.08] bg-paper/70 p-4">
            <span class="text-ink-soft">روش تسویه</span>
            <p class="mt-1 font-bold text-ink">${o.method === "card" ? "💳 کارت به کارت آنلاین" : "🛵 پرداخت درب محل هنگام تحویل"}</p>
          </div>
        </div>

        <div class="mt-8 flex justify-center gap-3">
          <a href="index.html" class="btn-primary px-8 py-3.5 text-sm">بازگشت به صفحه اصلی</a>
        </div>
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render();
});
