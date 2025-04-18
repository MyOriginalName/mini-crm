@extends('layouts.admin')

@section('content')
    <h1>Role: {{ $role->name }}</h1>
    <p>Permissions:</p>
    <ul>
        @foreach ($role->permissions as $permission)
            <li>{{ $permission->name }}</li>
        @endforeach
    </ul>
@endsection
