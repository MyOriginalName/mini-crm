import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Logs({ auth, user, logs }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleString('ru-RU');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Логи пользователя {user.name}
                    </h2>
                    <Link
                        href={route('users.index')}
                        className="text-indigo-600 hover:text-indigo-900"
                    >
                        Назад к списку
                    </Link>
                </div>
            }
        >
            <Head title={`Логи пользователя ${user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <div className="space-y-4">
                            {logs.data.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-900">
                                            {log.action}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(log.created_at)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Пагинация */}
                        <div className="mt-4">
                            <Pagination links={logs.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 