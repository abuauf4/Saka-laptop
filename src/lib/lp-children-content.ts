// ─── Landing Page Content untuk 4 LP B2C Anak (hardcoded) ───
// Dipakai oleh:
//   - /jual-macbook-bekas-jakarta
//   - /jual-laptop-gaming-bekas
//   - /tukar-tambah-laptop
//   - /jual-laptop-kantor-bekas
//
// Brand design 100% sama dengan /jual-laptop-bekas-jakarta (parent).
// Yang beda: copy, keyword target, FAQ content.
//
// Foto/visual pakai yang sama (gak generate baru per brief user).

import type { LandingPageData } from "@/lib/landing-page-data";

// ─── Helper: build WA link (sama dengan LP parent) ───
// Pattern: wa.me/{number}?text={prefill}&utm_source={utm}
// number diambil dari useLokasi() store di client component, jadi
// ini cuma utm source yang beda per LP.
export const LP_UTM_SOURCES = {
  parent: "lp_jual_laptop_bekas",
  macbook: "lp_jual_macbook_bekas",
  gaming: "lp_jual_laptop_gaming_bekas",
  tukarTambah: "lp_tukar_tambah_laptop",
  kantor: "lp_jual_laptop_kantor_bekas",
} as const;

// ─── 1. /jual-macbook-beekas-jakarta ───
export const MACBOOK_LP_CONTENT: LandingPageData = {
  heroEyebrow: "JUAL MACBOOK BEKAS JAKARTA",
  heroTitle: "Jual MacBook Bekas Anda Hari Ini.",
  heroSubtitle:
    "Spesialis MacBook Air/Pro M1, M2, M3, Intel. Estimasi harga tinggi, proses transparan, pembayaran langsung di jam kerja. Pickup gratis Jabodetabek untuk unit di atas Rp 5 juta.",
  heroPrimaryCta: "Kirim Foto MacBook",
  heroSecondaryCta: "Chat WhatsApp",
  heroTrustBadges: [
    { text: "Respons cepat" },
    { text: "Pembayaran cepat di jam kerja" },
    { text: "Terima kondisi minus" },
  ],

  valuePillars: [
    {
      icon: "Clock",
      headline: "Respons Cepat",
      subCopy: "Tim kami responsif di jam kerja (08:00-21:00) setiap hari.",
    },
    {
      icon: "Camera",
      headline: "Estimasi Instan",
      subCopy: "Kirim foto MacBook, dapatkan estimasi harga dalam 1-2 jam.",
    },
    {
      icon: "Truck",
      headline: "Pickup Gratis Jabodetabek",
      subCopy: "Penjemputan gratis untuk MacBook di atas Rp 5 juta.",
    },
    {
      icon: "Wallet",
      headline: "Pembayaran Cepat",
      subCopy: "Cash atau transfer langsung setelah inspeksi (selama jam kerja 08:00-21:00).",
    },
    {
      icon: "AlertCircle",
      headline: "Terima Kondisi Minus",
      subCopy: "MacBook ret, baterai soak, keyboard rusak tetap diterima.",
    },
  ],

  processSteps: [
    {
      step: "1",
      headline: "Kirim Foto",
      subCopy: "WA atau form upload foto MacBook + spek (model, tahun, M1/M2/Pro).",
      duration: "5 menit",
    },
    {
      step: "2",
      headline: "Dapat Estimasi",
      subCopy: "Tim spesialis MacBook berikan estimasi harga berdasarkan foto.",
      duration: "1-2 jam",
    },
    {
      step: "3",
      headline: "QC & Inspeksi",
      subCopy: "Cek battery health, keyboard, layar Retina, port, Touch ID/Bar.",
      duration: "30-60 menit",
    },
    {
      step: "4",
      headline: "Bayar",
      subCopy: "Cash atau transfer langsung, selesai.",
      duration: "5 menit",
    },
  ],

  estimasiTitle: "Cek Estimasi Harga MacBook Anda",
  estimasiSubtitle: "Interactive widget, no commit, hasil instan",
  estimasiCtaLabel: "Lanjut Chat WhatsApp untuk Penawaran Akurat",

  faqs: [
    {
      q: "Berapa harga MacBook bekas saya?",
      a: "Harga tergantung model (Air/Pro), chip (M1/M2/M3/Intel), tahun, RAM, storage, dan kondisi. Kirim foto via WA, dapatkan estimasi dalam 1-2 jam. Harga final setelah inspeksi battery health, layar Retina, keyboard, dan port.",
      keyword: "harga macbook bekas",
    },
    {
      q: "MacBook rusak bisa dijual?",
      a: "Ya, kami menerima MacBook dalam kondisi rusak (mati, layar pecah, keyboard rusak, baterai soak, Touch Bar bermasalah). Harga disesuaikan dengan kondisi setelah inspeksi.",
      keyword: "jual macbook rusak",
    },
    {
      q: "MacBook Intel (lama) masih diterima?",
      a: "Ya, kami terima MacBook Intel (2015-2020). Penawaran menyesuaikan tahun dan kondisi. MacBook Intel 2020 masih punya nilai lumayan, terutama Pro 16-inch dan Air 2020.",
      keyword: "jual macbook intel bekas",
    },
    {
      q: "MacBook dengan baterai soak diterima?",
      a: "Ya, diterima. Baterai soak adalah masalah umum di MacBook lama. Kami cek cycle count dan battery health di QC. Penawaran menyesuaikan — biasanya turun Rp 500K-1.5jt tergantung model, tapi tetap kompetitif.",
      keyword: "jual macbook baterai soak",
    },
    {
      q: "Apakah pickup gratis untuk MacBook?",
      a: "Ya, pickup gratis area Jabodetabek untuk MacBook dengan estimasi harga di atas Rp 5 juta. Untuk di bawah Rp 5 juta, bisa diantar ke lokasi atau pickup dengan biaya transport.",
      keyword: "pickup macbook bekas jakarta",
    },
    {
      q: "Berapa lama proses inspeksi MacBook?",
      a: "Inspeksi fisik 30-60 menit di lokasi Jakarta. Cek battery health via System Report, keyboard test, layar Retina (dead pixel, backlight bleed), port (USB-C, MagSafe), Touch ID/Bar. Setelah deal, pembayaran spot selama jam kerja (08:00-21:00).",
      keyword: "lama proses jual macbook",
    },
    {
      q: "Pembayaran cash atau transfer?",
      a: "Keduanya. Cash untuk deal langsung setelah inspeksi (selama jam kerja 08:00-21:00). Transfer bank (BCA/Mandiri/BRI) untuk nominal besar atau atas request. QRIS tersedia untuk nominal di bawah Rp 5 juta.",
      keyword: "jual macbook cash jakarta",
    },
    {
      q: "Area layanan Jakarta mana saja?",
      a: "Seluruh Jakarta (Pusat, Selatan, Barat, Timur, Utara), plus Bodetabek (Bogor, Depok, Tangerang, Bekasi). Pickup gratis untuk estimasi di atas Rp 5 juta.",
      keyword: "jual macbook bekas jakarta",
    },
  ],

  trustStats: [
    { stat: "12 titik", label: "QC + Apple diagnostic" },
    { stat: "1-2 jam", label: "Estimasi setelah foto" },
    { stat: "Jabodetabek", label: "Pickup gratis unit di atas Rp 5jt" },
  ],
  trustTitle: "Spesialis MacBook di Jakarta",
  trustSubtitle: "Paham nilai M1/M2/M3, battery health, dan kelengkapan",

  finalCtaTitle: "Siap Jual MacBook Bekas Anda?",
  finalCtaSubtitle:
    "Estimasi harga dalam 1-2 jam. Pickup gratis Jabodetabek untuk MacBook di atas Rp 5jt. Pembayaran cepat di jam kerja.",
  finalCtaPrimary: "Kirim Foto MacBook",
  finalCtaSecondary: "Chat WhatsApp",

  metaTitle:
    "Jual MacBook Bekas Jakarta — Harga Tinggi, Pickup Gratis | Jakarta Laptops",
  metaDescription:
    "Jual MacBook Air/Pro M1/M2/M3/Intel bekas Jakarta. Estimasi harga tinggi, proses transparan, pickup gratis Jabodetabek. Terima kondisi minus. Chat WA sekarang!",
  ogTitle: "Jual MacBook Bekas Anda Hari Ini — Jakarta Laptops",
  ogDescription:
    "Spesialis MacBook Air/Pro. Estimasi cepat, bayar spot, pickup gratis Jabodetabek.",
};

