<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Log;
use Inertia\Inertia;

class LogController extends Controller
{
    public function index()
    {
        $logs = Log::with('user')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Logs/Index', [
            'logs' => $logs
        ]);
    }
} 