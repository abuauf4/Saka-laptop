<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LeadCaptureController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'whatsapp' => ['required', 'string', 'max:30'],
            'device_name' => ['required', 'string', 'max:180'],
            'brand' => ['nullable', 'string', 'max:100'],
            'specifications' => ['nullable', 'string', 'max:1000'],
            'condition' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'source' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'max:0'],
        ]);

        unset($data['website']);

        $data['whatsapp'] = Lead::normalizeWhatsapp($data['whatsapp']);

        if (! preg_match('/^62\d{8,13}$/', $data['whatsapp'])) {
            throw ValidationException::withMessages([
                'whatsapp' => 'Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx atau 62xxxxxxxxxx.',
            ]);
        }

        $lead = Lead::query()->create([
            ...$data,
            'source' => $data['source'] ?? $request->headers->get('referer'),
            'status' => 'new',
        ]);

        $settings = Setting::singleton();
        $businessWhatsapp = Lead::normalizeWhatsapp($settings->whatsapp);

        if ($businessWhatsapp === '') {
            return back()->with('lead_sent', true);
        }

        $message = collect([
            'Halo '.$settings->site_name.', saya '.$lead->name.'.',
            'Saya baru mengirim pengajuan laptop melalui website.',
            '',
            'Perangkat: '.$lead->device_name,
            $lead->brand ? 'Brand: '.$lead->brand : null,
            $lead->specifications ? 'Spesifikasi: '.$lead->specifications : null,
            $lead->condition ? 'Kondisi: '.$lead->condition : null,
            $lead->notes ? 'Catatan: '.$lead->notes : null,
            '',
            'Mohon dibantu review dan penawarannya. Terima kasih.',
        ])->filter(fn ($line) => $line !== null)->implode("\n");

        return redirect()->away(
            'https://wa.me/'.$businessWhatsapp.'?text='.rawurlencode($message)
        );
    }
}
