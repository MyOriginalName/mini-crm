<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Route;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create()
    {
        return inertia('Auth/Login', [
            'canResetPassword' => route('password.request') ? true : false,
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        // Аутентификация пользователя
        $request->authenticate();

        // Регенерация сессии для предотвращения фиксации сессии
        $request->session()->regenerate();

        // Получаем аутентифицированного пользователя
        $user = $request->user();

        // Удаляем все предыдущие токены, чтобы избежать конфликтов
        $user->tokens()->delete();

        // Создаем новый токен Sanctum для API-авторизации
        $token = $user->createToken('api-token')->plainTextToken;

        // Возвращаем Inertia-совместимый ответ с перенаправлением на главную страницу
        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
