import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { useForm } from '@inertiajs/react';
import { CLIENT_STATUS_LABELS, CLIENT_TYPE_LABELS } from '@/constants/clientConstants';
import { Pencil } from 'lucide-react';

export default function Show({ auth, client, tags }) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: client.name,
        email: client.email,
        phone: client.phone,
        type: client.type,
        status: client.status,
        company_name: client.company_name || '',
        inn: client.inn || '',
        kpp: client.kpp || '',
        address: client.address || '',
        description: client.description || '',
        tags: client.tags?.map(tag => tag.id) || [],
    });

    const handleTagToggle = (tagId) => {
        const newTags = data.tags.includes(tagId)
            ? data.tags.filter(id => id !== tagId)
            : [...data.tags, tagId];
        
        setData('tags', newTags);
    };

    const handleSave = () => {
        put(route('clients.update', client.id), {
            onSuccess: () => {
                setIsEditing(false);
                router.reload();
            }
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setData({
            name: client.name,
            email: client.email,
            phone: client.phone,
            type: client.type,
            status: client.status,
            company_name: client.company_name || '',
            inn: client.inn || '',
            kpp: client.kpp || '',
            address: client.address || '',
            description: client.description || '',
            tags: client.tags?.map(tag => tag.id) || [],
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Просмотр клиента</h2>}
        >
            <Head title={`Клиент: ${client.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Верхняя панель с основной информацией и кнопками */}
                            <div className="flex justify-between items-start mb-8 pb-4 border-b">
                                <div className="space-y-1">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="text-2xl font-bold border-b border-gray-300 focus:border-primary focus:outline-none"
                                        />
                                    ) : (
                                        <h3 className="text-2xl font-bold">{client.name}</h3>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-600">{client.email}</span>
                                        <span className="text-gray-600">•</span>
                                        <span className="text-gray-600">{client.phone}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('clients.index')}>
                                        <Button variant="outline">
                                            Назад к списку
                                        </Button>
                                    </Link>
                                    {isEditing ? (
                                        <>
                                            <Button variant="outline" onClick={handleCancel}>
                                                Отмена
                                            </Button>
                                            <Button onClick={handleSave} disabled={processing}>
                                                Сохранить
                                            </Button>
                                        </>
                                    ) : (
                                        <Button onClick={handleEdit} className="flex items-center gap-2">
                                            <Pencil className="h-4 w-4" />
                                            Редактировать
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Основная информация и информация о компании */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4">Основная информация</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {isEditing ? (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">Тип клиента</label>
                                                        <select
                                                            value={data.type}
                                                            onChange={(e) => setData('type', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        >
                                                            <option value="individual">Физическое лицо</option>
                                                            <option value="company">Компания</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">Статус</label>
                                                        <select
                                                            value={data.status}
                                                            onChange={(e) => setData('status', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        >
                                                            <option value="active">Активный</option>
                                                            <option value="inactive">Неактивный</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">Телефон</label>
                                                        <input
                                                            type="text"
                                                            value={data.phone}
                                                            onChange={(e) => setData('phone', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                                        <input
                                                            type="email"
                                                            value={data.email}
                                                            onChange={(e) => setData('email', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-600">Тип клиента</span>
                                                        <span className="block mt-1">{CLIENT_TYPE_LABELS[client.type]}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-600">Статус</span>
                                                        <span className="block mt-1">{CLIENT_STATUS_LABELS[client.status]}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-600">Телефон</span>
                                                        <span className="block mt-1">{client.phone || 'Не указан'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-600">Email</span>
                                                        <span className="block mt-1">{client.email}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold mb-4">Адрес</h4>
                                        {isEditing ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                    placeholder="Введите адрес"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">{client.address || 'Адрес не указан'}</p>
                                        )}
                                    </div>
                                </div>

                                {client.type === 'company' && (
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4">Информация о компании</h4>
                                        <div className="space-y-4">
                                            {isEditing ? (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">Название компании</label>
                                                        <input
                                                            type="text"
                                                            value={data.company_name}
                                                            onChange={(e) => setData('company_name', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">ИНН</label>
                                                        <input
                                                            type="text"
                                                            value={data.inn}
                                                            onChange={(e) => setData('inn', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">КПП</label>
                                                        <input
                                                            type="text"
                                                            value={data.kpp}
                                                            onChange={(e) => setData('kpp', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-600">Название компании</span>
                                                        <span className="block mt-1">{client.company_name}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-600">ИНН</span>
                                                        <span className="block mt-1">{client.inn}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-600">КПП</span>
                                                        <span className="block mt-1">{client.kpp || 'Не указан'}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Описание */}
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold mb-4">Описание</h4>
                                {isEditing ? (
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                        rows={4}
                                        placeholder="Добавьте описание"
                                    />
                                ) : (
                                    <p className="text-gray-600 whitespace-pre-wrap">{client.description || 'Описание отсутствует'}</p>
                                )}
                            </div>

                            {/* Сделки */}
                            {client.deals && client.deals.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold mb-4">Сделки</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {client.deals.map(deal => (
                                            <div
                                                key={deal.id}
                                                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => router.get(route('deals.show', deal.id))}
                                            >
                                                <p className="font-medium">{deal.name}</p>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-sm text-gray-600">
                                                        Сумма: {new Intl.NumberFormat('ru-RU', {
                                                            style: 'currency',
                                                            currency: 'RUB'
                                                        }).format(deal.value)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">Статус: {deal.status}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 