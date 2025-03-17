<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Mini CRM API Documentation",
 *     description="API документация для Mini CRM системы",
 *     @OA\Contact(
 *         email="admin@example.com"
 *     )
 * )
 */
class DealController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/deals",
     *     summary="Получить список сделок",
     *     tags={"Сделки"},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Поиск по названию или клиенту",
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
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="value", type="number"),
     *                     @OA\Property(property="status", type="string"),
     *                     @OA\Property(property="description", type="string"),
     *                     @OA\Property(property="client", type="object",
     *                         @OA\Property(property="id", type="integer"),
     *                         @OA\Property(property="name", type="string")
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Deal::with('client');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $deals = $query->paginate(10)
            ->withQueryString();

        $dealsByStatus = Deal::selectRaw('status, COUNT(*) as count, SUM(value) as total_value')
            ->groupBy('status')
            ->get();

        return Inertia::render('Deals/Index', [
            'deals' => $deals,
            'filters' => $request->only(['search', 'status']),
            'statistics' => $dealsByStatus,
            'clients' => Client::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/deals",
     *     summary="Создать новую сделку",
     *     tags={"Сделки"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"client_id", "name", "value", "status"},
     *             @OA\Property(property="client_id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="value", type="number"),
     *             @OA\Property(property="status", type="string", enum={"suspended", "in_progress", "won", "lost"}),
     *             @OA\Property(property="description", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Сделка успешно создана"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'value' => 'required|numeric|min:0',
            'status' => 'required|in:suspended,in_progress,won,lost',
            'description' => 'nullable|string',
        ]);

        Deal::create($validated);

        return redirect()->back()
            ->with('message', 'Сделка успешно создана');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/deals/{deal}",
     *     summary="Получить информацию о сделке",
     *     tags={"Сделки"},
     *     @OA\Parameter(
     *         name="deal",
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
     *             @OA\Property(property="value", type="number"),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="client", type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Сделка не найдена"
     *     )
     * )
     */
    public function show(Deal $deal)
    {
        return Inertia::render('Deals/Show', [
            'deal' => $deal->load('client'),
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/deals/{deal}",
     *     summary="Обновить сделку",
     *     tags={"Сделки"},
     *     @OA\Parameter(
     *         name="deal",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "value", "status"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="value", type="number"),
     *             @OA\Property(property="status", type="string", enum={"suspended", "in_progress", "won", "lost"}),
     *             @OA\Property(property="description", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Сделка успешно обновлена"
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'required|numeric|min:0',
            'status' => 'required|in:suspended,in_progress,won,lost',
            'description' => 'nullable|string',
        ]);

        $deal->update($validated);

        return redirect()->back()
            ->with('message', 'Сделка успешно обновлена');
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/deals/{deal}",
     *     summary="Удалить сделку",
     *     tags={"Сделки"},
     *     @OA\Parameter(
     *         name="deal",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Сделка успешно удалена"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Сделка не найдена"
     *     )
     * )
     */
    public function destroy(Deal $deal)
    {
        $deal->delete();

        return redirect()->route('deals.index')
            ->with('message', 'Сделка успешно удалена');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/deals/kanban",
     *     summary="Получить сделки в формате канбан",
     *     tags={"Сделки"},
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="suspended", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="in_progress", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="won", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="lost", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function kanban()
    {
        $deals = Deal::with('client')
            ->get()
            ->groupBy('status');

        return Inertia::render('Deals/Kanban', [
            'deals' => $deals,
        ]);
    }

    /**
     * @OA\Patch(
     *     path="/api/v1/deals/{deal}/status",
     *     summary="Обновить статус сделки",
     *     tags={"Сделки"},
     *     @OA\Parameter(
     *         name="deal",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"suspended", "in_progress", "won", "lost"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Статус успешно обновлен"
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
        $validated = $request->validate([
            'status' => 'required|in:suspended,in_progress,won,lost',
        ]);

        $deal->update($validated);

        return response()->json($deal);
    }
} 