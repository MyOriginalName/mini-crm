import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function Edit({ user, roles, recentDeals, recentTasks, recentClients }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            roles: [Number(formData.get('roles'))]
        };

        router.put(route('admin.users.update', user.id), data, {
            onSuccess: () => {
                router.visit(route('admin.users.show', user.id));
            }
        });
    };

    return (
        <AdminLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('admin.users.show', user.id))}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Назад
                        </Button>
                        <h2 className="text-2xl font-semibold">Редактирование пользователя</h2>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Редактировать информацию</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Имя</label>
                                    <input
                                        id="name"
                                        name="name"
                                        defaultValue={user.name}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={user.email}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Роль</label>
                                    <div className="flex gap-4 mt-2">
                                        {roles.map((role) => (
                                            <div key={role.id} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    id={`role-${role.id}`}
                                                    name="roles"
                                                    value={role.id}
                                                    defaultChecked={user.roles.some(r => r.id === role.id)}
                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <label htmlFor={`role-${role.id}`} className="text-sm text-gray-700">{role.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit(route('admin.users.show', user.id))}
                                    >
                                        Отмена
                                    </Button>
                                    <Button type="submit">
                                        Сохранить
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Сделки */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Последние сделки</h3>
                            <div className="space-y-4">
                                {recentDeals?.map((deal) => (
                                    <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <h4 className="font-medium text-gray-900">{deal.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1">Сумма: {deal.amount} ₽</p>
                                            <p className="text-sm text-gray-500">Статус: {deal.status}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Card 
                                    className="hover:bg-gray-50 cursor-pointer transition-colors h-[120px] flex items-center justify-center"
                                    onClick={() => router.visit(route('deals.index', { user_id: user.id }))}
                                >
                                    <CardContent className="flex items-center justify-center p-4">
                                        <span className="text-gray-500 flex items-center">
                                            Посмотреть больше
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Задачи */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Последние задачи</h3>
                            <div className="space-y-4">
                                {recentTasks?.map((task) => (
                                    <Card key={task.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1">Срок: {task.due_date}</p>
                                            <p className="text-sm text-gray-500">Статус: {task.status}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Card 
                                    className="hover:bg-gray-50 cursor-pointer transition-colors h-[120px] flex items-center justify-center"
                                    onClick={() => router.visit(route('tasks.index', { user_id: user.id }))}
                                >
                                    <CardContent className="flex items-center justify-center p-4">
                                        <span className="text-gray-500 flex items-center">
                                            Посмотреть больше
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Клиенты */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Последние клиенты</h3>
                            <div className="space-y-4">
                                {recentClients?.map((client) => (
                                    <Card key={client.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <h4 className="font-medium text-gray-900">{client.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{client.company}</p>
                                            <p className="text-sm text-gray-500">{client.email}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Card 
                                    className="hover:bg-gray-50 cursor-pointer transition-colors h-[120px] flex items-center justify-center"
                                    onClick={() => router.visit(route('clients.index', { user_id: user.id }))}
                                >
                                    <CardContent className="flex items-center justify-center p-4">
                                        <span className="text-gray-500 flex items-center">
                                            Посмотреть больше
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 