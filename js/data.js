/**
 * داده‌های منو (فعلاً استاتیک — بعداً با API بک‌اند جایگزین می‌شود)
 */
window.MENU = {
  categories: [
    { id: "all", name: "همه", jp: "全部", icon: "🍱" },
    { id: "ramen", name: "رامن", jp: "拉麺", icon: "🍜" },
    { id: "soup", name: "سوپ‌ها", jp: "汁物", icon: "🥣" },
    { id: "topping", name: "افزودنی‌ها", jp: "トッピング", icon: "🥚" },
  ],

  products: [
    // ---------- Ramen ----------
    {
      id: "shoyu-ramen", category: "ramen", name: "شویو رامن", en: "Shōyu Ramen", jp: "醤油ラーメン",
      price: 385000, image: "assets/dishes/shoyu-ramen.jpg", badge: "پرفروش",
      short: "آب‌گوشت بر پایه سس سویا، متعادل و خوش‌طعم.",
      description: "رامن کلاسیک توکیو با آب‌گوشت شفاف مرغ و سس سویای دم‌کرده. همراه با چاشو، تخم‌مرغ آجیتاما، ناروتو، منما و جلبک نوری.",
      ingredients: ["نودل گندم", "آب‌گوشت مرغ", "سس سویا", "چاشو", "تخم‌مرغ آجیتاما", "ناروتو", "پیازچه"],
      spicy: 0, time: "۱۵ دقیقه", calories: 620,
    },
    {
      id: "shio-ramen", category: "ramen", name: "شیو رامن", en: "Shio Ramen", jp: "塩ラーメン",
      price: 365000, image: "assets/dishes/shio-ramen.jpg",
      short: "آب‌گوشت نمکی، سبک و زلال.",
      description: "قدیمی‌ترین سبک رامن با آب‌گوشت روشن و نمک دریایی؛ سبک، لطیف و مناسب کسانی که طعم خالص را دوست دارند.",
      ingredients: ["نودل نازک", "آب‌گوشت مرغ و دشی", "نمک دریایی", "تخم‌مرغ", "منما", "پیازچه"],
      spicy: 0, time: "۱۵ دقیقه", calories: 540,
    },
    {
      id: "miso-ramen", category: "ramen", name: "میسو رامن", en: "Miso Ramen", jp: "味噌ラーメン",
      price: 395000, image: "assets/dishes/miso-ramen.jpg",
      short: "آب‌گوشت غلیظ و پرطعم با اومامی عمیق.",
      description: "سبک ساپورو با خمیر میسوی تخمیرشده، ذرت شیرین، جوانه ماش و کره. گرم و سیرکننده برای روزهای سرد.",
      ingredients: ["نودل ضخیم", "خمیر میسو", "ذرت", "جوانه ماش", "کره", "چاشو"],
      spicy: 1, time: "۱۷ دقیقه", calories: 710,
    },
    {
      id: "tonkotsu-ramen", category: "ramen", name: "تونکوتسو رامن", en: "Tonkotsu Ramen", jp: "豚骨ラーメン",
      price: 445000, image: "assets/dishes/tonkotsu-ramen.jpg", badge: "ویژه سرآشپز",
      short: "آب‌گوشت کرمی استخوان، غنی و لذیذ.",
      description: "آب‌گوشتی که ۱۸ ساعت آرام جوشیده تا کرمی و مخملی شود. با چاشو، زنجبیل ترشی قرمز، تخم‌مرغ و قارچ کیکوراگه.",
      ingredients: ["نودل نازک", "آب‌گوشت استخوان", "چاشو", "بنی‌شوگا", "تخم‌مرغ", "نوری"],
      spicy: 0, time: "۱۵ دقیقه", calories: 820,
    },
    {
      id: "shoyu-tonkotsu", category: "ramen", name: "شویو تونکوتسو", en: "Shoyu Tonkotsu", jp: "醤油豚骨",
      price: 435000, image: "assets/dishes/shoyu-tonkotsu.jpg",
      short: "ترکیبی هماهنگ از سس سویا و آب‌گوشت استخوان.",
      description: "بهترینِ دو دنیا: غلظت تونکوتسو و عمق طعم شویو در یک کاسه، همراه با چاشوی دودی و تخم‌مرغ عسلی.",
      ingredients: ["نودل", "آب‌گوشت استخوان", "سس سویا", "چاشو", "تخم‌مرغ", "نوری"],
      spicy: 0, time: "۱۶ دقیقه", calories: 780,
    },
    {
      id: "kara-miso-ramen", category: "ramen", name: "کارا میسو رامن", en: "Kara Miso Ramen", jp: "辛味噌ラーメン",
      price: 415000, image: "assets/dishes/kara-miso-ramen.jpg", badge: "تند 🌶",
      short: "آب‌گوشت میسوی تند با حرارتی آتشین.",
      description: "میسو رامن با روغن چیلی خانگی، گوشت چرخ‌کرده تند و ذرت. برای عاشقان طعم‌های تند و جسورانه.",
      ingredients: ["نودل ضخیم", "میسو", "روغن چیلی", "گوشت چرخ‌کرده", "ذرت", "پیازچه"],
      spicy: 3, time: "۱۷ دقیقه", calories: 760,
    },
    {
      id: "tsukemen", category: "ramen", name: "تسوکه‌من", en: "Tsukemen", jp: "つけ麺",
      price: 425000, image: "assets/dishes/tsukemen.jpg",
      short: "نودل سرد که در آب‌گوشت غلیظ زده می‌شود.",
      description: "نودل‌های ضخیم و سرد جدا از سس غلیظ و داغ سرو می‌شوند؛ هر لقمه را در سس فرو کنید و لذت ببرید.",
      ingredients: ["نودل ضخیم سرد", "سس غلیظ ماهی و استخوان", "چاشو", "تخم‌مرغ", "نوری"],
      spicy: 1, time: "۱۸ دقیقه", calories: 690,
    },
    {
      id: "yuzu-ramen", category: "ramen", name: "یوزو رامن", en: "Yuzu Ramen", jp: "柚子ラーメン",
      price: 405000, image: "assets/dishes/yuzu-ramen.jpg", badge: "جدید",
      short: "آب‌گوشت معطر با رایحه مرکبات یوزو.",
      description: "آب‌گوشت شیوی سبک با پوست و آب یوزو؛ تازه، معطر و متفاوت. همراه با مرغ آب‌پز و برش لیمو.",
      ingredients: ["نودل نازک", "آب‌گوشت مرغ", "یوزو", "مرغ", "برش لیمو", "نوری"],
      spicy: 0, time: "۱۵ دقیقه", calories: 520,
    },

    // ---------- Soups ----------
    {
      id: "miso-soup", category: "soup", name: "سوپ میسو", en: "Miso Soup", jp: "味噌汁",
      price: 145000, image: "assets/dishes/miso-soup.jpg", badge: "کلاسیک",
      short: "سوپ کلاسیک با میسو، توفو، جلبک و پیازچه.",
      description: "سوپ آرامش‌بخش و سنتی ژاپنی با آب دشی، خمیر میسو، مکعب‌های توفو، جلبک واکامه و پیازچه تازه.",
      ingredients: ["دشی", "میسو", "توفو", "جلبک واکامه", "پیازچه"],
      spicy: 0, time: "۸ دقیقه", calories: 120,
    },
    {
      id: "suimono", category: "soup", name: "سوئی‌مونو", en: "Suimono", jp: "すまし汁",
      price: 165000, image: "assets/dishes/suimono.jpg",
      short: "سوپ شفاف و لطیف با توفو و قارچ شیتاکه.",
      description: "سوپ زلال با دشی کومبو، توفو، قارچ شیتاکه و سبزیجات تازه؛ ساده، ظریف و سبک.",
      ingredients: ["دشی کومبو", "توفو", "قارچ شیتاکه", "سبزیجات"],
      spicy: 0, time: "۱۰ دقیقه", calories: 90,
    },
    {
      id: "tonjiru", category: "soup", name: "تون‌جیرو", en: "Tonjiru", jp: "豚汁",
      price: 195000, image: "assets/dishes/tonjiru.jpg",
      short: "سوپ میسوی مقوی با گوشت و سبزیجات.",
      description: "سوپ گرم و سیرکننده میسو با گوشت نرم، هویج، تربچه دایکون و سیب‌زمینی.",
      ingredients: ["میسو", "گوشت", "هویج", "دایکون", "سیب‌زمینی", "پیازچه"],
      spicy: 0, time: "۱۲ دقیقه", calories: 260,
    },
    {
      id: "ozoni", category: "soup", name: "اوزونی", en: "Ozoni", jp: "お雑煮",
      price: 215000, image: "assets/dishes/ozoni.jpg",
      short: "سوپ سنتی سال نو با موچی و مرغ.",
      description: "سوپ جشن سال نوی ژاپنی با کیک برنج موچی، مرغ، سبزیجات و آب‌گوشت خوش‌طعم.",
      ingredients: ["موچی", "مرغ", "هویج", "سبزیجات", "دشی"],
      spicy: 0, time: "۱۴ دقیقه", calories: 310,
    },
    {
      id: "udon-soup", category: "soup", name: "سوپ اودون", en: "Udon Soup", jp: "うどん",
      price: 285000, image: "assets/dishes/udon-soup.jpg",
      short: "نودل اودون ضخیم با کاماباکو و آب‌گوشت.",
      description: "نودل‌های ضخیم و جویدنی اودون در آب‌گوشت دشی با کاماباکو (کیک ماهی) و پیازچه.",
      ingredients: ["نودل اودون", "دشی", "کاماباکو", "پیازچه"],
      spicy: 0, time: "۱۲ دقیقه", calories: 430,
    },
    {
      id: "kenchin-jiru", category: "soup", name: "کنچین‌جیرو", en: "Kenchin Jiru", jp: "けんちん汁",
      price: 175000, image: "assets/dishes/kenchin-jiru.jpg", badge: "گیاهی 🌿",
      short: "سوپ سبزیجات سالم با توفو و سویای سبک.",
      description: "سوپ گیاهی سنتی معابد ذن با توفو، سبزیجات ریشه‌ای، قارچ و سس سویای ملایم.",
      ingredients: ["توفو", "سبزیجات ریشه‌ای", "قارچ", "سس سویا"],
      spicy: 0, time: "۱۲ دقیقه", calories: 180,
    },

    // ---------- Toppings ----------
    {
      id: "ajitama", category: "topping", name: "آجیتاما", en: "Ajitama", jp: "味玉",
      price: 45000, image: "assets/toppings/ajitama.jpg",
      short: "تخم‌مرغ عسلی مزه‌دار شده.",
      description: "تخم‌مرغ نیم‌پز که یک شب در سس سویا و میرین خوابانده شده؛ زرده عسلی و طلایی.",
      ingredients: ["تخم‌مرغ", "سس سویا", "میرین"], spicy: 0, time: "—", calories: 80,
    },
    {
      id: "chashu", category: "topping", name: "چاشو", en: "Chashu", jp: "チャーシュー",
      price: 95000, image: "assets/toppings/chashu.jpg",
      short: "برش‌های گوشت آرام‌پز.",
      description: "گوشت رول‌شده که ساعت‌ها در سس شیرین سویا آرام پخته شده و سپس شعله‌دهی می‌شود.",
      ingredients: ["گوشت", "سس سویا", "زنجبیل"], spicy: 0, time: "—", calories: 210,
    },
    {
      id: "menma", category: "topping", name: "منما", en: "Menma", jp: "メンマ",
      price: 40000, image: "assets/toppings/menma.jpg",
      short: "جوانه بامبوی تخمیری.",
      description: "ساقه‌های جوان بامبو تخمیر و طعم‌دار شده؛ ترد و کمی شیرین.",
      ingredients: ["بامبو", "سس سویا", "روغن کنجد"], spicy: 0, time: "—", calories: 25,
    },
    {
      id: "nori", category: "topping", name: "نوری", en: "Nori", jp: "海苔",
      price: 30000, image: "assets/toppings/nori.jpg",
      short: "ورق جلبک دریایی.",
      description: "ورق‌های ترد جلبک دریایی برشته برای افزودن طعم دریا به رامن.",
      ingredients: ["جلبک دریایی"], spicy: 0, time: "—", calories: 10,
    },
    {
      id: "negi", category: "topping", name: "نگی", en: "Negi", jp: "ネギ",
      price: 25000, image: "assets/toppings/negi.jpg",
      short: "پیازچه خردشده تازه.",
      description: "پیازچه ژاپنی تازه و خردشده برای طراوت و عطر بیشتر.",
      ingredients: ["پیازچه"], spicy: 0, time: "—", calories: 5,
    },
    {
      id: "kikurage", category: "topping", name: "کیکوراگه", en: "Kikurage", jp: "木耳",
      price: 45000, image: "assets/toppings/kikurage.jpg",
      short: "قارچ گوش چوبی.",
      description: "قارچ گوش چوبی خلالی با بافتی ترد و ژله‌ای، مکمل عالی تونکوتسو.",
      ingredients: ["قارچ کیکوراگه", "روغن کنجد"], spicy: 0, time: "—", calories: 15,
    },
  ],
};

/** شماره کارت برای پرداخت کارت به کارت (بعداً از بک‌اند) */
window.SHOP = {
  name: "ساکورا رامن",
  phone: "۰۲۱-۱۲۳۴۵۶۷۸",
  address: "تهران، خیابان ولیعصر، کوچه ساکورا، پلاک ۷",
  card: { number: "6037997512345678", holder: "رستوران ساکورا رامن", bank: "بانک ملی" },
  deliveryFee: 45000,
};
