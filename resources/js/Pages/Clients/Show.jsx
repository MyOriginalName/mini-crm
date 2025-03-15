import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { useForm } from '@inertiajs/react';

export default function Show({ auth, client, tags }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        notes: client.notes,
        tags: client.tags.map(tag => tag.id),
    });

    const handleTagToggle = (tagId) => {
        const newTags = data.tags.includes(tagId)
            ? data.tags.filter(id => id !== tagId)
            : [...data.tags, tagId];
        
        setData('tags', newTags);
    };

    const handleSave = () => {
        patch(route('clients.update', client.id), {
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
                                    <h4 className="font-semibold mb-2">Контактная информация</h4>
                                    <div className="space-y-2">
                                        <p><span className="text-gray-600">Телефон:</span> {client.phone || 'Не указан'}</p>
                                        <p><span className="text-gray-600">Компания:</span> {client.company || 'Не указана'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Статус клиента</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
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

                            {client.notes && (
                                <div>
                                    <h4 className="font-semibold mb-2">Заметки</h4>
                                    <p className="text-gray-600 whitespace-pre-wrap">{client.notes}</p>
                                </div>
                            )}

                            {client.deals && client.deals.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Сделки</h4>
                                    <div className="space-y-2">
                                        {client.deals.map(deal => (
                                            <div
                                                key={deal.id}
                                                className="p-4 border rounded-lg"
                                                onClick={() => router.get(route('deals.show', deal.id))}
                                            >
                                                <p className="font-medium">{deal.title}</p>
                                                <p className="text-sm text-gray-600">Сумма: {deal.amount} ₽</p>
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