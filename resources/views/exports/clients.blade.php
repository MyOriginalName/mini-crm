<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Клиенты</title>
    <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Список клиентов</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Тип</th>
                <th>Статус</th>
                <th>Компания</th>
            </tr>
        </thead>
        <tbody>
            @foreach($clients as $client)
            <tr>
                <td>{{ $client->id }}</td>
                <td>{{ $client->name }}</td>
                <td>{{ $client->email }}</td>
                <td>{{ $client->phone }}</td>
                <td>{{ $client->type }}</td>
                <td>{{ $client->status }}</td>
                <td>{{ $client->company_name }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
