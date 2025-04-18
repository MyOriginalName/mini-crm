import { render, screen, fireEvent } from '@testing-library/react';
import { InertiaApp } from '@inertiajs/inertia-react';
import Show from '@/Pages/Admin/Roles/Show';

const mockRole = {
    id: 2,
    name: 'manager',
    permissions: [
        { id: 2, name: 'view users' },
        { id: 3, name: 'create clients' }
    ]
};

const mockPermissions = [
    { id: 1, name: 'manage users' },
    { id: 2, name: 'view users' },
    { id: 3, name: 'create clients' },
    { id: 4, name: 'view clients' }
];

describe('Role Edit Page', () => {
    beforeEach(() => {
        render(
            <InertiaApp
                initialPage={{
                    component: 'Admin/Roles/Show',
                    props: {
                        role: mockRole,
                        permissions: mockPermissions
                    }
                }}
            >
                <Show role={mockRole} permissions={mockPermissions} />
            </InertiaApp>
        );
    });

    it('renders the page title', () => {
        expect(screen.getByText('Редактирование роли')).toBeInTheDocument();
    });

    it('displays the role name in the input field', () => {
        const nameInput = screen.getByLabelText('Название роли');
        expect(nameInput.value).toBe('manager');
    });

    it('shows all available permissions', () => {
        expect(screen.getByText('manage users')).toBeInTheDocument();
        expect(screen.getByText('view users')).toBeInTheDocument();
        expect(screen.getByText('create clients')).toBeInTheDocument();
        expect(screen.getByText('view clients')).toBeInTheDocument();
    });

    it('correctly checks permissions that are assigned to the role', () => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0].checked).toBe(false); // manage users
        expect(checkboxes[1].checked).toBe(true);  // view users
        expect(checkboxes[2].checked).toBe(true);  // create clients
        expect(checkboxes[3].checked).toBe(false); // view clients
    });

    it('has a save button', () => {
        expect(screen.getByText('Сохранить')).toBeInTheDocument();
    });

    it('groups permissions by category', () => {
        expect(screen.getByText('Пользователи')).toBeInTheDocument();
        expect(screen.getByText('Клиенты')).toBeInTheDocument();
    });

    it('has select all buttons for each category', () => {
        const selectAllButtons = screen.getAllByText(/Выбрать все/i);
        expect(selectAllButtons).toHaveLength(2); // One for each category
    });

    it('has a global select all button', () => {
        expect(screen.getByText('Выбрать все разрешения')).toBeInTheDocument();
    });
}); 