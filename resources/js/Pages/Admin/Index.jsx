import AdminLayout from '@/Layouts/AdminLayout';

export default function Index() {
    return (
        <AdminLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-4">Панель администратора</h1>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-lg font-medium mb-2">Пользователи</h2>
                                    <p className="text-gray-600">Управление пользователями системы</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-lg font-medium mb-2">Логи</h2>
                                    <p className="text-gray-600">Просмотр системных логов</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-lg font-medium mb-2">Настройки</h2>
                                    <p className="text-gray-600">Настройки системы</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 