import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Show({ user }) {
    return (
        <AdminLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('admin.users.index'))}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Назад
                        </Button>
                        <h2 className="text-2xl font-semibold">Информация о пользователе</h2>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Детали пользователя</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Имя</h3>
                                    <p className="mt-1 text-lg">{user.name}</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                    <p className="mt-1 text-lg">{user.email}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Роли</h3>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {user.roles.map((role) => (
                                            <span
                                                key={role.id}
                                                className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                            >
                                                {role.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        onClick={() => router.visit(route('admin.users.edit', user.id))}
                                    >
                                        Редактировать
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
} 