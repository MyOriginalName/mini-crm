<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TinkoffApiService
{
    protected string $apiUrl;
    protected string $token;

    public function __construct()
    {
        $this->apiUrl = config('services.tinkoff.api_url', 'https://api-invest.tinkoff.ru/openapi');
        $this->token = config('services.tinkoff.token', '');
    }

    public function getStocks()
    {
        $url = "{$this->apiUrl}/market/stocks";

        Log::info("Tinkoff API Request", ['url' => $url]);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->withoutVerifying()
          ->get($url);

        Log::info("Tinkoff API Response", [
            'status' => $response->status(),
            'body' => $response->json(),
        ]);

        if ($response->failed()) {
            Log::error("Tinkoff API Error", [
                'url' => $url,
                'status' => $response->status(),
                'error' => $response->body(),
            ]);
            return null;
        }

        $data = $response->json();
        Log::info('Ответ API', ['data' => $data]);
        return $data;
    }
}
