import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function Deals() {
    const [deals, setDeals] = useState([
        { id: 1, title: 'Продажа оборудования', client: 'ООО Рога и Копыта', amount: 150000, stage: 'new' },
        { id: 2, title: 'Консультация', client: 'ИП Иванов', amount: 50000, stage: 'in_progress' },
        { id: 3, title: 'Поставка материалов', client: 'ООО Стройка', amount: 300000, stage: 'success' },
        { id: 4, title: 'Разработка сайта', client: 'ООО Диджитал', amount: 200000, stage: 'failed' },
    ]);

    const stages = {
        new: { title: 'Новая', color: 'bg-blue-100' },
        in_progress: { title: 'В работе', color: 'bg-yellow-100' },
        success: { title: 'Успешная', color: 'bg-green-100' },
        failed: { title: 'Провал', color: 'bg-red-100' },
    };

    // Данные для воронки продаж
    const funnelData = [
        { name: 'Новые', value: deals.filter(d => d.stage === 'new').length },
        { name: 'В работе', value: deals.filter(d => d.stage === 'in_progress').length },
        { name: 'Успешные', value: deals.filter(d => d.stage === 'success').length },
        { name: 'Провальные', value: deals.filter(d => d.stage === 'failed').length },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Сделки и воронка продаж</h2>}
        >
            <Head title="Сделки" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* График воронки продаж */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Воронка продаж</h3>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={funnelData}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kanban доска */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Доска сделок</h3>
                                <Button variant="default">
                                    Новая сделка
                                </Button>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                {Object.entries(stages).map(([key, { title, color }]) => (
                                    <div key={key} className={`${color} p-4 rounded-lg`}>
                                        <h4 className="font-semibold mb-4">{title}</h4>
                                        <div className="space-y-2">
                                            {deals
                                                .filter(deal => deal.stage === key)
                                                .map(deal => (
                                                    <div
                                                        key={deal.id}
                                                        className="bg-white p-3 rounded shadow"
                                                    >
                                                        <h5 className="font-medium">{deal.title}</h5>
                                                        <p className="text-sm text-gray-600">{deal.client}</p>
                                                        <p className="text-sm font-semibold">
                                                            {new Intl.NumberFormat('ru-RU', {
                                                                style: 'currency',
                                                                currency: 'RUB'
                                                            }).format(deal.amount)}
                                                        </p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 