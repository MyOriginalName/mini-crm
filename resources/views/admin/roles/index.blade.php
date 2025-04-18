@extends('layouts.admin')

@section('content')
    <h1>Roles</h1>
    <ul>
        @foreach ($roles as $role)
            <li><a href="{{ route('admin.roles.show', $role->id) }}">{{ $role->name }}</a></li>
        @endforeach
    </ul>
@endsection
