<!-- resources/views/stocks/index.blade.php -->
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Список акций</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        .alert {
            color: #b94a48;
            background-color: #f2dede;
            padding: 10px;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <h1>Список акций</h1>

    @if(isset($error))
        <div class="alert">{{ $error }}</div>
    @else
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Тикер</th>
                    <th>Название</th>
                </tr>
            </thead>
            <tbody>
                @foreach($stocks as $stock)
                    <tr>
                        <td>{{ $stock['id'] ?? '—' }}</td>
                        <td>{{ $stock['ticker'] ?? '—' }}</td>
                        <td>{{ $stock['name'] ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</body>
</html>
