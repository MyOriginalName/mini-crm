import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { Shield, Users, Key } from 'lucide-react';

export default function Index({ auth, roles }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Роли</h2>}
        >
            <Head title="Роли" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Управление ролями</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Здесь вы можете просматривать и редактировать роли пользователей. Каждая роль имеет свой набор разрешений.
                                </p>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Название
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Количество разрешений
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Разрешения
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Действия
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {roles.map((role) => (
                                            <tr key={role.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100">
                                                            <Shield className="h-5 w-5 text-indigo-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {role.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {role.name === 'admin' ? 'Администратор системы' : 
                                                                 role.name === 'manager' ? 'Менеджер' : 
                                                                 role.name === 'user' ? 'Пользователь' : 'Пользовательская роль'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {role.permissions.length}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="flex flex-wrap gap-1">
                                                            {role.permissions.slice(0, 3).map(permission => (
                                                                <span key={permission.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                    {permission.name}
                                                                </span>
                                                            ))}
                                                            {role.permissions.length > 3 && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                    +{role.permissions.length - 3} еще
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('admin.roles.show', role.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Редактировать
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Информация о ролях</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-red-100">
                                            <Shield className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h5 className="text-sm font-medium text-gray-900">Администратор</h5>
                                            <p className="text-xs text-gray-500">Полный доступ ко всем функциям системы</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                                            <Users className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h5 className="text-sm font-medium text-gray-900">Менеджер</h5>
                                            <p className="text-xs text-gray-500">Управление клиентами, сделками и задачами</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
                                            <Key className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h5 className="text-sm font-medium text-gray-900">Пользователь</h5>
                                            <p className="text-xs text-gray-500">Базовый доступ к системе</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 