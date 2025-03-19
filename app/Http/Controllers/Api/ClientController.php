<?php

namespace App\Http\Controllers\Api;

use OpenApi\Annotations as OA;
use App\Models\Client;
use App\Models\Tag;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

/**
 * @OA\Tag(
 *     name="Клиенты",
 *     description="API Endpoints для работы с клиентами"
 * )
 */
class ClientController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/clients",
     *     summary="Получить список клиентов",
     *     tags={"Клиенты"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Поиск по имени, email, телефону или компании",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="tag",
     *         in="query",
     *         description="Фильтр по ID тега",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="email", type="string"),
     *                 @OA\Property(property="phone", type="string"),
     *                 @OA\Property(property="company", type="string"),
     *                 @OA\Property(property="notes", type="string"),
     *                 @OA\Property(property="tags", type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer"),
     *                         @OA\Property(property="name", type="string")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Неавторизован"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Client::query()
            ->with('tags');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        if ($request->has('tag')) {
            $query->whereHas('tags', function($q) use ($request) {
                $q->where('tags.id', $request->get('tag'));
            });
        }

        $clients = $query->latest()->get();

        return response()->json($clients);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/clients",
     *     summary="Создание клиента",
     *     tags={"Клиенты"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email"},
     *             @OA\Property(property="name", type="string", example="Петр Петров"),
     *             @OA\Property(property="email", type="string", format="email", example="petr@example.com"),
     *             @OA\Property(property="phone", type="string", example="+79991112233"),
     *             @OA\Property(property="company", type="string"),
     *             @OA\Property(property="notes", type="string"),
     *             @OA\Property(
     *                 property="tags",
     *                 type="array",
     *                 description="Массив ID тегов. Каждый ID должен быть положительным числом и существовать в базе данных.",
     *                 @OA\Items(type="integer", minimum=1)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Клиент создан",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="company", type="string"),
     *             @OA\Property(property="notes", type="string"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string")
     *             ))
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:clients,email',
                'phone' => 'nullable|string|max:20',
                'company' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
                'tags' => 'nullable|array',
                'tags.*' => 'integer|min:1|exists:tags,id',
            ]);

            $tags = $validated['tags'] ?? [];
            unset($validated['tags']);

            $client = Client::create($validated);
            
            if (!empty($tags)) {
                $client->tags()->sync($tags);
            }

            return response()->json($client->load('tags'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/clients/{client}",
     *     summary="Получить информацию о клиенте",
     *     tags={"Клиенты"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="client",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="company", type="string"),
     *             @OA\Property(property="notes", type="string"),
     *             @OA\Property(property="tags", type="array",
     *                 @OA\Items(type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string")
     *                 )
     *             ),
     *             @OA\Property(property="deals", type="array",
     *                 @OA\Items(type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="title", type="string"),
     *                     @OA\Property(property="amount", type="number", format="float"),
     *                     @OA\Property(property="status", type="string", enum={"new", "in_progress", "won", "lost"}),
     *                     @OA\Property(property="client_id", type="integer"),
     *                     @OA\Property(property="created_at", type="string", format="date-time"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Клиент не найден"
     *     )
     * )
     */
    public function show(Client $client)
    {
        return response()->json($client->load('tags', 'deals'));
    }

    /**
     * @OA\Put(
     *     path="/api/v1/clients/{client}",
     *     summary="Обновление данных клиента",
     *     tags={"Клиенты"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="client",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="company", type="string"),
     *             @OA\Property(property="notes", type="string"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="integer"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Клиент обновлен",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="company", type="string"),
     *             @OA\Property(property="notes", type="string"),
     *             @OA\Property(property="tags", type="array",
     *                 @OA\Items(type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Клиент не найден"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     )
     * )
     */
    public function update(Request $request, Client $client)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:clients,email,' . $client->id,
                'phone' => 'nullable|string|max:20',
                'company' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
                'tags' => 'nullable|array',
                'tags.*' => 'integer|min:1|exists:tags,id',
            ]);

            $tags = $validated['tags'] ?? [];
            unset($validated['tags']);

            $client->update($validated);
            $client->tags()->sync($tags);

            return response()->json($client->load('tags'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/clients/{client}",
     *     summary="Удалить клиента",
     *     tags={"Клиенты"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="client",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Клиент успешно удален",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Клиент не найден"
     *     )
     * )
     */
    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(['message' => 'Клиент успешно удален']);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/clients/export",
     *     summary="Экспорт клиентов",
     *     description="Возвращает PDF файл со списком всех клиентов",
     *     tags={"Клиенты"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="PDF-файл для скачивания",
     *         @OA\MediaType(
     *             mediaType="application/pdf",
     *             @OA\Schema(type="string", format="binary")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Неавторизован"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function clients_export()
    {
        try {
            $clients = Client::with('tags')->get();
            
            $pdf = Pdf::loadView('exports.clients', [
                'clients' => $clients
            ]);
    
            return $pdf->download('clients.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ошибка при создании PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/clients/widget",
     *     summary="Получить список клиентов для виджета",
     *     tags={"Клиенты"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="email",
     *         in="query",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="phone",
     *         in="query",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="email", type="string"),
     *                 @OA\Property(property="phone", type="string"),
     *                 @OA\Property(property="company", type="string")
     *             )
     *         )
     *     )
     * )
     */
    public function widget(Request $request)
    {
        $query = Client::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->get('name') . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->get('email') . '%');
        }

        if ($request->filled('phone')) {
            $query->where('phone', 'like', '%' . $request->get('phone') . '%');
        }

        $clients = $query->latest()->limit(10)->get();

        return response()->json($clients);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/clients/widget",
     *     summary="Создать клиента через виджет",
     *     tags={"Клиенты"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "phone"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="company", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Клиент успешно создан",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="company", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function widgetStore(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:clients,email',
                'phone' => 'required|string|max:20',
                'company' => 'nullable|string|max:255',
            ]);

            $client = Client::create($validated);

            return response()->json($client, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/v1/clients/{client}/tags",
     *     summary="Обновить теги клиента",
     *     tags={"Клиенты"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="client",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"tags"},
     *             @OA\Property(
     *                 property="tags",
     *                 type="array",
     *                 description="Массив ID тегов. Каждый ID должен быть положительным числом и существовать в базе данных.",
     *                 @OA\Items(type="integer", minimum=1)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Теги успешно обновлены",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="company", type="string"),
     *             @OA\Property(property="notes", type="string"),
     *             @OA\Property(property="tags", type="array",
     *                 @OA\Items(type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Клиент не найден"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function updateTags(Request $request, Client $client)
    {
        try {
            $validated = $request->validate([
                'tags' => 'required|array',
                'tags.*' => 'integer|min:1|exists:tags,id',
            ]);

            $client->tags()->sync($validated['tags']);
            
            return response()->json($client->load('tags'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        }
    }
} 