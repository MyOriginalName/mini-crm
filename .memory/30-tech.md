# Technology Landscape: Mini-CRM

## Technology Stack
- Backend: PHP 8.2, Laravel 11.x
- Frontend: JavaScript, Vue.js, Tailwind CSS
- Database: MySQL 8.0
- Cache: Redis
- Queue: Laravel Queue
- Testing: PHPUnit, Laravel Dusk

## Development Environment
- IDE: VS Code
- Version Control: Git
- Package Manager: Composer, NPM
- Local Server: Laravel Sail
- Code Style: PSR-12

## Dependencies
### Backend
- laravel/framework: ^11.0
- laravel/sanctum: ^4.0
- laravel/tinker: ^2.8
- spatie/laravel-permission: ^6.0

### Frontend
- vue: ^3.4
- tailwindcss: ^3.4
- @headlessui/vue: ^1.7
- @heroicons/vue: ^2.1

## Build & Deployment
- CI/CD: GitHub Actions
- Deployment: Docker
- Environment: Production, Staging, Development
- Monitoring: Laravel Telescope

## Environment Configuration
- .env для конфигурации
- Многопользовательский режим
- Разные настройки для разных окружений
- Безопасное хранение секретов

## Tool Chain
- Git для версионирования
- Composer для PHP пакетов
- NPM для JavaScript пакетов
- Docker для контейнеризации
- PHPUnit для тестирования
- ESLint для JavaScript
- Prettier для форматирования 