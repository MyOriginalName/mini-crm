import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function Show({ auth, role, permissions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions.map(p => p.id)
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.roles.update', role.id));
    };

    // Группируем разрешения по категориям
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const category = permission.name.split(' ')[0];
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
    }, {});

    // Функция для выбора/отмены всех разрешений в категории
    const toggleCategory = (category) => {
        const categoryPermissions = groupedPermissions[category].map(p => p.id);
        const allSelected = categoryPermissions.every(id => data.permissions.includes(id));
        
        if (allSelected) {
            // Если все выбраны, убираем все
            setData('permissions', data.permissions.filter(id => !categoryPermissions.includes(id)));
        } else {
            // Если не все выбраны, добавляем все
            const newPermissions = [...new Set([...data.permissions, ...categoryPermissions])];
            setData('permissions', newPermissions);
        }
    };

    // Функция для выбора/отмены всех разрешений
    const toggleAll = () => {
        const allPermissions = permissions.map(p => p.id);
        const allSelected = allPermissions.every(id => data.permissions.includes(id));
        
        if (allSelected) {
            setData('permissions', []);
        } else {
            setData('permissions', allPermissions);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Редактирование роли</h2>}
        >
            <Head title="Редактирование роли" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Название роли" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <InputLabel value="Разрешения" />
                                        <button
                                            type="button"
                                            onClick={toggleAll}
                                            className="text-sm text-indigo-600 hover:text-indigo-900"
                                        >
                                            {permissions.every(p => data.permissions.includes(p.id))
                                                ? 'Снять все'
                                                : 'Выбрать все'}
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        {Object.entries(groupedPermissions).map(([category, perms]) => (
                                            <div key={category} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-lg font-medium capitalize">{category}</h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleCategory(category)}
                                                        className="text-sm text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        {perms.every(p => data.permissions.includes(p.id))
                                                            ? 'Снять все'
                                                            : 'Выбрать все'}
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                    {perms.map((permission) => (
                                                        <label key={permission.id} className="inline-flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                value={permission.id}
                                                                checked={data.permissions.includes(permission.id)}
                                                                onChange={e => {
                                                                    const newPermissions = e.target.checked
                                                                        ? [...data.permissions, permission.id]
                                                                        : data.permissions.filter(id => id !== permission.id);
                                                                    setData('permissions', newPermissions);
                                                                }}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2">{permission.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.permissions} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Сохранить</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 