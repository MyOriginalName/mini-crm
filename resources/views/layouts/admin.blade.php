<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Layout</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <header>
        <h1>Admin Panel</h1>
        <nav>
            <a href="{{ route('admin.roles.index') }}">Roles</a>
            <!-- Add other admin links here -->
        </nav>
    </header>
    <main>
        @yield('content')
    </main>
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
