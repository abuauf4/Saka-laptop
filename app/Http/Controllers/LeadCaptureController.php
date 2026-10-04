<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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

        Lead::query()->create([
            ...$data,
            'source' => $data['source'] ?? $request->headers->get('referer'),
            'status' => 'new',
        ]);

        return back()->with('lead_sent', true);
    }
}
