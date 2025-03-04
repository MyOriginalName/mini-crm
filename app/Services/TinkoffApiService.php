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
        $this->apiUrl = config('services.tinkoff.api_url'); // Загружаем URL API из конфига
        $this->token = config('services.tinkoff.token'); // Загружаем API-ключ
    }

    /**
     * Запрос списка акций
     */
    public function getStocks()
    {
        $url = "{$this->apiUrl}/market/stocks";

        Log::info("Tinkoff API Request", ['url' => $url]); // Логируем URL

    $response = Http::withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
        'Accept' => 'application/json',
    ])->withoutVerifying() // Отключаем проверку SSL
      ->get($this->apiUrl);

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
        }
Log::info('Ответ API', $data); // Логируем, что пришло
return $data;
        return $response->json();
    }
}