// ─── 2. /jual-laptop-gaming-bekas ───
export const GAMING_LP_CONTENT: LandingPageData = {
  heroEyebrow: "JUAL LAPTOP GAMING BEKAS",
  heroTitle: "Jual Laptop Gaming Bekas Anda Hari Ini.",
  heroSubtitle:
    "Spesialis laptop gaming: Asus ROG, MSI, Acer Predator, Lenovo Legion. Estimasi harga tinggi untuk unit RTX/Ryzen spekulatif. Pickup gratis Jabodetabek untuk laptop gaming di atas Rp 5 juta.",
  heroPrimaryCta: "Kirim Foto Laptop Gaming",
  heroSecondaryCta: "Chat WhatsApp",
  heroTrustBadges: [
    { text: "Respons cepat" },
    { text: "Pembayaran cepat di jam kerja" },
    { text: "Terima kondisi minus" },
  ],

  valuePillars: [
    {
      icon: "Clock",
      headline: "Respons Cepat",
      subCopy: "Tim kami responsif di jam kerja (08:00-21:00) setiap hari.",
    },
    {
      icon: "Camera",
      headline: "Estimasi Instan",
      subCopy: "Kirim foto laptop gaming, dapatkan estimasi dalam 1-2 jam.",
    },
    {
      icon: "Truck",
      headline: "Pickup Gratis Jabodetabek",
      subCopy: "Penjemputan gratis untuk laptop gaming di atas Rp 5 juta.",
    },
    {
      icon: "Wallet",
      headline: "Pembayaran Cepat",
      subCopy: "Cash atau transfer langsung setelah inspeksi (selama jam kerja 08:00-21:00).",
    },
    {
      icon: "AlertCircle",
      headline: "Terima Kondisi Minus",
      subCopy: "Laptop gaming ret, ngedrop, thermal issue tetap diterima.",
    },
  ],

  processSteps: [
    {
      step: "1",
      headline: "Kirim Foto",
      subCopy: "WA foto laptop gaming + spek (GPU, RAM, SSD, processor, refresh rate).",
      duration: "5 menit",
    },
    {
      step: "2",
      headline: "Dapat Estimasi",
      subCopy: "Tim kami berikan estimasi harga berdasarkan GPU condition dan spek.",
      duration: "1-2 jam",
    },
    {
      step: "3",
      headline: "QC & Inspeksi",
      subCopy: "Stress test GPU, cek thermals, refresh rate, RGB keyboard, port.",
      duration: "30-60 menit",
    },
    {
      step: "4",
      headline: "Bayar",
      subCopy: "Cash atau transfer langsung, selesai.",
      duration: "5 menit",
    },
  ],

  estimasiTitle: "Cek Estimasi Harga Laptop Gaming Anda",
  estimasiSubtitle: "Interactive widget, no commit, hasil instan",
  estimasiCtaLabel: "Lanjut Chat WhatsApp untuk Penawaran Akurat",

  faqs: [
    {
      q: "Berapa harga laptop gaming bekas saya?",
      a: "Harga tergantung GPU (RTX 20/30/40 series, RX), RAM, SSD, processor, refresh rate, dan kondisi. Kirim foto via WA, dapatkan estimasi dalam 1-2 jam. Harga final setelah stress test GPU dan cek thermals.",
      keyword: "harga laptop gaming bekas",
    },
    {
      q: "Laptop gaming rusak diterima?",
      a: "Ya, kami menerima laptop gaming dalam kondisi rusak (GPU mati, layar pecah, keyboard rusak, thermal throttling berat). Harga disesuaikan dengan kondisi setelah inspeksi.",
      keyword: "jual laptop gaming rusak",
    },
    {
      q: "Brand laptop gaming apa saja yang diterima?",
      a: "Semua brand gaming: Asus ROG/TUF, MSI Gaming/Cyborg, Acer Predator/Nitro, Lenovo Legion, HP Omen, Dell G-Series/Alienware. RTX 20 series ke atas paling tinggi nilainya.",
      keyword: "jual laptop gaming bekas jakarta",
    },
    {
      q: "Laptop gaming dengan thermal issue diterima?",
      a: "Ya, diterima. Thermal issue (overheat, throttling) umum di laptop gaming. Kami cek thermal paste condition, fan health, dan performa under load. Penawaran menyesuaikan — biasanya turun 10-20% tapi tetap fair.",
      keyword: "jual laptop gaming overheat",
    },
    {
      q: "Apakah pickup gratis untuk laptop gaming?",
      a: "Ya, pickup gratis area Jabodetabek untuk laptop gaming dengan estimasi harga di atas Rp 5 juta. Untuk di bawah Rp 5 juta, bisa diantar ke lokasi atau pickup dengan biaya transport.",
      keyword: "pickup laptop gaming bekas jakarta",
    },
    {
      q: "Berapa lama proses inspeksi laptop gaming?",
      a: "Inspeksi fisik 30-60 menit. Selain cek standar (layar, keyboard, baterai), kami lakukan stress test GPU 10 menit dengan FurMark, cek thermals, dan benchmark. Setelah deal, pembayaran spot selama jam kerja (08:00-21:00).",
      keyword: "lama proses jual laptop gaming",
    },
    {
      q: "Pembayaran cash atau transfer?",
      a: "Keduanya. Cash untuk deal langsung setelah inspeksi (selama jam kerja 08:00-21:00). Transfer bank (BCA/Mandiri/BRI) untuk nominal besar. QRIS tersedia untuk nominal di bawah Rp 5 juta.",
      keyword: "jual laptop gaming cash jakarta",
    },
    {
      q: "Area layanan Jakarta mana saja?",
      a: "Seluruh Jakarta (Pusat, Selatan, Barat, Timur, Utara), plus Bodetabek (Bogor, Depok, Tangerang, Bekasi). Pickup gratis untuk estimasi di atas Rp 5 juta.",
      keyword: "jual laptop gaming bekas jakarta",
    },
  ],

  trustStats: [
    { stat: "12 titik", label: "QC + GPU stress test" },
    { stat: "1-2 jam", label: "Estimasi setelah foto" },
    { stat: "Jabodetabek", label: "Pickup gratis unit di atas Rp 5jt" },
  ],
  trustTitle: "Spesialis Laptop Gaming di Jakarta",
  trustSubtitle: "Paham nilai RTX/Ryzen, thermals, dan kondisi GPU",

  finalCtaTitle: "Siap Jual Laptop Gaming Bekas Anda?",
  finalCtaSubtitle:
    "Estimasi harga dalam 1-2 jam. Pickup gratis Jabodetabek untuk laptop gaming di atas Rp 5jt. Pembayaran cepat di jam kerja.",
  finalCtaPrimary: "Kirim Foto Laptop Gaming",
  finalCtaSecondary: "Chat WhatsApp",

  metaTitle:
    "Jual Laptop Gaming Bekas Jakarta — RTX/Ryzen Harga Tinggi | Jakarta Laptops",
  metaDescription:
    "Jual laptop gaming bekas Jakarta (Asus ROG, MSI, Acer Predator, Lenovo Legion). Estimasi harga tinggi, stress test GPU, pickup gratis Jabodetabek. Chat WA sekarang!",
  ogTitle: "Jual Laptop Gaming Bekas Anda Hari Ini — Jakarta Laptops",
  ogDescription:
    "Spesialis laptop gaming. Estimasi cepat, GPU stress test, bayar spot, pickup gratis Jabodetabek.",
};

