import AdminLayout from '@/Layouts/AdminLayout';

export default function Index() {
    return (
        <AdminLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-4">Настройки системы</h1>
                            {/* Здесь будет содержимое страницы */}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 