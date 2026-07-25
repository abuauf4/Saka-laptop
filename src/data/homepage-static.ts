// ─── Saka Laptop — Static Homepage Configuration ───
//
// MIGRATED: 2026-07-25
// Source: Admin panel / database live values
// All homepage data is now hardcoded here. Changes to the admin panel
// will NOT affect the homepage. Edit this file directly to update.
//
// Images are stored locally in /public/assets/homepage/

// ─── Types ───
export interface HomepageData {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  trustStats: { stat: string; label: string; desc: string }[];
  brandTitle: string;
  brandCopy: string;
  brandPoints: { icon: string; title: string; desc: string }[];
  workflowStages: { n: string; title: string; desc: string }[];
  tokoPhotos: { src: string; alt: string; label: string }[];
  deviceCategories: { label: string; emoji: string }[];
  faqs: { q: string; a: string }[];
  closingTitle: string;
  closingSubtitle: string;
}

export interface LokasiData {
  namaToko: string;
  tagline: string;
  foto: string;
  alamat: string;
  telepon: string;
  whatsapp: string;
  jamWeekday: string;
  jamWeekend: string;
  mapsLink: string;
  lat: number;
  lng: number;
}

export interface TestimoniData {
  id: string;
  nama: string;
  role: string;
  teks: string;
  rating: number;
  laptop: string;
  avatar: string;
}

// ─── Homepage Content (migrated from HomepageContent DB singleton) ───
export const HOMEPAGE_CONTENT: HomepageData = {
  heroEyebrow: "Laptop Lamamu Masih Bernilai",
  heroTitle: "Jual Laptop Bekasmu Tanpa Ribet.",
  heroSubtitle:
    "Kirim foto dan spesifikasi laptop melalui WhatsApp. Tim kami akan membantu analisa dan berikan penawaran.",
  heroImage: "/Hero.webp",

  trustStats: [
    {
      stat: "12",
      label: "Titik QC",
      desc: "Setiap laptop diperiksa di 12 titik: layar, keyboard, touchpad, baterai, charger, storage, RAM, kamera, speaker, port, WiFi, fisik.",
    },
    {
      stat: "1\u20132",
      label: "Hari Proses",
      desc: "Dari pengajuan via WhatsApp sampai penawaran final. Review awal 1\u00d724 jam, inspeksi fisik 30\u201360 menit di toko.",
    },
    {
      stat: "100%",
      label: "Penawaran Transparan",
      desc: "Harga berdasarkan hasil QC aktual, bukan tebakan. Kamu lihat sendiri apa yang diperiksa dan kenapa harganya segitu.",
    },
  ],

  brandTitle: "Bukan Sekadar Membeli Laptop.",
  brandCopy:
    "Kami membantu proses penilaian perangkat secara transparan sebelum memberikan penawaran.",
  brandPoints: [
    {
      icon: "Eye",
      title: "Transparan",
      desc: "Setiap pengecekan dilakukan terbuka. Kamu tahu persis apa yang diperiksa dan kenapa harganya segitu.",
    },
    {
      icon: "ShieldCheck",
      title: "Profesional",
      desc: "Tim teknisi berpengalaman menilai perangkat secara objektif, bukan asal tebak harga.",
    },
    {
      icon: "Clock",
      title: "Cepat",
      desc: "Dari pengajuan ke penawaran, prosesnya gak berhari-hari. Tim kami responsif.",
    },
  ],

  workflowStages: [
    {
      n: "01",
      title: "Ajukan Laptop",
      desc: "Kirim foto dan spesifikasi laptop via WhatsApp. Sebut kondisi sejujurnya.",
    },
    {
      n: "02",
      title: "Review Awal",
      desc: "Tim kami cek data awal dan kembali ke kamu dengan pertanyaan klarifikasi kalau perlu.",
    },
    {
      n: "03",
      title: "Pengecekan",
      desc: "Bawa laptop ke toko. Teknisi inspeksi 12 titik: layar, keyboard, baterai, port, fisik, dll.",
    },
    {
      n: "04",
      title: "Penawaran",
      desc: "Harga diberikan berdasarkan hasil inspeksi. Bukan tebakan, bukan asal — ada dasarnya.",
    },
    {
      n: "05",
      title: "Deal",
      desc: "Kamu bebas terima atau tolak. Kalau deal, pembayaran dilakukan langsung.",
    },
  ],

  tokoPhotos: [
    {
      src: "/assets/homepage/toko-pembongkaran.webp",
      alt: "Teknisi membongkar laptop untuk inspeksi",
      label: "Pembongkaran",
    },
    {
      src: "/assets/homepage/toko-qc-detail.jpg",
      alt: "Pengecekan komponen dengan multimeter",
      label: "Tertata Rapih",
    },
    {
      src: "/assets/homepage/toko-tes-fungsi.jpg",
      alt: "Tes layar dan keyboard",
      label: "",
    },
    {
      src: "/assets/homepage/toko-meja-kerja.jpg",
      alt: "Meja kerja teknisi dengan tools lengkap",
      label: "",
    },
  ],

  deviceCategories: [
    { label: "Laptop Kantor", emoji: "\uD83D\uDCBC" },
    { label: "Laptop Gaming", emoji: "\uD83C\uDFAE" },
    { label: "MacBook", emoji: "\uD83C\uDF4E" },
    { label: "Workstation", emoji: "\uD83D\uDDA5\uFE0F" },
    { label: "Komputer", emoji: "\uD83D\uDDA5\uFE0F" },
    { label: "Monitor", emoji: "\uD83D\uDDFA\uFE0F" },
    { label: "Aset IT Kantor", emoji: "\uD83D\uDDE3\uFE0F" },
  ],

  faqs: [
    {
      q: "Laptop rusak diterima?",
      a: "Ya, kami tetap nerima. Hasil QC yang menentukan harga — kalau banyak komponen yang gagal, penawaran menyesuaikan. Tapi selama masih ada nilai (komponen masih bisa dipakai atau dijual parts), kami tetap kasih penawaran jujur.",
    },
    {
      q: "Laptop mati total diterima?",
      a: "Ya, diterima. Laptop mati total biasanya masih ada nilai dari komponen yang masih berfungsi (RAM, SSD, layar, keyboard, charger). Tim teknisi akan cek komponen per komponen, kasih penawaran berdasarkan apa yang masih bisa diselamatkan. Jangan dibuang dulu — chat kami.",
    },
    {
      q: "LCD shadow / ghosting diterima?",
      a: "Diterima, tapi penawaran menyesuaikan. LCD shadow (bayangan bekas gambar) atau ghosting biasanya berarti panel layar udah wear. Kami tetap beli, tapi harga jual ulang juga bakal turun, jadi penawaran ke kamu juga menyesuaikan. Selama layar masih bisa dipakai normal, masih ada nilai.",
    },
    {
      q: "Baterai soak / health rendah diterima?",
      a: "Ya, diterima. Baterai soak (cepat habis) atau health rendah itu masalah umum di laptop bekas. Kami cek health baterai di QC, dan penawaran menyesuaikan. Kalau baterai masih 70%+ masih lumayan. Kalau udah di bawah 50%, harga turun dikit — tapi gak drastis, karena baterai bisa diganti.",
    },
    {
      q: "Keyboard rusak / ada tombol mati diterima?",
      a: "Diterima. Keyboard rusak (tombol mati, sticky, atau rapuh) bisa diganti, jadi masih ada nilai. Di QC kami tes semua tombol satu-satu. Penawaran menyesuaikan berapa banyak tombol yang bermasalah — kalau cuma 1-2 tombol, gak terlalu ngaruh. Kalau banyak, harga turun dikit.",
    },
    {
      q: "Data pribadi di laptop lama gimana?",
      a: "Sangat aman. Sebelum laptop masuk inventory, tim kami lakukan secure wipe (DoD 3-pass wipe — standard militer) supaya data gak bisa direcovery. Tapi kami sarankan kamu backup data penting & sign out dari akun (iCloud, Google, Microsoft) sebelum dibawa ke toko. Kalau lupa, kami bantu wipe di depan kamu kalau mau.",
    },
    {
      q: "Harus datang langsung?",
      a: "Pengajuan awal bisa online via WhatsApp. Tapi untuk inspeksi fisik & finalisasi harga, laptop harus dibawa ke toko. Kalau kamu di luar kota, hubungi kami dulu — mungkin bisa diatur via kurir.",
    },
    {
      q: "Berapa lama proses?",
      a: "Dari kamu ajukan via WA sampai dapat penawaran awal: biasanya 1\u00d724 jam. Kalau lanjut inspeksi fisik di toko: 30-60 menit. Jadi total 1-2 hari kerja dari awal sampai deal.",
    },
    {
      q: "Bagaimana pembayaran?",
      a: "Setelah deal, pembayaran langsung. Bisa transfer bank (BCA/Mandiri/BRI) atau tunai di toko. Untuk trade-in, nilai laptop dipakai sebagai potongan kalau kamu mau tukar dengan unit lain di inventory.",
    },
    {
      q: "Jika harga tidak cocok?",
      a: "Gak masalah. Kamu bebas tolak tanpa biaya. Laptop dikembalikan dalam kondisi sama persis seperti saat dibawa. Kami gak maksa — penawaran cuma referensi, keputusan tetap di kamu.",
    },
  ],

  closingTitle: "Laptop Lamamu Masih Bernilai.",
  closingSubtitle:
    "Chat kami sekarang via WhatsApp. Gratis, tanpa komitmen.",
};

