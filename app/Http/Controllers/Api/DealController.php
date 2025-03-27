<?php

namespace App\Http\Controllers\Api;

use OpenApi\Annotations as OA;
use App\Models\Deal;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(
 *     name="Сделки",
 *     description="API Endpoints для работы со сделками"
 * )
 */
class DealController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/deals",
     *     operationId="getDealsList",
     *     summary="Получить список сделок",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Поиск по названию или описанию",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Фильтр по статусу",
     *         required=false,
     *         @OA\Schema(type="string", enum={"suspended", "in_progress", "won", "lost"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Deal")),
     *             @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Доступ запрещен"
     *     )
     * )
     */
    public function index(Request $request)
    {
        if (!auth()->user()->hasAnyPermission(['view deals', 'view own deals'])) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $query = Deal::with('client');

        if (!auth()->user()->hasPermissionTo('view deals') && 
            auth()->user()->hasPermissionTo('view own deals')) {
            $query->where('user_id', auth()->id());
        }

        // Фильтрация по статусу
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Поиск по названию или клиенту
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('client', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        return response()->json($query->paginate(10));
    }

    /**
     * @OA\Post(
     *     path="/api/v1/deals",
     *     operationId="storeDeal",
     *     summary="Создание новой сделки",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(ref="#/components/requestBodies/DealStore"),
     *     @OA\Response(
     *         response=201,
     *         description="Сделка создана",
     *         @OA\JsonContent(ref="#/components/schemas/Deal")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Доступ запрещен"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     )
     * )
     */
    public function store(Request $request)
    {
        if (!auth()->user()->can('create deals')) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'client_id' => 'required|exists:clients,id',
            'value' => 'required|numeric|min:0',
            'status' => 'required|in:suspended,in_progress,won,lost',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $data['user_id'] = auth()->id();

        $deal = Deal::create($data);
        return response()->json($deal->load('client'), 201);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/deals/{deal}",
     *     operationId="showDeal",
     *     summary="Получить информацию о сделке",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(ref="#/components/parameters/DealId"),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(ref="#/components/schemas/Deal")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Доступ запрещен"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Сделка не найдена"
     *     )
     * )
     */
    public function show(Deal $deal)
    {
        if (!$this->canViewDeal($deal)) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        return response()->json($deal->load('client'));
    }

    /**
     * @OA\Put(
     *     path="/api/v1/deals/{deal}",
     *     operationId="updateDeal",
     *     summary="Обновление данных сделки",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(ref="#/components/parameters/DealId"),
     *     @OA\RequestBody(ref="#/components/requestBodies/DealUpdate"),
     *     @OA\Response(
     *         response=200,
     *         description="Сделка обновлена",
     *         @OA\JsonContent(ref="#/components/schemas/Deal")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Доступ запрещен"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Сделка не найдена"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     )
     * )
     */
    public function update(Request $request, Deal $deal)
    {
        if (!$this->canEditDeal($deal)) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'client_id' => 'sometimes|exists:clients,id',
            'value' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:suspended,in_progress,won,lost',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $deal->update($request->all());
        return response()->json($deal->load('client'));
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/deals/{deal}",
     *     operationId="deleteDeal",
     *     summary="Удаление сделки",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(ref="#/components/parameters/DealId"),
     *     @OA\Response(
     *         response=204,
     *         description="Сделка удалена"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Доступ запрещен"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Сделка не найдена"
     *     )
     * )
     */
    public function destroy(Deal $deal)
    {
        if (!auth()->user()->can('delete deals')) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $deal->delete();
        return response()->json(null, 204);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/deals/{deal}/status",
     *     operationId="updateDealStatus",
     *     summary="Обновление статуса сделки",
     *     tags={"Сделки"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(ref="#/components/parameters/DealId"),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 enum={"suspended", "in_progress", "won", "lost"}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Статус обновлен",
     *         @OA\JsonContent(ref="#/components/schemas/Deal")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Доступ запрещен"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Сделка не найдена"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     )
     * )
     */
    public function updateStatus(Request $request, Deal $deal)
    {
        if (!$this->canEditDeal($deal)) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:suspended,in_progress,won,lost'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $deal->update(['status' => $request->status]);
        return response()->json($deal->load('client'));
    }

    protected function canViewDeal(Deal $deal): bool
    {
        if (auth()->user()->can('view deals')) {
            return true;
        }

        return auth()->user()->can('view own deals') && $deal->user_id === auth()->id();
    }

    protected function canEditDeal(Deal $deal): bool
    {
        if (auth()->user()->can('edit deals')) {
            return true;
        }

        return auth()->user()->can('edit own deals') && $deal->user_id === auth()->id();
    }
} 