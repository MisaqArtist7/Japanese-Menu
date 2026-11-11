# ساکورا رامن — فرانت‌اند منوی غذای ژاپنی

Tailwind CSS **v4** (CSS-first config) + Vanilla JS — بدون بک‌اند.

## اجرا
```bash
npm install
npm run dev     # بیلد Tailwind در حالت watch
npm run serve   # سرور استاتیک روی http://localhost:5173
npm run build   # خروجی مینیفای در dist/style.css
```

## ساختار
```
index.html        صفحه اصلی: هیرو + تب دسته‌بندی‌ها + محصولات همان دسته
product.html      صفحه تک محصول (?id=...)
checkout.html     سبد خرید + فرم + پرداخت (درب محل / کارت به کارت)
src/input.css     تم و کامپوننت‌ها (@theme, @utility)
dist/style.css    خروجی بیلد Tailwind
js/data.js        داده‌های منو و اطلاعات فروشگاه (جای API بک‌اند)
js/common.js      هدر/فوتر، سبد خرید (localStorage)، فرمت قیمت، کارت محصول
js/home.js | product.js | checkout.js   منطق هر صفحه
assets/           تصاویر غذاها و افزودنی‌ها
```

برای اتصال به بک‌اند: داده‌های `js/data.js` را با fetch از API جایگزین کنید و تابع `submit` در `js/checkout.js` (علامت TODO) را به endpoint ثبت سفارش وصل کنید.
