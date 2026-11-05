import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

const img = (n: number) => `/images/products/produk-${n}.svg`;

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Admin KidSmart",
      email: "admin@kidsmart.com.my",
      passwordHash: hashPassword("admin123"),
      role: "ADMIN",
      phone: "012-3456789",
      address: "No. 1, Jalan Ceria, 50000 Kuala Lumpur",
      city: "Kuala Lumpur",
      postcode: "50000",
    },
  });

  await prisma.user.create({
    data: {
      name: "Siti Aminah",
      email: "siti@example.com",
      passwordHash: hashPassword("password123"),
      phone: "013-9876543",
      address: "No. 12, Jalan Mawar, 43000 Kajang",
      city: "Kajang",
      postcode: "43000",
    },
  });

  const categories = await Promise.all(
    [
      ["Pakaian Bayi", "pakaian-bayi", "Pakaian selesa dan comel untuk bayi baru lahir hingga 24 bulan.", "categories/pakaian-bayi.svg"],
      ["Pakaian Kanak-Kanak Lelaki", "pakaian-kanak-kanak-lelaki", "Baju, seluar dan aksesori untuk kanak-kanak lelaki.", "categories/pakaian-kanak-kanak-lelaki.svg"],
      ["Pakaian Kanak-Kanak Perempuan", "pakaian-kanak-kanak-perempuan", "Gaun, baju kurung dan pakaian comel untuk si kecil perempuan.", "categories/pakaian-kanak-kanak-perempuan.svg"],
      ["Mainan Pendidikan", "mainan-pendidikan", "Mainan pembelajaran yang merangsang minda kanak-kanak.", "categories/mainan-pendidikan.svg"],
      ["Mainan Bayi", "mainan-bayi", "Mainan lembut dan selamat untuk bayi dan kanak-kanak kecil.", "categories/mainan-bayi.svg"],
      ["Mainan Kreatif", "mainan-kreatif", "Mainan kreatif untuk merangsang imaginasi dan kemahiran.", "categories/mainan-kreatif.svg"],
      ["Aksesori Kanak-Kanak", "aksesori-kanak-kanak", "Topi, selimut, beg dan aksesori kanak-kanak lain.", "categories/aksesori-kanak-kanak.svg"],
    ].map(([name, slug, description, image]) =>
      prisma.category.create({ data: { name, slug, description, image: `/images/${image}` } })
    )
  );

  const cat = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const products = [
    {
      name: "Baju Kurung Kanak-Kanak Premium",
      slug: "baju-kurung-kanak-kanak-premium",
      description: "Baju kurung kanak-kanak daripada fabrik kapas premium yang lembut dan selesa. Reka bentuk moden dengan warna pastel yang menarik. Sesuai untuk pemakaian harian dan majlis keluarga.",
      price: 49.9, compareAtPrice: 69.9, stock: 35, category: cat["pakaian-kanak-kanak-lelaki"],
      images: [img(1)], sizes: ["2T", "3T", "4T", "5T"], colors: ["Merah Jambu", "Biru Muda", "Kuning Pastel"],
      isNew: true, isPopular: true, onSale: true, rating: 4.8, sold: 156,
    },
    {
      name: "Beg9292 Mainan Beruang Comel 40cm",
      slug: "mainan-beruang-comel-40cm",
      description: "Mainan plush beruang yang sangat lembut dan mesra untuk dipeluk. Saiz 40cm, sesuai untuk kanak-kanak dan bayi. Fabrik premium berkualiti tinggi, selamat untuk kanak-kanak.",
      price: 35.9, compareAtPrice: 49.9, stock: 50, category: cat["mainan-bayi"],
      images: [img(2)], sizes: [], colors: ["Merah Jambu", "Kelabu", "Coklat"],
      isNew: false, isPopular: true, onSale: true, rating: 4.9, sold: 320,
    },
    {
      name: "Set Blok Pembelajaran Kanak-Kanak 100pcs",
      slug: "set-blok-pembelajaran-100pcs",
      description: "Set blok kayu premium 100 keping untuk merangsang kreativiti, koordinasi mata-tangan dan kemahiran penyelesaian masalah. Sesuai untuk kanak-kanak umur 2 tahun ke atas.",
      price: 89.9, compareAtPrice: 129.9, stock: 25, category: cat["mainan-pendidikan"],
      images: [img(3)], sizes: [], colors: ["Pelbagai Warna"],
      isNew: true, isPopular: true, onSale: true, rating: 4.7, sold: 98,
    },
    {
      name: "Gaun Bayi Lengan Panjang Premium",
      slug: "gaun-bayi-lengan-panjang-premium",
      description: "Gaun bayi daripada fabrik katun mesra kulit yang selesa sepanjang hari. Reka bentuk comel dengan butang depan mudah untuk menukar lampin. Tersedia dalam pelbagai warna pastel.",
      price: 42.9, compareAtPrice: 59.9, stock: 40, category: cat["pakaian-bayi"],
      images: [img(4)], sizes: ["0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M"], colors: ["Biru Muda", "Merah Jambu", "Hijau Muda", "Kuning"],
      isNew: true, isPopular: false, onSale: true, rating: 4.6, sold: 87,
    },
    {
      name: "Baju Onesies Bayi Comel",
      slug: "baju-onesies-bayi-comel",
      description: "Baju onesies bayi yang super selesa dengan sistem snap button memudahkan penukaran lampin. Fabrik stretch lembut yang tidak mencerut. Pilihan warna ceria yang disukai kanak-kanak.",
      price: 29.9, compareAtPrice: 39.9, stock: 60, category: cat["pakaian-bayi"],
      images: [img(5)], sizes: ["0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M"], colors: ["Merah Jambu", "Biru Muda", "Hijau Muda", "Putih"],
      isNew: false, isPopular: true, onSale: true, rating: 4.8, sold: 210,
    },
    {
      name: "Kereta Mainan Remote Control",
      slug: "kereta-mainan-remote-control",
      description: "Kereta mainan kawalan jauh berkelajuan 2 kelajuan yang menyeronokkan untuk kanak-kanak. Bateri tahan lama, rekaan comel dan bunyi realistik. Sesuai untuk kanak-kanak umur 3 tahun ke atas.",
      price: 79.9, compareAtPrice: 119.9, stock: 20, category: cat["mainan-kreatif"],
      images: [img(6)], sizes: [], colors: ["Merah", "Biru", "Kuning"],
      isNew: true, isPopular: true, onSale: true, rating: 4.7, sold: 65,
    },
    {
      name: "Bola Belon Kanak-Kanak 50cm",
      slug: "bola-belon-kanak-kanak-50cm",
      description: "Bola belon yang besar dan ceria untuk aktiviti luar dan sukan. Bahan PVC tahan lasak dan selamat. Sesuai untuk kanak-kanak umur 2 tahun ke atas untuk bermain dan bersenam.",
      price: 24.9, stock: 80, category: cat["mainan-bayi"],
      images: [img(7)], sizes: [], colors: ["Hijau Muda", "Merah Jambu", "Biru Muda"],
      isNew: false, isPopular: false, onSale: false, rating: 4.5, sold: 143,
    },
    {
      name: "Topi Matahari Kanak-Kanak UV Protection",
      slug: "topi-matahari-kanak-kanak",
      description: "Topi matahari dengan brim lebar untuk perlindungan UV daripada matahari. Fabrik mesh breathable dan tali dagu boleh laras. Sesuai untuk aktiviti luar bersama keluarga.",
      price: 19.9, compareAtPrice: 29.9, stock: 55, category: cat["aksesori-kanak-kanak"],
      images: [img(8)], sizes: [], colors: ["Biru Muda", "Merah Jambu", "Kuning Pastel", "Hijau Muda"],
      isNew: false, isPopular: true, onSale: true, rating: 4.6, sold: 178,
    },
    {
      name: "Set Stoking & Barut Bayi 5-in-1",
      slug: "set-stoking-barut-bayi-5in1",
      description: "Set lengkap 5 pasang stoking dan barut bayi daripada fabrik premium. Anti slip design memastikan barut tidak tergelincir. Pelbagai corak comel yang disukai ibu bapa.",
      price: 34.9, stock: 45, category: cat["pakaian-bayi"],
      images: [img(9)], sizes: ["0-6M", "6-12M", "12-18M", "18-24M"], colors: ["Pelbagai Corak"],
      isNew: false, isPopular: false, onSale: false, rating: 4.7, sold: 92,
    },
    {
      name: "Beg Mayat Bayi Dual-Zip",
      slug: "beg-mayat-bayi-dual-zip",
      description: "Beg mayat bayi dengan zip dua hala untuk kemudahan akses. Bahan kalis air dan mudah dibersihkan. Ruang luas untuk barangan bayi dan lampin tambahan.",
      price: 59.9, compareAtPrice: 79.9, stock: 30, category: cat["pakaian-bayi"],
      images: [img(10)], sizes: [], colors: ["Hijau Muda", "Biru Muda", "Merah Jambu"],
      isNew: true, isPopular: false, onSale: true, rating: 4.6, sold: 54,
    },
    {
      name: "Puzzle Kayu Kanak-Kanak 4-in-1",
      slug: "puzzle-kayu-kanak-kanak-4in1",
      description: "Set puzzle kayu 4 dalam 1 dengan gambar comel yang merangsang pembelajaran. Kayu asli berkualiti tinggi, cat mesra kanak-kanak dan selamat. Sesuai untuk kanak-kanak umur 1-4 tahun.",
      price: 39.9, stock: 40, category: cat["mainan-pendidikan"],
      images: [img(11)], sizes: [], colors: ["Pelbagai"],
      isNew: false, isPopular: true, onSale: false, rating: 4.8, sold: 167,
    },
    {
      name: "Mainan Plush Arnab Lembut 35cm",
      slug: "mainan-plush-arnab-lembut-35cm",
      description: "Mainan plush arnab yang sangat lembut untuk dipeluk dan tidur bersama. Saiz 35cm sesuai untuk kanak-kanak. Fabrik premium mesra kulit dan selamat untuk semua peringkat umur.",
      price: 32.9, stock: 55, category: cat["mainan-bayi"],
      images: [img(12)], sizes: [], colors: ["Putih", "Merah Jambu", "Kelabu"],
      isNew: true, isPopular: true, onSale: false, rating: 4.9, sold: 245,
    },
    {
      name: "Set Baju Tidur Kanak-Kanak 2-Pakaian",
      slug: "set-baju-tidur-kanak-kanak",
      description: "Set baju tidur kanak-kanak 2 pakaian daripada fabrik cotton lembut. Reka bentuk comel dengan corak bintang dan bulan. Selesa untuk tidur nyenyak sepanjang malam.",
      price: 45.9, compareAtPrice: 59.9, stock: 35, category: cat["pakaian-kanak-kanak-perempuan"],
      images: [img(13)], sizes: ["2T", "3T", "4T", "5T", "6T"], colors: ["Biru Muda", "Merah Jambu", "Ungu Muda"],
      isNew: true, isPopular: false, onSale: true, rating: 4.7, sold: 78,
    },
    {
      name: "Stroller Mainan Kanak-Kanak Deluxe",
      slug: "stroller-mainan-kanak-kanak-deluxe",
      description: "Stroller mainan untuk adik-adik atau mainan bayi. Reka bentuk premium dengan warna pastel yang cantik. Sesuai untuk kanak-kanak bermain peranan sebagai ibu bapa atau doktor.",
      price: 99.9, compareAtPrice: 149.9, stock: 15, category: cat["mainan-kreatif"],
      images: [img(14)], sizes: [], colors: ["Merah Jambu", "Biru Muda"],
      isNew: false, isPopular: true, onSale: true, rating: 4.6, sold: 42,
    },
    {
      name: "Selimut Kanak-Kanak Lembut 100x100cm",
      slug: "selimut-kanak-kanak-lembut",
      description: "Selimut kanak-kanak yang sangat lembut dan hangat untuk tidur selesa. Saiz 100x100cm sesuai untuk katil kanak-kanak. Fabrik double-sided dengan corak comel di kedua-dua belah.",
      price: 55.9, stock: 25, category: cat["aksesori-kanak-kanak"],
      images: [img(15)], sizes: [], colors: ["Biru Muda", "Merah Jambu", "Hijau Muda", "Kuning"],
      isNew: false, isPopular: false, onSale: false, rating: 4.8, sold: 89,
    },
    {
      name: "Set Blok Kayu Ajaib 120pcs",
      slug: "set-blok-kayu-ajaib-120pcs",
      description: "Set blok kayu premium 120 keping dengan pelbagai bentuk dan warna. Merangsang kreativiti, kemahiran motor halus dan penyelesaian masalah. Keselamatan kanak-kanak adalah keutamaan.",
      price: 119.9, compareAtPrice: 159.9, stock: 18, category: cat["mainan-pendidikan"],
      images: [img(16)], sizes: [], colors: ["Pelbagai Warna"],
      isNew: true, isPopular: true, onSale: true, rating: 4.9, sold: 76,
    },
    {
      name: "Xilofon Mainan Muzik Kanak-Kanak",
      slug: "xilofon-mainan-muzik-kanak-kanak",
      description: "Xilofon mainan dengan 8 nota muzik yang merangsang minat kanak-kanak terhadap muzik. Kayu berkualiti tinggi dengan warna cerah dan bunyi yang jelas. Sesuai untuk kanak-kanak umur 1 tahun ke atas.",
      price: 29.9, compareAtPrice: 39.9, stock: 50, category: cat["mainan-kreatif"],
      images: [img(17)], sizes: [], colors: ["Pelbagai Warna"],
      isNew: false, isPopular: false, onSale: true, rating: 4.5, sold: 134,
    },
    {
      name: "Mainan Anak Patung Berbaju Comel",
      slug: "mainan-anak-patung-berbaju-comel",
      description: "Patung anak yang comel dengan pakaian yang boleh ditukar. Mengajar kanak-kanak tentang tanggungjawab dan empati. Saiz sesuai untuk kanak-kanak umur 2 tahun ke atas.",
      price: 64.9, stock: 20, category: cat["mainan-bayi"],
      images: [img(18)], sizes: [], colors: ["Merah Jambu", "Biru Muda"],
      isNew: false, isPopular: false, onSale: false, rating: 4.4, sold: 38,
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        stock: p.stock,
        images: JSON.stringify(p.images),
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        isNew: p.isNew,
        isPopular: p.isPopular,
        onSale: p.onSale,
        rating: p.rating,
        sold: p.sold,
        categoryId: p.category,
      },
    });
  }

  await prisma.promoCode.createMany({
    data: [
      { code: "KANAK10", type: "PERCENT", value: 10, minOrder: 50 },
      { code: "SELAMAT20", type: "PERCENT", value: 20, minOrder: 100 },
      { code: "KIDS5", type: "FIXED", value: 5, minOrder: 30 },
      { code: "WELCOME15", type: "PERCENT", value: 15, minOrder: 0 },
    ],
  });

  // Beberapa pesanan contoh
  const customer = await prisma.user.findFirst({ where: { email: "siti@example.com" } });
  if (customer) {
    const firstProduct = await prisma.product.findFirst();
    if (firstProduct) {
      const order = await prisma.order.create({
        data: {
          orderNumber: "KS-2026-0001",
          userId: customer.id,
          status: "Dihantar",
          paymentStatus: "Dibayar",
          paymentMethod: "FPX",
          subtotal: firstProduct.price,
          shipping: 8.5,
          total: firstProduct.price + 8.5,
          shippingName: customer.name,
          shippingPhone: customer.phone ?? "",
          shippingAddress: customer.address ?? "",
          shippingCity: customer.city ?? "",
          shippingPostcode: customer.postcode ?? "",
          shippingMethod: "Paket Selamat (Semantan)",
          items: {
            create: [{
              productId: firstProduct.id,
              name: firstProduct.name,
              price: firstProduct.price,
              qty: 1,
              size: null,
              color: null,
              image: img(1),
            }],
          },
        },
      });
      console.log("Contoh pesanan:", order.orderNumber);
    }
  }

  console.log("Seed selesai. Admin: admin@kidsmart.com.my / admin123");
}

main().finally(() => prisma.$disconnect());
