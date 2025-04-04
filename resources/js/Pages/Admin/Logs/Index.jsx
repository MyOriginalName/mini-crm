import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Index({ logs }) {
    const getActionColor = (action) => {
        switch (action) {
            case 'created':
                return 'bg-green-100 text-green-800';
            case 'updated':
                return 'bg-blue-100 text-blue-800';
            case 'deleted':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Логи</h2>}
        >
            <Head title="Логи" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>История действий</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Пользователь</TableHead>
                                        <TableHead>Действие</TableHead>
                                        <TableHead>Сущность</TableHead>
                                        <TableHead>Описание</TableHead>
                                        <TableHead>Дата</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{log.user.name}</TableCell>
                                            <TableCell>
                                                <Badge className={getActionColor(log.action)}>
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{log.entity_type}</TableCell>
                                            <TableCell>{log.description}</TableCell>
                                            <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            
                            {/* Пагинация */}
                            <div className="mt-6 flex justify-center">
                                <nav className="flex items-center gap-1" aria-label="Pagination">
                                    {logs.links.map((link, key) => {
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
        </AdminLayout>
    );
} 