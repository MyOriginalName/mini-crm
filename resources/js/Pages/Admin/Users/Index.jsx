import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Eye, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Index({ users, roles }) {
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = (user) => {
        router.visit(route('admin.users.edit', user.id));
    };

    const handleView = (user) => {
        router.visit(route('admin.users.show', user.id));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            roles: Array.from(formData.getAll('roles')).map(Number)
        };

        router.put(route('admin.users.update', editingUser.id), data, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingUser(null);
            }
        });
    };

    return (
        <AdminLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Управление пользователями</h2>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Имя</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Роли</TableHead>
                                        <TableHead>Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleView(user)}
                                                    >
                                                        Посмотреть
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(user)}
                                                    >
                                                        Редактировать
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Пагинация */}
                            <div className="mt-6 flex justify-center">
                                <nav className="flex items-center gap-1" aria-label="Pagination">
                                    {users.links.map((link, key) => {
                                        // Пропускаем рендер текстовых "Previous" и "Next"
                                        if (link.label.includes('Previous')) {
                                            return (
                                                <Button
                                                    key={key}
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        if (link.label.includes('Next')) {
                                            return (
                                                <Button
                                                    key={key}
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        // Для цифр страниц
                                        return (
                                            <Button
                                                key={key}
                                                variant="ghost"
                                                size="sm"
                                                className={`h-8 w-8 p-0 ${
                                                    link.active
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                                onClick={() => link.url && router.visit(link.url)}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Модальное окно редактирования */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <form onSubmit={handleUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Редактирование пользователя
                    </h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Имя</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={editingUser?.name}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={editingUser?.email}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Роли</label>
                        <div className="mt-2 space-y-2">
                            {roles.map((role) => (
                                <label key={role.id} className="inline-flex items-center mr-4">
                                    <input
                                        type="checkbox"
                                        name="roles"
                                        value={role.id}
                                        defaultChecked={editingUser?.roles.some(r => r.id === role.id)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">{role.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEditModal(false)}
                            className="mr-3"
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
            </Modal>
        </AdminLayout>
    );
} 