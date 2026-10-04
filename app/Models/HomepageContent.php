<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageContent extends Model
{
    protected $fillable = [
        'hero_eyebrow','hero_title','hero_subtitle','hero_image',
        'trust_stats','brand_title','brand_copy','brand_points',
        'workflow_stages','device_categories','faqs',
        'closing_title','closing_subtitle',
    ];

    protected function casts(): array
    {
        return [
            'trust_stats' => 'array',
            'brand_points' => 'array',
            'workflow_stages' => 'array',
            'device_categories' => 'array',
            'faqs' => 'array',
        ];
    }

    public static function singleton(): self
    {
        return static::query()->firstOrCreate(['id' => 1], [
            'hero_eyebrow' => 'Laptop Lamamu Masih Bernilai',
            'hero_title' => 'Jual Laptop Bekasmu Tanpa Ribet.',
            'hero_subtitle' => 'Kirim detail laptop dari rumah. Tim kami review kondisinya, lalu lanjutkan pengecekan untuk penawaran yang transparan.',
            'hero_image' => '/Hero.webp',
            'trust_stats' => [
                ['stat' => '12', 'label' => 'Titik QC', 'desc' => 'Pemeriksaan layar, keyboard, baterai, storage, port, konektivitas, fisik, dan fungsi penting lainnya.'],
                ['stat' => '30–60', 'label' => 'Menit Inspeksi', 'desc' => 'Pengecekan fisik dilakukan efisien setelah data awal perangkat kami terima.'],
                ['stat' => '100%', 'label' => 'Transparan', 'desc' => 'Penawaran disesuaikan dengan kondisi aktual perangkat, bukan angka asal.'],
            ],
            'brand_title' => 'Penilaian laptop yang jelas dari awal.',
            'brand_copy' => 'Kami fokus pada proses yang sederhana: data awal lengkap, inspeksi terstruktur, lalu penawaran berdasarkan kondisi perangkat.',
            'brand_points' => [
                ['title' => 'Transparan', 'desc' => 'Kondisi perangkat dibahas apa adanya dan menjadi dasar penawaran.'],
                ['title' => 'Praktis', 'desc' => 'Pengajuan awal bisa dilakukan dari HP tanpa harus langsung datang.'],
                ['title' => 'Responsif', 'desc' => 'Detail lead masuk langsung ke tim sehingga follow-up lebih cepat dan tidak tercecer.'],
            ],
            'workflow_stages' => [
                ['n' => '01', 'title' => 'Kirim detail laptop', 'desc' => 'Isi data singkat: model, spesifikasi, kondisi, dan nomor WhatsApp.'],
                ['n' => '02', 'title' => 'Review awal', 'desc' => 'Tim kami membaca data perangkat dan menghubungi kamu untuk klarifikasi bila diperlukan.'],
                ['n' => '03', 'title' => 'Pengecekan fisik', 'desc' => 'Perangkat diperiksa pada titik fungsi penting agar kondisinya jelas.'],
                ['n' => '04', 'title' => 'Penawaran', 'desc' => 'Nilai penawaran disampaikan berdasarkan hasil pengecekan aktual.'],
                ['n' => '05', 'title' => 'Deal atau tidak', 'desc' => 'Keputusan tetap di kamu. Tidak cocok, tidak ada kewajiban melanjutkan.'],
            ],
            'device_categories' => [
                ['label' => 'Laptop Kantor'],
                ['label' => 'Laptop Gaming'],
                ['label' => 'MacBook'],
                ['label' => 'Workstation'],
                ['label' => 'Komputer'],
                ['label' => 'Monitor'],
                ['label' => 'Aset IT Kantor'],
            ],
            'faqs' => [
                ['q' => 'Laptop rusak tetap diterima?', 'a' => 'Bisa. Kondisi minus tetap dapat diajukan. Nilainya akan menyesuaikan komponen yang masih berfungsi dan kondisi fisik perangkat.'],
                ['q' => 'Harus datang langsung?', 'a' => 'Tidak untuk tahap awal. Kamu bisa kirim detail perangkat melalui form. Pengecekan fisik dilakukan ketika proses dilanjutkan.'],
                ['q' => 'Berapa lama pengecekan?', 'a' => 'Untuk pemeriksaan fisik, umumnya sekitar 30–60 menit tergantung kondisi dan jenis perangkat.'],
                ['q' => 'Kalau harga tidak cocok?', 'a' => 'Tidak masalah. Penawaran tidak mengikat dan keputusan tetap di kamu.'],
                ['q' => 'Bagaimana dengan data pribadi?', 'a' => 'Backup data penting dan keluar dari akun pribadi sebelum menyerahkan perangkat. Proses sanitasi data disesuaikan dengan jenis media penyimpanan.'],
            ],
            'closing_title' => 'Punya laptop yang sudah tidak terpakai?',
            'closing_subtitle' => 'Kirim detailnya dulu. Tim kami akan review dan hubungi kamu lewat WhatsApp.',
        ]);
    }
}
