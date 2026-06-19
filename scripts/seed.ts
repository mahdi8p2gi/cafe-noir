import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

const categories = [
  { name: "دانه قهوه", slug: "beans", description: "دانه قهوه تخصصی از بهترین مزارع جهان", icon: "Coffee" },
  { name: "اسپرسو", slug: "espresso", description: "میکس‌های اسپرسو حرفه‌ای", icon: "CupSoda" },
  { name: "کولد برو", slug: "cold-brew", description: "قهوه سرد دم‌آوری شده", icon: "Snowflake" },
  { name: "تجهیزات", slug: "equipment", description: "ابزار و تجهیزات باریستا", icon: "Wrench" },
  { name: "سایر محصولات", slug: "others", description: "فرآورده‌های مبتنی بر قهوه", icon: "Sparkles" },
];

const products = [
  {
    name: "اسپرسو بلند رست",
    slug: "espresso-blend",
    description: "میکس تخصصی اسپرسو با طعم شکلاتی و بدنه پر",
    longDescription: "این میکس از دانه‌های آرابیکا برزیل و روبوستای ویتنام تشکیل شده است. رست تیره آن بدنه‌ای پر و کرمایی غلیظ تولید می‌کند. طعم غالب شکلات تلخ و آجیلی است با اسیدیته پایین. ایده‌آل برای اسپرسو، موکا و کاپوچینو.",
    price: 285000,
    discountPrice: 259000,
    image: "/images/products/espresso-blend.png",
    roastLevel: "DARK",
    origin: "برزیل، ویتنام",
    weight: "۲۵۰ گرم",
    stock: 48,
    sku: "CN-ESP-001",
    featured: true,
    categorySlug: "espresso",
  },
  {
    name: "آرابیکا گلد",
    slug: "arabica-gold",
    description: "دانه آرابیکا تک خاستگاه با طعم کاراملی",
    longDescription: "آرابیکا گلد از مزارع منتخب کلمبیا تأمین می‌شود. رست روشن اسیدیته روشن و شفافی را به همراه دارد. طعم‌های کارامل، عسل و مرکبات در آن قابل تشخیص است. مناسب برای روش‌های دمی مانند V60 و آئروپرس.",
    price: 320000,
    image: "/images/products/arabica-gold.png",
    roastLevel: "LIGHT",
    origin: "کلمبیا",
    weight: "۲۵۰ گرم",
    stock: 36,
    sku: "CN-ARA-002",
    featured: true,
    categorySlug: "beans",
  },
  {
    name: "کولد برو آماده",
    slug: "cold-brew",
    description: "قهوه سرد دم‌آوری شده، آماده نوشیدن",
    longDescription: "کولد برو کافه‌نویر به مدت ۱۸ ساعت در دمای اتاق دم‌آوری شده و سپس فیلتر می‌شود. طعمی نرم، شیرین و بدون تلخی دارد. هر بطری حاوی ۵ وعده ۲۰۰ میلی‌لیتری است.",
    price: 145000,
    image: "/images/products/cold-brew.png",
    roastLevel: "MEDIUM",
    origin: "اتیوپی",
    weight: "۱ لیتر",
    stock: 60,
    sku: "CN-CB-003",
    featured: true,
    categorySlug: "cold-brew",
  },
  {
    name: "فرنچ پرس مدرن",
    slug: "french-press",
    description: "قاوه‌جوش شیشه‌ای ضدحرارت با طراحی مینیمال",
    longDescription: "فرنچ پرس از جنس شیشه بروموسیلیکات و استیل ضدزنگ با ظرفیت ۶۰۰ میلی‌لیتر. طراحی مینیمال و کاربردی. مناسب برای دم‌آوری قهوه، چای و شربت‌های سرد.",
    price: 410000,
    discountPrice: 365000,
    image: "/images/products/french-press.png",
    weight: "۶۰۰ml",
    stock: 24,
    sku: "CN-EQP-004",
    featured: false,
    categorySlug: "equipment",
  },
  {
    name: "لاته اینستنت پریمیوم",
    slug: "latte-mix",
    description: "پودر لاته فوری با طعم واقعی شیر",
    longDescription: "پودر لاته فوری کافه‌نویر از شیر خشک باکیفیت و عصاره قهوه آرابیکا تهیه شده. کافی است دو قاشق در آب گرم حل کنید تا یک لاته کریمی و خوش‌طعم داشته باشید. هر بسته ۱۰ وعده.",
    price: 98000,
    image: "/images/products/latte-mix.png",
    roastLevel: "MEDIUM",
    weight: "۲۰۰ گرم",
    stock: 80,
    sku: "CN-INS-005",
    featured: false,
    categorySlug: "others",
  },
  {
    name: "قهوه ترک رست تیره",
    slug: "turkish-coffee",
    description: "قهوه ترک آسیاب ریز با عطر قوی",
    longDescription: "قهوه ترک کافه‌نویر از دانه‌های باکیفیت آسیاب شده به نرمی پودر است. طعم غلیظ و عطر قوی دارد. مناسب برای جذوه و قهوه‌جوش ترک.",
    price: 165000,
    image: "/images/products/turkish-coffee.png",
    roastLevel: "DARK",
    origin: "برزیل",
    weight: "۲۰۰ گرم",
    stock: 52,
    sku: "CN-TRK-006",
    featured: true,
    categorySlug: "beans",
  },
  {
    name: "دانه قهوه موکا",
    slug: "mocha-beans",
    description: "دانه قهوه پوشیده با شکلات تلخ",
    longDescription: "دانه قهوه رست متوسط پوشیده شده با شکلات تلخ ۷۰٪. یک میان‌وعده انرژی‌زا با ترکیب کافئین و کاکائو. بسته ۱۵۰ گرمی.",
    price: 125000,
    image: "/images/products/mocha-beans.png",
    roastLevel: "MEDIUM",
    weight: "۱۵۰ گرم",
    stock: 40,
    sku: "CN-SNK-007",
    featured: false,
    categorySlug: "others",
  },
  {
    name: "دکاف رست روشن",
    slug: "decaf-roast",
    description: "قهوه بدون کافئین با طعم کامل",
    longDescription: "دکاف کافه‌نویر با روش سوئیس واتر کافئین آن جدا شده بدون از دست دادن طعم. رست روشن، اسیدیته ملایم و طعم آجیلی. برای کسانی که به کافئین حساسیت دارند ایده‌آل است.",
    price: 295000,
    image: "/images/products/decaf-roast.png",
    roastLevel: "LIGHT",
    origin: "مکزیک",
    weight: "۲۵۰ گرم",
    stock: 28,
    sku: "CN-DEC-008",
    featured: false,
    categorySlug: "beans",
  },
  {
    name: "فیلتر ویتنامی",
    slug: "vietnam-drip",
    description: "ست فیلتر فین ویتنامی استیل ضدزنگ",
    longDescription: "فیلتر فین ویتنامی اصیل، از استیل ضدزنگ با کیفیت. شامل فیلتر، درپوش و پیچ فشار. مناسب برای دم‌آوری قهوه چکه‌ای غلیظ به سبک ویتنامی.",
    price: 180000,
    image: "/images/products/vietnam-drip.png",
    weight: "۱ عدد",
    stock: 32,
    sku: "CN-EQP-009",
    featured: false,
    categorySlug: "equipment",
  },
  {
    name: "سیروپ کارامل ماکیاتو",
    slug: "caramel-macchiato",
    description: "سیروپ کارamel برای طعم‌دهی قهوه",
    longDescription: "سیروپ کارامل پریمیوم کافه‌نویر، شیرین و کریمی. برای تهیه کارامل ماکیاتو، لاته و شیرین کردن نوشیدنی‌های سرد و گرم. بطری ۵۰۰ میلی‌لیتری.",
    price: 89000,
    image: "/images/products/caramel-macchiato.png",
    weight: "۵۰۰ml",
    stock: 70,
    sku: "CN-SRP-010",
    featured: false,
    categorySlug: "others",
  },
  {
    name: "اتیوپی یرگاچف",
    slug: "ethiopia-yirgacheffe",
    description: "تک خاستگاه اتیوپی با طعم میوه‌ای",
    longDescription: "یرگاچف از منطقه سیدامو اتیوپی، یکی از معروف‌ترین قهوه‌های جهان. رست روشن، اسیدیته روشن و طعم‌های یاس، لیمو و میوه‌های سنگی. یک تجربه قهوه اصیل.",
    price: 385000,
    discountPrice: 349000,
    image: "/images/products/ethiopia-yirgacheffe.png",
    roastLevel: "LIGHT",
    origin: "اتیوپی",
    weight: "۲۵۰ گرم",
    stock: 22,
    sku: "CN-ETH-011",
    featured: true,
    categorySlug: "beans",
  },
  {
    name: "کلمبیا سوپرمو",
    slug: "colombia-supremo",
    description: "دانه بزرگ کلمبیا با تعادل عالی",
    longDescription: "کلمبیا سوپرمو با اندازه دانه درشت، طعم متعادل و بدنه متوسط. طعم‌های آجیلی، کارامل و شکلات شیری. رست متوسط برای استفاده همه‌کاره.",
    price: 305000,
    image: "/images/products/colombia-supremo.png",
    roastLevel: "MEDIUM",
    origin: "کلمبیا",
    weight: "۲۵۰ گرم",
    stock: 34,
    sku: "CN-COL-012",
    featured: true,
    categorySlug: "beans",
  },
];

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const existingAdmin = await db.user.findUnique({ where: { email: "admin@cafenoir.ir" } });
  if (!existingAdmin) {
    await db.user.create({
      data: {
        email: "admin@cafenoir.ir",
        name: "مدیر کافه‌نویر",
        password: adminPassword,
        role: "ADMIN",
        emailVerified: true,
      },
    });
    console.log("Admin user created: admin@cafenoir.ir / admin123");
  }

  // Create demo user
  const userPassword = await bcrypt.hash("user123", 10);
  const existingUser = await db.user.findUnique({ where: { email: "user@cafenoir.ir" } });
  if (!existingUser) {
    await db.user.create({
      data: {
        email: "user@cafenoir.ir",
        name: "کاربر نمونه",
        password: userPassword,
        role: "USER",
        emailVerified: true,
      },
    });
    console.log("Demo user created: user@cafenoir.ir / user123");
  }

  // Create categories
  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Categories created");

  // Create products
  for (const p of products) {
    const category = await db.category.findUnique({ where: { slug: p.categorySlug } });
    if (!category) continue;
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        longDescription: p.longDescription,
        price: p.price,
        discountPrice: p.discountPrice ?? null,
        image: p.image,
        roastLevel: p.roastLevel ?? null,
        origin: p.origin ?? null,
        weight: p.weight ?? null,
        stock: p.stock,
        sku: p.sku,
        featured: p.featured,
        categoryId: category.id,
        rating: 4 + (Math.random()),
        reviewCount: Math.floor(Math.random() * 30) + 5,
      },
    });
  }
  console.log("Products created");

  // Create sample reviews
  const reviewUsers = ["user@cafenoir.ir"];
  const sampleProducts = await db.product.findMany({ take: 6 });
  const reviewTexts = [
    "کیفیت فوق‌العاده، طعمش واقعی عالیه",
    "ارسال سریع و بسته‌بندی خوب، قهوه تازه بود",
    "بهترین قهوه‌ای که تا حالا خریدم",
    "قیمت منصفانه نسبت به کیفیت",
    "عطر قهوه وقتی پاکت رو باز می‌کنی فوق‌العاده‌ست",
  ];
  for (const product of sampleProducts) {
    const user = await db.user.findUnique({ where: { email: reviewUsers[0] } });
    if (!user) continue;
    const existing = await db.review.findFirst({ where: { productId: product.id, userId: user.id } });
    if (!existing) {
      await db.review.create({
        data: {
          userId: user.id,
          productId: product.id,
          rating: 5,
          comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        },
      });
    }
  }
  console.log("Reviews created");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
