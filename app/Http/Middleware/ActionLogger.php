<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Log;

class ActionLogger
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($request->isMethod('post') || $request->isMethod('put') || $request->isMethod('delete')) {
            $entityId = $request->route('id') ?? ($response->getData(true)['id'] ?? null);

            if ($entityId) {
                Log::create([
                    'user_id' => auth()->id(),
                    'action' => strtoupper($request->method()),
                    'entity_type' => $request->segment(3),
                    'entity_id' => $entityId,
                    'description' => 'User ' . auth()->id() . ' performed ' . strtoupper($request->method()) . ' on ' . $request->segment(3) . ' ' . $entityId,
                    'new_values' => json_encode($request->all()),
                ]);
            }
        }

        return $response;
    }
}