// ─── 3. /tukar-tambah-laptop ───
export const TUKAR_TAMBAH_LP_CONTENT: LandingPageData = {
  heroEyebrow: "TUKAR TAMBAH LAPTOP JAKARTA",
  heroTitle: "Tukar Tambah Laptop Lama Anda Hari Ini.",
  heroSubtitle:
    "Upgrade ke laptop yang lebih baru dengan trade-in. Estimasi harga laptop lama cepat, selisih bayar/cashback. Pickup gratis Jabodetabek untuk trade-in di atas Rp 3 juta.",
  heroPrimaryCta: "Kirim Foto Laptop Lama",
  heroSecondaryCta: "Chat WhatsApp",
  heroTrustBadges: [
    { text: "Respons cepat" },
    { text: "Selisih bisa cashback" },
    { text: "Inventory beragam, tanya via WA" },
  ],

  valuePillars: [
    {
      icon: "Clock",
      headline: "Respons Cepat",
      subCopy: "Tim kami responsif di jam kerja (08:00-21:00) setiap hari.",
    },
    {
      icon: "Camera",
      headline: "Estimasi Laptop Lama Instan",
      subCopy: "Kirim foto laptop lama, dapatkan estimasi trade-in 1-2 jam.",
    },
    {
      icon: "Truck",
      headline: "Pickup Gratis Jabodetabek",
      subCopy: "Penjemputan gratis untuk trade-in di atas Rp 3 juta.",
    },
    {
      icon: "Wallet",
      headline: "Selisih Fleksibel",
      subCopy: "Selisih bisa cashback kalau laptop lama lebih mahal, atau top-up.",
    },
    {
      icon: "AlertCircle",
      headline: "Inventory Beragam",
      subCopy: "Pilihan laptop hasil refurbish mulus dengan garansi 1 bulan. Stok tanya via WA.",
    },
  ],

  processSteps: [
    {
      step: "1",
      headline: "Kirim Foto Laptop Lama",
      subCopy: "WA foto laptop lama + spek. Sebut juga laptop baru yang diinginkan.",
      duration: "5 menit",
    },
    {
      step: "2",
      headline: "Dapat Estimasi Trade-In",
      subCopy: "Tim berikan estimasi harga laptop lama + rekomendasi laptop baru.",
      duration: "1-2 jam",
    },
    {
      step: "3",
      headline: "Pilih Laptop Baru",
      subCopy: "Browse inventory kami. Tim bantu match dengan budget dan kebutuhan.",
      duration: "15-30 menit",
    },
    {
      step: "4",
      headline: "Deal & Bayar Selisih",
      subCopy: "Inspeksi laptop lama, bayar selisih (atau dapat cashback), bawa pulang.",
      duration: "30-60 menit",
    },
  ],

  estimasiTitle: "Cek Estimasi Trade-In Laptop Anda",
  estimasiSubtitle: "Interactive widget, no commit, hasil instan",
  estimasiCtaLabel: "Lanjut Chat WhatsApp untuk Lihat Inventory",

  faqs: [
    {
      q: "Bagaimana cara tukar tambah laptop?",
      a: "Kirim foto laptop lama via WA, dapatkan estimasi harga. Pilih laptop baru dari inventory kami. Bayar selisih (jika laptop baru lebih mahal) atau dapat cashback (jika laptop lama lebih mahal). Proses 1-2 jam di lokasi.",
      keyword: "cara tukar tambah laptop",
    },
    {
      q: "Laptop rusak bisa ditukar tambah?",
      a: "Ya, kami terima trade-in laptop rusak (mati, layar pecah, keyboard rusak). Harga estimasi menyesuaikan kondisi. Selisih trade-in dengan laptop baru tetap dihitung fair.",
      keyword: "tukar tambah laptop rusak",
    },
    {
      q: "MacBook bisa ditukar tambah dengan laptop Windows?",
      a: "Bisa. Kami fleksibel — MacBook bisa ditukar dengan Windows, atau sebaliknya. Estimasi harga berdasarkan pasar, bukan brand. Selisih dihitung objektif.",
      keyword: "tukar tambah macbook ke windows",
    },
    {
      q: "Inventory laptop baru apa saja yang tersedia?",
      a: "Inventory kami mayoritas laptop bekas refurbish mulus dengan garansi 1 bulan. Brand lengkap: Lenovo ThinkPad, Dell Latitude, HP EliteBook, MacBook, laptop gaming. Stok berubah cepat, tanya via WA untuk unit terbaru.",
      keyword: "inventory laptop bekas jakarta",
    },
    {
      q: "Berapa lama proses tukar tambah?",
      a: "Total 1-2 jam di lokasi. Estimasi laptop lama via WA 1-2 jam sebelumnya. Di toko: inspeksi laptop lama 30-45 menit, pemilihan laptop baru 15-30 menit, deal dan pembayaran 15 menit.",
      keyword: "lama proses tukar tambah laptop",
    },
    {
      q: "Apakah pickup gratis untuk trade-in?",
      a: "Ya, pickup gratis area Jabodetabek untuk laptop lama dengan estimasi di atas Rp 3 juta. Untuk di bawah Rp 3 juta, bisa diantar ke lokasi atau pickup dengan biaya transport.",
      keyword: "pickup tukar tambah laptop jakarta",
    },
    {
      q: "Pembayaran selisih bagaimana?",
      a: "Cash atau transfer bank untuk selisih yang harus dibayar (selama jam kerja 08:00-21:00). Kalau selisih untuk Anda (cashback), kami bayar cash atau transfer langsung. QRIS tersedia untuk nominal di bawah Rp 5 juta.",
      keyword: "pembayaran tukar tambah laptop",
    },
    {
      q: "Area layanan Jakarta mana saja?",
      a: "Seluruh Jakarta (Pusat, Selatan, Barat, Timur, Utara), plus Bodetabek (Bogor, Depok, Tangerang, Bekasi). Pickup gratis untuk estimasi laptop lama di atas Rp 3 juta.",
      keyword: "tukar tambah laptop jakarta",
    },
  ],

  trustStats: [
    { stat: "12 titik", label: "QC inspection per unit" },
    { stat: "1-2 jam", label: "Estimasi setelah foto" },
    { stat: "1 bln", label: "Garansi inventory refurbished" },
  ],
  trustTitle: "Trade-In Adil & Transparan",
  trustSubtitle: "Estimasi fair, inventory berkualitas",

  finalCtaTitle: "Siap Tukar Tambah Laptop Anda?",
  finalCtaSubtitle:
    "Estimasi laptop lama dalam 1-2 jam. Pickup gratis Jabodetabek. Inventory beragam, tanya stok via WA.",
  finalCtaPrimary: "Kirim Foto Laptop Lama",
  finalCtaSecondary: "Chat WhatsApp",

  metaTitle:
    "Tukar Tambah Laptop Jakarta — Estimasi Cepat, Inventory Lengkap | Jakarta Laptops",
  metaDescription:
    "Tukar tambah laptop Jakarta. Estimasi harga laptop lama cepat, pilih laptop baru dari inventory beragam, selisih fleksibel. Pickup gratis Jabodetabek. Chat WA!",
  ogTitle: "Tukar Tambah Laptop Lama Anda Hari Ini — Jakarta Laptops",
  ogDescription:
    "Trade-in laptop Jakarta. Estimasi cepat, inventory lengkap, pickup gratis Jabodetabek.",
};

