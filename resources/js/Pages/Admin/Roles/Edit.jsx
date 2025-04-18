import { useState } from 'react';
import AdminLayout from 'Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from 'Components/ui/card';
import { Button } from 'Components/ui/button';
import { router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Edit({ role, permissions }) {
    const [formData, setFormData] = useState({
        name: role.name || '',
        permissions: role.permissions ? role.permissions.map(p => p.id) : [],
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'permissions') {
            let newPermissions = [...formData.permissions];
            const val = parseInt(value);
            if (checked) {
                if (!newPermissions.includes(val)) {
                    newPermissions.push(val);
                }
            } else {
                newPermissions = newPermissions.filter(p => p !== val);
            }
            setFormData({ ...formData, permissions: newPermissions });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('admin.roles.update', role.id), formData);
    };

    return (
        <AdminLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('admin.roles.show', role.id))}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Назад
                        </Button>
                        <h2 className="text-2xl font-semibold">Редактирование роли</h2>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Детали роли</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Имя роли
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Разрешения
                                    </label>
                                    <div className="max-h-48 overflow-y-auto border rounded p-2">
                                        {permissions.map(permission => (
                                            <label key={permission.id} className="flex items-center mb-1">
                                                <input
                                                    type="checkbox"
                                                    name="permissions"
                                                    value={permission.id}
                                                    checked={formData.permissions.includes(permission.id)}
                                                    onChange={handleChange}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">{permission.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit(route('admin.roles.show', role.id))}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="default"
                                    >
                                        Сохранить
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
