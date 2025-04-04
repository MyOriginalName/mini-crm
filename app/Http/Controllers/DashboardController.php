<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $user->load('roles');

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user
            ]
        ]);
    }
} 