<?php

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Mini CRM API",
 *     description="API для управления клиентами, задачами и сделками"
 * )
 */

/**
 * @OA\Server(
 *     url="http://127.0.0.1:8000/api/v1",
 *     description="API сервер"
 * )
 */

/**
 * @OA\SecurityScheme(
 *     type="http",
 *     description="Используйте токен в формате: Bearer <token>",
 *     name="Authorization",
 *     in="header",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     securityScheme="bearerAuth"
 * )
 */

/**
 * @OA\Schema(
 *     schema="Tag",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string")
 * )
 */

/**
 * @OA\Schema(
 *     schema="ClientSimple",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string"),
 *     @OA\Property(property="phone", type="string"),
 *     @OA\Property(property="company", type="string")
 * )
 */

/**
 * @OA\Schema(
 *     schema="ClientFull",
 *     allOf={
 *         @OA\Schema(ref="#/components/schemas/ClientSimple"),
 *         @OA\Schema(
 *             @OA\Property(property="notes", type="string"),
 *             @OA\Property(
 *                 property="tags",
 *                 type="array",
 *                 @OA\Items(ref="#/components/schemas/Tag")
 *             ),
 *             @OA\Property(
 *                 property="deals",
 *                 type="array",
 *                 @OA\Items(ref="#/components/schemas/Deal")
 *             )
 *         )
 *     }
 * )
 */

/**
 * @OA\Schema(
 *     schema="ClientUpdate",
 *     required={"name", "email"},
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string", format="email"),
 *     @OA\Property(property="phone", type="string"),
 *     @OA\Property(property="company", type="string"),
 *     @OA\Property(property="notes", type="string"),
 *     @OA\Property(
 *         property="tags",
 *         type="array",
 *         @OA\Items(type="integer")
 *     )
 * )
 */

/**
 * @OA\Schema(
 *     schema="Deal",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="amount", type="number", format="float"),
 *     @OA\Property(property="status", type="string", enum={"new", "in_progress", "won", "lost"}),
 *     @OA\Property(property="client_id", type="integer"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */ 