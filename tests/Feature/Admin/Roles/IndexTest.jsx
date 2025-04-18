import { render, screen } from '@testing-library/react';
import { InertiaApp } from '@inertiajs/inertia-react';
import Index from '@/Pages/Admin/Roles/Index';

const mockRoles = [
    {
        id: 1,
        name: 'admin',
        permissions: [
            { id: 1, name: 'manage users' },
            { id: 2, name: 'view users' },
            { id: 3, name: 'create clients' }
        ]
    },
    {
        id: 2,
        name: 'manager',
        permissions: [
            { id: 2, name: 'view users' },
            { id: 3, name: 'create clients' }
        ]
    },
    {
        id: 3,
        name: 'user',
        permissions: [
            { id: 4, name: 'view clients' }
        ]
    }
];

const mockPermissions = [
    { id: 1, name: 'manage users' },
    { id: 2, name: 'view users' },
    { id: 3, name: 'create clients' },
    { id: 4, name: 'view clients' }
];

describe('Roles Index Page', () => {
    beforeEach(() => {
        render(
            <InertiaApp
                initialPage={{
                    component: 'Admin/Roles/Index',
                    props: {
                        roles: mockRoles,
                        permissions: mockPermissions
                    }
                }}
            >
                <Index roles={mockRoles} permissions={mockPermissions} />
            </InertiaApp>
        );
    });

    it('renders the page title', () => {
        expect(screen.getByText('Управление ролями')).toBeInTheDocument();
    });

    it('displays all roles', () => {
        expect(screen.getByText('admin')).toBeInTheDocument();
        expect(screen.getByText('manager')).toBeInTheDocument();
        expect(screen.getByText('user')).toBeInTheDocument();
    });

    it('shows correct permission counts', () => {
        expect(screen.getByText('3 разрешения')).toBeInTheDocument(); // admin
        expect(screen.getByText('2 разрешения')).toBeInTheDocument(); // manager
        expect(screen.getByText('1 разрешение')).toBeInTheDocument(); // user
    });

    it('displays role descriptions', () => {
        expect(screen.getByText('Полный доступ ко всем функциям системы')).toBeInTheDocument();
        expect(screen.getByText('Управление пользователями и клиентами')).toBeInTheDocument();
        expect(screen.getByText('Базовый доступ к функциям системы')).toBeInTheDocument();
    });

    it('has edit links for each role', () => {
        const editLinks = screen.getAllByText('Редактировать');
        expect(editLinks).toHaveLength(3);
    });
}); 