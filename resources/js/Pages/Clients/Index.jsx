import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from '@/Components/ui/table';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Pagination } from '@/Components/ui/pagination';
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle 
} from '@/Components/ui/dialog';
import ClientForm from './ClientForm';

export default function Clients({ auth, clients, filters, tags }) {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedTag, setSelectedTag] = useState(filters.tag || null);
    
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('clients.index'), { 
            search: searchQuery,
            tag: selectedTag,
        }, { 
            preserveState: true 
        });
    };

    const handleTagFilter = (tagId) => {
        const newTagId = selectedTag === tagId ? null : tagId;
        setSelectedTag(newTagId);
        router.get(route('clients.index'), {
            search: searchQuery,
            tag: newTagId,
        }, {
            preserveState: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Управление клиентами</h2>}
        >
            <Head title="Клиенты" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex flex-col gap-4 mb-6">
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Поиск клиентов..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Button type="submit">Поиск</Button>
                                </form>

                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <Button
                                            key={tag.id}
                                            type="button"
                                            variant={selectedTag === tag.id ? "default" : "outline"}
                                            onClick={() => handleTagFilter(tag.id)}
                                            style={{
                                                backgroundColor: selectedTag === tag.id ? tag.color : 'transparent',
                                                borderColor: tag.color,
                                                color: selectedTag === tag.id ? 'white' : tag.color,
                                            }}
                                        >
                                            {tag.name} ({tag.clients_count})
                                        </Button>
                                    ))}
                                </div>

                                <div className="flex justify-end">
                                    <Button onClick={() => setShowCreateDialog(true)}>
                                        Добавить клиента
                                    </Button>
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Имя</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Телефон</TableHead>
                                        <TableHead>Компания</TableHead>
                                        <TableHead>Статусы</TableHead>
                                        <TableHead>Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.data.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell>{client.name}</TableCell>
                                            <TableCell>{client.email}</TableCell>
                                            <TableCell>{client.phone}</TableCell>
                                            <TableCell>{client.company}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {client.tags.map(tag => (
                                                        <span
                                                            key={tag.id}
                                                            className="px-2 py-1 rounded-full text-xs"
                                                            style={{
                                                                backgroundColor: tag.color,
                                                                color: 'white',
                                                            }}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Link href={route('clients.show', client.id)}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Просмотр
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('clients.edit', client.id)}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Редактировать
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Pagination className="mt-6" links={clients.links} />
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Создать клиента</DialogTitle>
                    </DialogHeader>
                    <ClientForm onSuccess={() => setShowCreateDialog(false)} />
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
} 