import AdminLayout from 'Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from 'Components/ui/card';
import { Button } from 'Components/ui/button';
import { router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Show({ role, permissions }) {
    return (
        <AdminLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('admin.roles.index'))}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Назад
                        </Button>
                        <h2 className="text-2xl font-semibold">Информация о роли</h2>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Детали роли</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Имя</h3>
                                    <p className="mt-1 text-lg">{role.name}</p>
                                </div>

                                {role.russian_name && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Альтернативное название</h3>
                                        <p className="mt-1 text-lg">{role.russian_name}</p>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Разрешения</h3>
                                    <ul className="mt-1 list-disc list-inside">
                                        {role.permissions.map((permission) => (
                                            <li key={permission.id}>{permission.name}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <Button
                                        onClick={() => router.visit(route('admin.roles.edit', role.id))}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (confirm('Вы уверены, что хотите удалить эту роль? Это действие нельзя отменить.')) {
                                                router.delete(route('admin.roles.destroy', role.id));
                                            }
                                        }}
                                    >
                                        Удалить
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
