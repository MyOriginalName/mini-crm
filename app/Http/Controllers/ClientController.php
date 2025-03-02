<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ClientsExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Collection;

class ClientController extends Controller
{
    // Получить список всех клиентов
    public function index(Request $request)
    {
        $query = Client::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', $request->email);
        }

        if ($request->filled('phone')) {
            $query->where('phone', 'like', '%' . $request->phone . '%');
        }

        return response()->json($query->get());
    }



    // Создать нового клиента
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
        ]);

        $client = Client::create($validated);

        return response()->json($client, 201);
    }

    // Получить данные конкретного клиента
    public function show(Client $client)
    {
        return response()->json($client);
    }

    // Обновить информацию о клиенте
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:clients,email,' . $client->id,
            'phone' => 'sometimes|string|max:20',
        ]);

        $client->update($validated);

        return response()->json($client);
    }

    // Удалить клиента
    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // Экспорт клиентов
    public function clients_export()
    {
        $clients = Client::all();
        $pdf = Pdf::loadView('clients', compact('clients'))->setPaper('a4', 'portrait')->setOptions([
            'defaultFont' => 'DejaVu Sans'
        ]);


        return $pdf->download('clients.pdf');
    }

}
