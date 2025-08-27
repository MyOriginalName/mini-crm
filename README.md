# mini-crm

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# CRM

Небольшая CRM-система, проект сочетает  backend на Laravel и frontend на React (через Inertia.js и TailwindCSS).

## Используемые технологии

### Backend
- **Laravel **
- **REST API** + **Swagger** (документация и тестирование API)
- **Spatie Laravel Permission** (роли и права пользователей)
- **Laravel Sanctum** (аутентификация API)

### Frontend
- **React + Inertia.js**
- **TailwindCSS**

## ⚙️ Основной функционал
- Регистрация и авторизация пользователей
- Управление ролями и правами (админ/пользователь)
- Клиенты: создание, редактирование, фильтрация, теги
- Логирование действий пользователей
- Swagger-документация для API
- Сделки: просмотр, редактирование, Kanban-доска (в процессе)
- Задачи: список, фильтры, статусы (в процессе)

## 📖 Документация
В папке `/docs` описана архитектура, структура базы данных, эндпоинты API и правила тестирования.

