import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { useForm } from '@inertiajs/react';
import { CLIENT_STATUS_LABELS, CLIENT_TYPE_LABELS } from '@/constants/clientConstants';

export default function Show({ auth, client, tags }) {
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
            onSuccess: () => router.visit(route('clients.index'))
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
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold">{client.name}</h3>
                                    <p className="text-gray-600">{client.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('clients.index')}>
                                        <Button variant="outline">
                                            Назад к списку
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={handleSave}
                                        disabled={processing}
                                    >
                                        Сохранить
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Основная информация</h4>
                                    <div className="space-y-2">
                                        <p><span className="text-gray-600">Тип клиента:</span> {CLIENT_TYPE_LABELS[client.type]}</p>
                                        <p><span className="text-gray-600">Статус:</span> {CLIENT_STATUS_LABELS[client.status]}</p>
                                        <p><span className="text-gray-600">Телефон:</span> {client.phone || 'Не указан'}</p>
                                        <p><span className="text-gray-600">Email:</span> {client.email}</p>
                                        <p><span className="text-gray-600">Адрес:</span> {client.address || 'Не указан'}</p>
                                    </div>
                                </div>

                                {client.type === 'company' && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Информация о компании</h4>
                                        <div className="space-y-2">
                                            <p><span className="text-gray-600">Название компании:</span> {client.company_name}</p>
                                            <p><span className="text-gray-600">ИНН:</span> {client.inn}</p>
                                            <p><span className="text-gray-600">КПП:</span> {client.kpp || 'Не указан'}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="font-semibold mb-2">Теги</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tags?.map(tag => (
                                            <Button
                                                key={tag.id}
                                                type="button"
                                                variant={data.tags.includes(tag.id) ? "default" : "outline"}
                                                onClick={() => handleTagToggle(tag.id)}
                                                style={{
                                                    backgroundColor: data.tags.includes(tag.id) ? tag.color : 'transparent',
                                                    borderColor: tag.color,
                                                    color: data.tags.includes(tag.id) ? 'white' : tag.color,
                                                }}
                                            >
                                                {tag.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {client.description && (
                                <div>
                                    <h4 className="font-semibold mb-2">Описание</h4>
                                    <p className="text-gray-600 whitespace-pre-wrap">{client.description}</p>
                                </div>
                            )}

                            {client.deals && client.deals.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Сделки</h4>
                                    <div className="space-y-2">
                                        {client.deals.map(deal => (
                                            <div
                                                key={deal.id}
                                                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                                                onClick={() => router.get(route('deals.show', deal.id))}
                                            >
                                                <p className="font-medium">{deal.name}</p>
                                                <p className="text-sm text-gray-600">Сумма: {new Intl.NumberFormat('ru-RU', {
                                                    style: 'currency',
                                                    currency: 'RUB'
                                                }).format(deal.value)}</p>
                                                <p className="text-sm text-gray-600">Статус: {deal.status}</p>
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