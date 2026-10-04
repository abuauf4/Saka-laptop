<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class LeadController extends Controller
{
    public function index(Request $request): View
    {
        $query = Lead::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('q')) {
            $q = '%'.$request->string('q')->trim().'%';
            $query->where(function ($builder) use ($q): void {
                $builder->where('name', 'like', $q)
                    ->orWhere('whatsapp', 'like', $q)
                    ->orWhere('device_name', 'like', $q)
                    ->orWhere('brand', 'like', $q);
            });
        }

        return view('admin.leads.index', [
            'leads' => $query->paginate(30)->withQueryString(),
            'counts' => [
                'new' => Lead::query()->where('status', 'new')->count(),
                'contacted' => Lead::query()->where('status', 'contacted')->count(),
                'qualified' => Lead::query()->where('status', 'qualified')->count(),
                'closed' => Lead::query()->where('status', 'closed')->count(),
            ],
        ]);
    }

    public function show(Lead $lead): View
    {
        return view('admin.leads.show', compact('lead'));
    }

    public function update(Request $request, Lead $lead): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,contacted,qualified,closed'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        if ($data['status'] === 'contacted' && ! $lead->contacted_at) {
            $data['contacted_at'] = now();
        }

        $lead->update($data);

        return back()->with('status', 'Lead diperbarui.');
    }
}
