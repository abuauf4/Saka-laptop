import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Seed Products ──
  const products = [
    {
      id: "l01",
      nama: "ASUS ROG Strix G16",
      harga: 18500000,
      kategori: "Gaming",
      ram: "16GB DDR5",
      storage: "512GB NVMe",
      gpu: "RTX 4060",
      performaScore: 9,
      portableScore: 4,
      batteryScore: 4,
      image: "/laptops/asus-rog-strix-g16.png",
    },
    {
      id: "l02",
      nama: "Lenovo Legion 5 Pro",
      harga: 21000000,
      kategori: "Gaming",
      ram: "16GB DDR5",
      storage: "1TB NVMe",
      gpu: "RTX 4070",
      performaScore: 10,
      portableScore: 3,
      batteryScore: 3,
      image: "/laptops/lenovo-legion-5-pro.png",
    },
    {
      id: "l03",
      nama: "Acer Nitro V15",
      harga: 9500000,
      kategori: "Gaming",
      ram: "8GB DDR5",
      storage: "512GB NVMe",
      gpu: "RTX 3050",
      performaScore: 7,
      portableScore: 5,
      batteryScore: 5,
      image: "/laptops/acer-nitro-v15.png",
    },
    {
      id: "l04",
      nama: "MSI Katana 15",
      harga: 12800000,
      kategori: "Gaming",
      ram: "16GB DDR4",
      storage: "512GB NVMe",
      gpu: "RTX 4050",
      performaScore: 8,
      portableScore: 4,
      batteryScore: 4,
      image: "/laptops/msi-katana-15.png",
    },
    {
      id: "l05",
      nama: "MacBook Air M2",
      harga: 17500000,
      kategori: "Editing",
      ram: "8GB Unified",
      storage: "256GB SSD",
      gpu: "M2 10-core",
      performaScore: 8,
      portableScore: 9,
      batteryScore: 10,
      image: "/laptops/macbook-air-m2.png",
    },
    {
      id: "l06",
      nama: "ASUS ProArt Studiobook 16",
      harga: 28500000,
      kategori: "Editing",
      ram: "32GB DDR5",
      storage: "1TB NVMe",
      gpu: "RTX 4070",
      performaScore: 10,
      portableScore: 3,
      batteryScore: 4,
      image: "/laptops/asus-proart-studiobook-16.png",
    },
    {
      id: "l07",
      nama: "Lenovo ThinkPad X1 Carbon",
      harga: 22000000,
      kategori: "Kerja",
      ram: "16GB LPDDR5",
      storage: "512GB NVMe",
      gpu: "Intel Iris Xe",
      performaScore: 7,
      portableScore: 10,
      batteryScore: 10,
      image: "/laptops/lenovo-thinkpad-x1.png",
    },
    {
      id: "l08",
      nama: "HP EliteBook 840 G10",
      harga: 15800000,
      kategori: "Kerja",
      ram: "16GB DDR5",
      storage: "512GB NVMe",
      gpu: "Intel Iris Xe",
      performaScore: 7,
      portableScore: 8,
      batteryScore: 9,
      image: "/laptops/hp-elitebook-840.png",
    },
    {
      id: "l09",
      nama: "ASUS Zenbook 14 OLED",
      harga: 13200000,
      kategori: "Kerja",
      ram: "16GB LPDDR5",
      storage: "512GB NVMe",
      gpu: "Intel Iris Xe",
      performaScore: 6,
      portableScore: 9,
      batteryScore: 8,
      image: "/laptops/asus-zenbook-14-oled.png",
    },
    {
      id: "l10",
      nama: "Lenovo IdeaPad Slim 3",
      harga: 6500000,
      kategori: "Sekolah",
      ram: "8GB DDR4",
      storage: "256GB NVMe",
      gpu: "Intel UHD",
      performaScore: 4,
      portableScore: 7,
      batteryScore: 7,
      image: "/laptops/lenovo-ideapad-slim3.png",
    },
    {
      id: "l11",
      nama: "ASUS VivoBook 14",
      harga: 7200000,
      kategori: "Sekolah",
      ram: "8GB DDR4",
      storage: "512GB NVMe",
      gpu: "Intel Iris Xe",
      performaScore: 5,
      portableScore: 8,
      batteryScore: 7,
      image: "/laptops/asus-vivobook-14.png",
    },
    {
      id: "l12",
      nama: "Acer Aspire 5",
      harga: 5800000,
      kategori: "Sekolah",
      ram: "4GB DDR4",
      storage: "256GB NVMe",
      gpu: "Intel UHD",
      performaScore: 3,
      portableScore: 6,
      batteryScore: 6,
      image: "/laptops/acer-aspire-5.png",
    },
    {
      id: "l13",
      nama: 'MacBook Pro M3 14"',
      harga: 32000000,
      kategori: "Editing",
      ram: "18GB Unified",
      storage: "512GB SSD",
      gpu: "M3 14-core",
      performaScore: 10,
      portableScore: 7,
      batteryScore: 9,
      image: "/laptops/macbook-pro-m3.png",
    },
    {
      id: "l14",
      nama: "HP Pavilion 15",
      harga: 8900000,
      kategori: "Sekolah",
      ram: "8GB DDR4",
      storage: "512GB NVMe",
      gpu: "AMD Radeon 610M",
      performaScore: 5,
      portableScore: 6,
      batteryScore: 6,
      image: "/laptops/hp-pavilion-15.png",
    },
    {
      id: "l15",
      nama: "Samsung Galaxy Book3 Pro",
      harga: 16500000,
      kategori: "Ultrabook",
      ram: "16GB LPDDR5",
      storage: "512GB NVMe",
      gpu: "Intel Iris Xe",
      performaScore: 7,
      portableScore: 10,
      batteryScore: 9,
      image: "/laptops/samsung-galaxy-book3-pro.png",
    },
    {
      id: "l16",
      nama: "LG Gram 17",
      harga: 19200000,
      kategori: "Ultrabook",
      ram: "16GB LPDDR5",
      storage: "512GB NVMe",
      gpu: "Intel Iris Xe",
      performaScore: 6,
      portableScore: 10,
      batteryScore: 10,
      image: "/laptops/lg-gram-17.png",
    },
    {
      id: "l17",
      nama: "ASUS TUF Gaming A15",
      harga: 11900000,
      kategori: "Gaming",
      ram: "8GB DDR5",
      storage: "512GB NVMe",
      gpu: "RTX 4050",
      performaScore: 8,
      portableScore: 4,
      batteryScore: 5,
      image: "/laptops/asus-tuf-a15.png",
    },
    {
      id: "l18",
      nama: "Lenovo Yoga 9i",
      harga: 20500000,
      kategori: "Ultrabook",
      ram: "16GB LPDDR5",
      storage: "1TB NVMe",
      gpu: "Intel Iris Xe",
      performaScore: 7,
      portableScore: 9,
      batteryScore: 8,
      image: "/laptops/lenovo-yoga-9i.png",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }
  console.log(`Seeded ${products.length} products`);

  // ── Seed Testimoni ──
  const testimoni = [
    {
      id: "t01",
      nama: "Rizky Pratama",
      role: "Gamer",
      teks: "Beli ASUS ROG Strix G16 di Saka Laptop, kualitasnya top! Performance-nya juara buat main game berat. Pelayanannya juga ramah dan fast respon.",
      rating: 5,
      laptop: "ASUS ROG Strix G16",
      avatar: "",
    },
    {
      id: "t02",
      nama: "Sari Dewi",
      role: "Content Creator",
      teks: "MacBook Air M2 yang saya beli di sini memang worth it. Ringan, baterai awet, dan cocok banget buat editing video. Proses belanjanya juga gampang!",
      rating: 5,
      laptop: "MacBook Air M2",
      avatar: "",
    },
    {
      id: "t03",
      nama: "Ahmad Fauzi",
      role: "Mahasiswa",
      teks: "Budget terbatas tapi tetap bisa dapet laptop bagus. ASUS VivoBook 14-nya cocok banget buat tugas kuliah. Harganya juga bersahabat di kantong mahasiswa.",
      rating: 4,
      laptop: "ASUS VivoBook 14",
      avatar: "",
    },
    {
      id: "t04",
      nama: "Diana Putri",
      role: "Designer",
      teks: "Saya pakai ASUS ProArt Studiobook 16 untuk desain grafis, dan hasilnya luar biasa. Layarnya akurat warnanya, sangat membantu pekerjaan saya.",
      rating: 5,
      laptop: "ASUS ProArt Studiobook 16",
      avatar: "",
    },
    {
      id: "t05",
      nama: "Budi Santoso",
      role: "Karyawan",
      teks: "ThinkPad X1 Carbon yang saya beli di sini sangat ringan dan tahan banting. Cocok banget buat kerja mobile setiap hari. Recommended!",
      rating: 5,
      laptop: "Lenovo ThinkPad X1 Carbon",
      avatar: "",
    },
    {
      id: "t06",
      nama: "Rina Anggraini",
      role: "Freelancer",
      teks: "Pengalaman belanja di Saka Laptop sangat menyenangkan. Admin-nya helpful, bantu rekomendasi laptop yang sesuai kebutuhan. LG Gram 17-nya mantap!",
      rating: 4,
      laptop: "LG Gram 17",
      avatar: "",
    },
  ];

  for (const t of testimoni) {
    await prisma.testimoni.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
  console.log(`Seeded ${testimoni.length} testimoni`);

  // ── Seed Lokasi ──
  await prisma.lokasi.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      namaToko: "Saka Laptop",
      tagline: "Toko Laptop Terpercaya",
      foto: "/store-front.png",
      alamat: "Jl. Raya Kebayoran Lama No. 12, Kel. Kebayoran Lama, Kec. Kebayoran Lama, Jakarta Selatan 12210",
      telepon: "+62 896-6252-4542",
      whatsapp: "6289662524542",
      jamWeekday: "Senin - Sabtu: 09.00 - 21.00 WIB",
      jamWeekend: "Minggu: 10.00 - 18.00 WIB",
      lat: -6.2445,
      lng: 106.7813,
      mapsLink: "https://maps.google.com/?q=Saka+Laptop+Jl.+Raya+Kebayoran+Lama+Jakarta+Selatan",
    },
  });
  console.log("Seeded lokasi");

  // ── Seed Developer User ──
  const hashedPassword = await bcrypt.hash("122333", 10);
  await prisma.user.upsert({
    where: { username: "Bagas" },
    update: {},
    create: {
      id: "dev_1",
      username: "Bagas",
      password: hashedPassword,
      role: "developer",
      permissions: JSON.stringify(["dashboard", "produk", "testimoni", "kasir", "transaksi", "profil"]),
    },
  });
  console.log("Seeded developer user (Bagas)");

  // ── Seed Store Logo ──
  await prisma.storeLogo.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      logoData: "",
    },
  });
  console.log("Seeded store logo");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