// ─── Lokasi / Store Info (migrated from Lokasi DB singleton) ───
export const LOKASI: LokasiData = {
  namaToko: "Jakarta Laptops",
  tagline: "Pusat Inspeksi & Trade-in Laptop Bekas",
  foto: "/assets/homepage/logo.svg",
  alamat:
    "Jl. Salam 3, RT.10/RW.3, Kb. Jeruk, Kec. Kb. Jeruk, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11530",
  telepon: "+6287816086261",
  whatsapp: "6287816086261",
  jamWeekday: "Senin - Sabtu: 09.00 - 21.00 WIB",
  jamWeekend: "Minggu: 10.00 - 18.00 WIB",
  mapsLink: "https://maps.app.goo.gl/bENhSKVVmPKcfAeq9?g_st=ac",
  lat: -6.202598,
  lng: 106.779466,
};

// ─── Logo (migrated from StoreLogo DB singleton) ───
// DB had empty logoData — fallback to local SVG logo.
export const LOGO = "/assets/homepage/logo.svg";

// ─── Testimoni (migrated from Testimoni DB table) ───
export const TESTIMONI: TestimoniData[] = [
  {
    id: "t01",
    nama: "Rizky Pratama",
    role: "Gamer",
    teks: "Beli ASUS ROG Strix G16 di Jakarta Laptops, kualitasnya top! Performance-nya juara buat main game berat. Pelayanannya juga ramah dan fast respon.",
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
    teks: "Pengalaman belanja di Jakarta Laptops sangat menyenangkan. Admin-nya helpful, bantu rekomendasi laptop yang sesuai kebutuhan. LG Gram 17-nya mantap!",
    rating: 4,
    laptop: "LG Gram 17",
    avatar: "",
  },
];
