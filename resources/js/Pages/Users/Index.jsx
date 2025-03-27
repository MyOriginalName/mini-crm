import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

export default function Index({ auth, users, roles, logs, can }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, processing, reset } = useForm({
        name: '',
        email: '',
        password: '',
        roles: []
    });

    const editUser = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            roles: user.roles.map(role => role.id)
        });
        setShowEditModal(true);
    };

    const deleteUser = (user) => {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            router.delete(route('users.destroy', user.id));
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (showEditModal) {
            put(route('users.update', editingUser.id));
        } else {
            post(route('users.store'));
        }
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setEditingUser(null);
        reset();
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('ru-RU');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Управление пользователями</h2>}
        >
            <Head title="Управление пользователями" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Список пользователей</h3>
                            {can.create && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Добавить пользователя
                                </button>
                            )}
                        </div>

                        {/* Таблица пользователей */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Имя
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Роли
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Задач
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Действия
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.tasks_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    {can.edit && (
                                                        <button
                                                            onClick={() => editUser(user)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Редактировать
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={route('users.logs', user.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Логи
                                                    </Link>
                                                    {can.delete && user.id !== auth.user.id && (
                                                        <button
                                                            onClick={() => deleteUser(user)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Удалить
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Пагинация */}
                        <div className="mt-4">
                            <Pagination links={users.links} />
                        </div>
                    </div>

                    {/* Последние действия */}
                    <div className="mt-6 bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Последние действия пользователей</h3>
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-900">
                                            <span className="font-medium">{log.user.name}</span>
                                            {log.action}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(log.created_at)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно создания/редактирования */}
            <Modal show={showCreateModal || showEditModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {showEditModal ? 'Редактирование пользователя' : 'Создание пользователя'}
                    </h2>
                    <form onSubmit={submitForm}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Имя</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Пароль</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required={!showEditModal}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Роли</label>
                                <div className="mt-2 space-y-2">
                                    {roles.map((role) => (
                                        <label key={role.id} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                value={role.id}
                                                checked={data.roles.includes(role.id)}
                                                onChange={e => {
                                                    const newRoles = e.target.checked
                                                        ? [...data.roles, role.id]
                                                        : data.roles.filter(id => id !== role.id);
                                                    setData('roles', newRoles);
                                                }}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2">{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                            >
                                {showEditModal ? 'Сохранить' : 'Создать'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
} 