// ─── 4. /jual-laptop-kantor-bekas ───
export const KANTOR_LP_CONTENT: LandingPageData = {
  heroEyebrow: "JUAL LAPTOP KANTOR BEKAS",
  heroTitle: "Jual Laptop Kantor Bekas Anda Hari Ini.",
  heroSubtitle:
    "Bulk acquisition 10+ unit dari perusahaan. Pickup gratis Jabodetabek, data wipe bersertifikat, pembayaran corporate via invoice. Spesialis ThinkPad, Latitude, EliteBook.",
  heroPrimaryCta: "Kirim Foto & Jumlah Unit",
  heroSecondaryCta: "Chat WhatsApp",
  heroTrustBadges: [
    { text: "Pickup gratis 10+ unit" },
    { text: "Data wipe bersertifikat" },
    { text: "Invoice + transfer corporate" },
  ],

  valuePillars: [
    {
      icon: "Clock",
      headline: "Respons Cepat",
      subCopy: "Tim korporat kami responsif di jam kerja (08:00-21:00) setiap hari.",
    },
    {
      icon: "Camera",
      headline: "Estimasi Bulk Instan",
      subCopy: "Kirim foto + jumlah unit, dapatkan estimasi total dalam 2-4 jam.",
    },
    {
      icon: "Truck",
      headline: "Pickup Gratis Jabodetabek",
      subCopy: "Penjemputan gratis untuk 10+ unit di seluruh Jabodetabek.",
    },
    {
      icon: "Wallet",
      headline: "Pembayaran Corporate",
      subCopy: "Invoice + transfer bank, NPWP support, dokumentasi lengkap.",
    },
    {
      icon: "AlertCircle",
      headline: "Data Wipe Bersertifikat",
      subCopy: "DoD 3-pass wipe, sertifikat destruction, compliance-ready.",
    },
  ],

  processSteps: [
    {
      step: "1",
      headline: "Kirim Inventory List",
      subCopy: "WA foto + daftar unit (brand, model, kondisi, jumlah).",
      duration: "10 menit",
    },
    {
      step: "2",
      headline: "Dapat Estimasi Bulk",
      subCopy: "Tim berikan estimasi total + jadwal pickup dalam 2-4 jam.",
      duration: "2-4 jam",
    },
    {
      step: "3",
      headline: "Pickup & QC Onsite",
      subCopy: "Tim kami datang, inspeksi per unit, data wipe onsite jika diperlukan.",
      duration: "1-2 hari kerja",
    },
    {
      step: "4",
      headline: "Invoice & Transfer",
      subCopy: "Invoice + transfer bank. Sertifikat disposal dikirim via email.",
      duration: "1-2 hari",
    },
  ],

  estimasiTitle: "Cek Estimasi Bulk Laptop Kantor Anda",
  estimasiSubtitle: "Untuk 10+ unit. Interactive widget, no commit.",
  estimasiCtaLabel: "Lanjut Chat WhatsApp untuk Penawaran Bulk",

  faqs: [
    {
      q: "Berapa harga laptop kantor bekas saya?",
      a: "Harga tergantung brand (ThinkPad/Latitude/EliteBook), model, tahun, spek, kondisi, dan jumlah unit. Kirim inventory list via WA, dapatkan estimasi total dalam 2-4 jam. Bulk deal dapat harga lebih baik per unit.",
      keyword: "harga laptop kantor bekas",
    },
    {
      q: "Berapa minimum unit untuk bulk acquisition?",
      a: "Minimum 10 unit untuk bulk acquisition dengan pickup gratis dan harga corporate. Untuk di bawah 10 unit, bisa jual sebagai B2C individual (lihat /jual-laptop-bekas-jakarta) — tanpa invoice corporate.",
      keyword: "minimum jual laptop kantor bekas",
    },
    {
      q: "Brand laptop kantor apa saja yang diterima?",
      a: "Semua brand office: Lenovo ThinkPad (T/X/L/X1 series), Dell Latitude (5000/7000/9000), HP EliteBook (800/1000 series), Asus ProArt/Business, Acer TravelMate. Mac untuk kantor juga diterima.",
      keyword: "jual laptop kantor bekas",
    },
    {
      q: "Laptop kantor rusak / mati total diterima?",
      a: "Ya, diterima untuk bulk deal. Bahkan unit mati total masih ada value dari komponen (RAM, SSD, layar). Penawaran per unit menyesuaikan, tetap fair. Bisa mix kondisi mulus + rusak dalam 1 deal.",
      keyword: "jual laptop kantor rusak",
    },
    {
      q: "Bagaimana data wipe dan sertifikat disposal?",
      a: "Data wipe pakai DoD 3-pass (standard militer) atau NIST 800-88 Clear/Purge sesuai request. Sertifikat disposal berisi: daftar unit, serial number, metode wipe, tanggal, tanda tangan. Dikirim via email setelah deal.",
      keyword: "data wipe laptop kantor jakarta",
    },
    {
      q: "Apakah pickup gratis untuk bulk kantor?",
      a: "Ya, pickup gratis area Jabodetabek untuk 10+ unit. Untuk area lain (Bandung, Semarang, Surabaya), bisa diatur dengan biaya transport. Tim kami handle packing dan transport.",
      keyword: "pickup laptop kantor jakarta",
    },
    {
      q: "Bagaimana pembayaran corporate?",
      a: "Invoice resmi dengan NPWP perusahaan, PPN 11% jika applicable. Pembayaran via transfer bank (BCA/Mandiri/BRI) ke rekening PT/CV. Untuk government/BUMN, support PO + e-invoice.",
      keyword: "pembayaran jual laptop kantor",
    },
    {
      q: "Area layanan Jakarta mana saja?",
      a: "Seluruh Jakarta (Pusat, Selatan, Barat, Timur, Utara), plus Bodetabek (Bogor, Depok, Tangerang, Bekasi). Pickup gratis untuk 10+ unit. Luar Jabodetabek bisa diatur case-by-case.",
      keyword: "jual laptop kantor bekas jakarta",
    },
  ],

  trustStats: [
    { stat: "10+", label: "Minimum unit untuk bulk acquisition" },
    { stat: "100%", label: "Data wipe bersertifikat (DoD 3-pass)" },
    { stat: "Jabodetabek", label: "Pickup gratis area" },
  ],
  trustTitle: "Corporate IT Disposal Specialist",
  trustSubtitle: "Pickup bulk, data wipe, invoice corporate",

  finalCtaTitle: "Siap Jual Laptop Kantor Bekas Anda?",
  finalCtaSubtitle:
    "Estimasi bulk dalam 2-4 jam. Pickup gratis Jabodetabek 10+ unit. Invoice corporate + data wipe bersertifikat.",
  finalCtaPrimary: "Kirim Foto & Jumlah Unit",
  finalCtaSecondary: "Chat WhatsApp",

  metaTitle:
    "Jual Laptop Kantor Bekas Jakarta — Bulk Acquisition, Invoice Corporate | Jakarta Laptops",
  metaDescription:
    "Jual laptop kantor bekas Jakarta (ThinkPad, Latitude, EliteBook). Bulk 10+ unit, pickup gratis Jabodetabek, data wipe bersertifikat, invoice corporate. Chat WA!",
  ogTitle: "Jual Laptop Kantor Bekas — Bulk Corporate Disposal | Jakarta Laptops",
  ogDescription:
    "Bulk acquisition 10+ unit. Pickup gratis, data wipe bersertifikat, invoice corporate.",
};
