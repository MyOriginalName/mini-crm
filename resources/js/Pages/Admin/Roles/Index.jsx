import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from 'Layouts/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'Components/ui/table';
import { Button } from 'Components/ui/button';
import { Card, CardContent } from 'Components/ui/card';
import { Eye } from 'lucide-react';

export default function RolesIndex({ roles, permissions }) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        permissions: [],
    });

    function handleCheckboxChange(e) {
        const value = parseInt(e.target.value);
        if (e.target.checked) {
            setData('permissions', [...data.permissions, value]);
        } else {
            setData('permissions', data.permissions.filter(id => id !== value));
        }
    }

    function submit(e) {
        e.preventDefault();
        post(route('admin.roles.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    }

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Роли</h2>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="mb-4"
                    >
                        Создать новую роль
                    </Button>
                </div>
            }
        >
            <Head title="Роли" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardContent className="p-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Имя</TableHead>
                                        <TableHead>Разрешения</TableHead>
                                        <TableHead>Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(roles?.data || []).map((role) => (
                                        <TableRow key={role.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div>
                                                    <div>{role.name}</div>
                                                    {role.russian_name && (
                                                        <div className="text-sm text-gray-500">{role.russian_name}</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {Array.isArray(role.permissions) && role.permissions.map((permission) => (
                                                        <span
                                                            key={permission.id}
                                                            className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                                        >
                                                            {permission.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Link href={route('admin.roles.show', role.id)}>
                                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                            <Eye className="h-4 w-4" />
                                                            Посмотреть
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.location.href = route('admin.roles.edit', role.id)}
                                                    >
                                                        Редактировать
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="mt-6 flex justify-center">
                                <nav className="flex items-center gap-1" aria-label="Pagination">
                                    {(roles?.links || []).map((link, key) => {
                                        if (link.label.includes('Previous')) {
                                            return (
                                                    <Button
                                                        key={key}
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={!link.url}
                                                        onClick={() => link.url && window.location.assign(link.url)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        {'<'}
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
                                                        onClick={() => link.url && window.location.assign(link.url)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        {'>'}
                                                    </Button>
                                            );
                                        }
                                        return (
                                            <Button
                                                key={key}
                                                variant={link.active ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => link.url && window.location.assign(link.url)}
                                                className="h-8 w-8 p-0"
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

            {/* Create Role Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Создать новую роль</h2>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Имя роли
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                            </div>

                            <div className="mb-4">
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
                                                checked={data.permissions.includes(permission.id)}
                                                onChange={handleCheckboxChange}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">{permission.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.permissions && <div className="text-red-600 text-sm mt-1">{errors.permissions}</div>}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        reset();
                                    }}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Создать
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
