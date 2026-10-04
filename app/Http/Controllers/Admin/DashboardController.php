<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\Submission;
use App\Models\Transaction;
use Illuminate\Contracts\View\View;

class DashboardController extends Controller
{
    public function __invoke(): View
    {
        return view('admin.dashboard', [
            'submissionCount' => Submission::query()->count(),
            'inventoryCount' => InventoryItem::query()->where('status', 'available')->count(),
            'soldCount' => InventoryItem::query()->where('status', 'sold')->count(),
            'revenue' => (int) Transaction::query()->where('status', 'completed')->sum('total'),
        ]);
    }
}
