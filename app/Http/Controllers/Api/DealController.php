<?php

namespace App\Http\Controllers\Api;

use OpenApi\Annotations as OA;
use App\Models\Deal;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Сделки",
 *     description="API Endpoints для работы со сделками"
 * )
 */
class DealController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/deals",
     *     operationId="getDealsList",
     *     summary="Получить список сделок",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="client_id",
     *         in="query",
     *         description="Фильтр по ID клиента",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Фильтр по статусу сделки",
     *         required=false,
     *         @OA\Schema(type="string", enum={"new", "in_progress", "won", "lost"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="title", type="string"),
     *                 @OA\Property(property="amount", type="number", format="float"),
     *                 @OA\Property(property="status", type="string", enum={"new", "in_progress", "won", "lost"}),
     *                 @OA\Property(property="client_id", type="integer"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time"),
     *                 @OA\Property(
     *                     property="client",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="email", type="string"),
     *                     @OA\Property(property="phone", type="string"),
     *                     @OA\Property(property="company", type="string")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Неавторизован",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Deal::query()->with('client');

        if ($request->has('client_id')) {
            $query->where('client_id', $request->get('client_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $deals = $query->latest()->get();

        return response()->json($deals);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/deals",
     *     operationId="storeDeal",
     *     summary="Создание новой сделки",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "client_id", "amount", "status"},
     *             @OA\Property(
     *                 property="title",
     *                 type="string",
     *                 example="Новая сделка с компанией XYZ",
     *                 description="Название сделки"
     *             ),
     *             @OA\Property(
     *                 property="client_id",
     *                 type="integer",
     *                 example=1,
     *                 description="ID клиента"
     *             ),
     *             @OA\Property(
     *                 property="amount",
     *                 type="number",
     *                 format="float",
     *                 example=1500.50,
     *                 description="Сумма сделки"
     *             ),
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 enum={"new", "in_progress", "won", "lost"},
     *                 example="new",
     *                 description="Статус сделки"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Сделка успешно создана",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="title", type="string", example="Новая сделка с компанией XYZ"),
     *             @OA\Property(property="amount", type="number", format="float", example=1500.50),
     *             @OA\Property(property="status", type="string", example="new"),
     *             @OA\Property(property="client_id", type="integer", example=1),
     *             @OA\Property(property="created_at", type="string", format="date-time"),
     *             @OA\Property(property="updated_at", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка валидации"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="title", type="array", @OA\Items(type="string", example="Поле title обязательно для заполнения")),
     *                 @OA\Property(property="client_id", type="array", @OA\Items(type="string", example="Указанный client_id не существует")),
     *                 @OA\Property(property="amount", type="array", @OA\Items(type="string", example="Сумма должна быть больше 0")),
     *                 @OA\Property(property="status", type="array", @OA\Items(type="string", example="Недопустимый статус"))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Неавторизован",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'client_id' => 'required|integer|exists:clients,id',
                'amount' => 'required|numeric|min:0',
                'status' => 'required|string|in:new,in_progress,won,lost',
            ]);

            $deal = Deal::create($validated);

            return response()->json($deal, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/deals/{deal}",
     *     operationId="showDeal",
     *     summary="Получить информацию о сделке",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="deal",
     *         in="path",
     *         required=true,
     *         description="ID сделки",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="title", type="string", example="Новая сделка с компанией XYZ"),
     *             @OA\Property(property="amount", type="number", format="float", example=1500.50),
     *             @OA\Property(property="status", type="string", example="new", enum={"new", "in_progress", "won", "lost"}),
     *             @OA\Property(property="client_id", type="integer", example=1),
     *             @OA\Property(property="created_at", type="string", format="date-time"),
     *             @OA\Property(property="updated_at", type="string", format="date-time"),
     *             @OA\Property(
     *                 property="client",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Иван Иванов"),
     *                 @OA\Property(property="email", type="string", example="ivan@example.com"),
     *                 @OA\Property(property="phone", type="string", example="+79991234567"),
     *                 @OA\Property(property="company", type="string", example="ООО Рога и Копыта")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Сделка не найдена",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No query results for model [App\\Models\\Deal] 1")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Неавторизован",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function show(Deal $deal)
    {
        return response()->json($deal->load('client'));
    }

    /**
     * @OA\Put(
     *     path="/api/v1/deals/{deal}",
     *     operationId="updateDeal",
     *     summary="Обновление данных сделки",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="deal",
     *         in="path",
     *         required=true,
     *         description="ID сделки",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "client_id", "amount", "status"},
     *             @OA\Property(
     *                 property="title",
     *                 type="string",
     *                 example="Обновленная сделка с компанией XYZ",
     *                 description="Название сделки"
     *             ),
     *             @OA\Property(
     *                 property="client_id",
     *                 type="integer",
     *                 example=1,
     *                 description="ID клиента"
     *             ),
     *             @OA\Property(
     *                 property="amount",
     *                 type="number",
     *                 format="float",
     *                 example=2000.75,
     *                 description="Сумма сделки"
     *             ),
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 enum={"new", "in_progress", "won", "lost"},
     *                 example="in_progress",
     *                 description="Статус сделки"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Сделка успешно обновлена",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="title", type="string", example="Обновленная сделка с компанией XYZ"),
     *             @OA\Property(property="amount", type="number", format="float", example=2000.75),
     *             @OA\Property(property="status", type="string", example="in_progress"),
     *             @OA\Property(property="client_id", type="integer", example=1),
     *             @OA\Property(property="created_at", type="string", format="date-time"),
     *             @OA\Property(property="updated_at", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Сделка не найдена",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No query results for model [App\\Models\\Deal] 1")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка валидации"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="title", type="array", @OA\Items(type="string", example="Поле title обязательно для заполнения")),
     *                 @OA\Property(property="client_id", type="array", @OA\Items(type="string", example="Указанный client_id не существует")),
     *                 @OA\Property(property="amount", type="array", @OA\Items(type="string", example="Сумма должна быть больше 0")),
     *                 @OA\Property(property="status", type="array", @OA\Items(type="string", example="Недопустимый статус"))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Неавторизован",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function update(Request $request, Deal $deal)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'client_id' => 'required|integer|exists:clients,id',
                'amount' => 'required|numeric|min:0',
                'status' => 'required|string|in:new,in_progress,won,lost',
            ]);

            $deal->update($validated);

            return response()->json($deal);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/deals/{deal}",
     *     operationId="deleteDeal",
     *     summary="Удаление сделки",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="deal",
     *         in="path",
     *         required=true,
     *         description="ID сделки",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Сделка успешно удалена",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Сделка успешно удалена")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Сделка не найдена",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No query results for model [App\\Models\\Deal] 1")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Неавторизован",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function destroy(Deal $deal)
    {
        $deal->delete();
        return response()->json(['message' => 'Сделка успешно удалена']);
    }
} 