<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TinkoffApiService
{
    protected $apiToken;

    public function __construct()
    {
        $this->apiToken = env('TINKOFF_API_TOKEN'); // Токен будет храниться в .env файле
    }

    public function getMarketIndex()
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiToken,
            ])->get('https://api.tinkoff.ru/trading-api/v1/market/stocks');

            if ($response->successful()) {
                return $response->json(); // Возвращаем JSON с данными
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }
}
