<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Логи пользователя {{ $user->name }}
            </h2>
            <a
                href="{{ route('users.index') }}"
                class="text-indigo-600 hover:text-indigo-900"
            >
                Назад к списку
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                <div class="space-y-4">
                    @foreach($logs as $log)
                        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div class="flex-1">
                                <div class="text-sm text-gray-900">
                                    {{ $log->action }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ $log->created_at->format('d.m.Y H:i:s') }}
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

                <!-- Пагинация -->
                <div class="mt-4">
                    {{ $logs->links() }}
                </div>
            </div>
        </div>
    </div>
</x-app-layout> 