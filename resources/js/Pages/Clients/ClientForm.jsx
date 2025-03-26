import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { router, useForm, usePage } from '@inertiajs/react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

export default function ClientForm({ client = null, onSuccess }) {
    const { tags } = usePage().props;
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: client?.name || '',
        email: client?.email || '',
        phone: client?.phone || '',
        company: client?.company || '',
        notes: client?.notes || '',
        tags: client?.tags?.map(tag => tag.id) || [],
        type: client?.type || 'individual',
        status: client?.status || 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const request = client
            ? put(route('clients.update', client.id), { onSuccess })
            : post(route('clients.store'), { onSuccess });
    };

    const handleTagToggle = (tagId) => {
        const newTags = data.tags.includes(tagId)
            ? data.tags.filter(id => id !== tagId)
            : [...data.tags, tagId];
        setData('tags', newTags);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Имя</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    error={errors.name}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    error={errors.email}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                    id="phone"
                    value={data.phone}
                    onChange={e => setData('phone', e.target.value)}
                    error={errors.phone}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div>
                <Label htmlFor="company">Компания</Label>
                <Input
                    id="company"
                    value={data.company}
                    onChange={e => setData('company', e.target.value)}
                    error={errors.company}
                />
                {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
            </div>

            <div>
                <Label>Статус клиента</Label>
                <div className="flex flex-wrap gap-2 mt-2">
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
                {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
            </div>

            <div>
                <Label htmlFor="type">Тип клиента</Label>
                <select
                    id="type"
                    value={data.type}
                    onChange={e => setData('type', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="individual">Физическое лицо</option>
                    <option value="company">Компания</option>
                </select>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>

            <div>
                <Label htmlFor="status">Статус</Label>
                <select
                    id="status"
                    value={data.status}
                    onChange={e => setData('status', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="active">Активный</option>
                    <option value="inactive">Неактивный</option>
                    <option value="blocked">Заблокирован</option>
                </select>
                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>

            <div>
                <Label htmlFor="notes">Заметки</Label>
                <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={e => setData('notes', e.target.value)}
                    error={errors.notes}
                />
                {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onSuccess?.()}
                >
                    Отмена
                </Button>
                <Button type="submit" disabled={processing}>
                    {client ? 'Сохранить' : 'Создать'}
                </Button>
            </div>
        </form>
    );
}