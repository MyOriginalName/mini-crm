# Mini CRM

CRM-система для управления клиентами, сделками и задачами с разграничением ролей.

## Стек

**Backend:** Laravel 11, PHP 8.2, MySQL/SQLite  
**Frontend:** React 18, Inertia.js 2, Tailwind CSS 4, Radix UI, Recharts  
**API:** REST (Sanctum-аутентификация)  
**Infrastructure:** RoadRunner, Swagger/OpenAPI (l5-swagger)

## Архитектура

### Модели и связи

- **User** — пользователь с ролями (Spatie Permission), связан с клиентами, сделками, задачами
- **Client** — компания/контакт (soft-delete), тегируется (belongsToMany Tag)
- **Deal** — сделка с воронкой статусов (in_progress → won/lost), soft-delete
- **Task** — задача с приоритетами, связана с User/Client/Deal, soft-delete
- **Log** — аудит действий (трейт `Loggable`)
- **Tag** — теги для клиентов

### Роли

`admin` — полный доступ, включая управление пользователями, ролями и логами  
`manager` — управление клиентами, сделками, задачами  
`user` — ограниченный доступ

### Маршруты

| Тип | Префикс | Аутентификация |
|-----|---------|----------------|
| Web SPA | `/dashboard`, `/clients`, `/deals`, `/tasks`, `/admin/*` | session + verified |
| API | `/api/v1/*` | Sanctum (Bearer) |

### API Endpoints

```
POST   /api/v1/register
POST   /api/v1/login
POST   /api/v1/logout
GET    /api/v1/user

GET    /api/v1/clients          POST   /api/v1/clients
GET    /api/v1/clients/{id}     PUT    /api/v1/clients/{id}
DELETE /api/v1/clients/{id}     PUT    /api/v1/clients/{id}/tags
GET    /api/v1/clients/export   GET    /api/v1/clients/widget

GET    /api/v1/tasks            POST   /api/v1/tasks
GET    /api/v1/tasks/{id}       PUT    /api/v1/tasks/{id}
DELETE /api/v1/tasks/{id}

GET    /api/v1/deals            POST   /api/v1/deals
GET    /api/v1/deals/{id}       PUT    /api/v1/deals/{id}
DELETE /api/v1/deals/{id}       PUT    /api/v1/deals/{id}/status
```

## Установка

```bash
git clone <repo>
cd mini-crm
cp .env.example .env
php artisan key:generate
composer install
npm install
npm run build
php artisan migrate --seed
php artisan serve
```

## Тестовые аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | admin@demo.com | admin123 |
| Manager | manager@demo.com | manager123 |
| User | user@demo.com | user123 |

## Тестирование

```bash
php artisan test
```

Тесты используют in-memory SQLite. Параметры окружения заданы в `phpunit.xml`.
