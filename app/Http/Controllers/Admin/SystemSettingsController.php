<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SystemSettingsController extends Controller
{
    public function index()
    {
        return inertia('Admin/Settings/Index');
    }
} 