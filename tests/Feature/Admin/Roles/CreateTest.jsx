import { render, screen, fireEvent } from '@testing-library/react';
import { InertiaApp } from '@inertiajs/inertia-react';
import Create from '@/Pages/Admin/Roles/Create';

const mockPermissions = [
    { id: 1, name: 'manage users' },
    { id: 2, name: 'view users' },
    { id: 3, name: 'create clients' },
    { id: 4, name: 'view clients' }
];

describe('Role Create Page', () => {
    beforeEach(() => {
        render(
            <InertiaApp
                initialPage={{
                    component: 'Admin/Roles/Create',
                    props: {
                        permissions: mockPermissions
                    }
                }}
            >
                <Create permissions={mockPermissions} />
            </InertiaApp>
        );
    });

    it('renders the page title', () => {
        expect(screen.getByText('Создание новой роли')).toBeInTheDocument();
    });

    it('has an empty name input field', () => {
        const nameInput = screen.getByLabelText('Название роли');
        expect(nameInput.value).toBe('');
    });

    it('shows all available permissions', () => {
        expect(screen.getByText('manage users')).toBeInTheDocument();
        expect(screen.getByText('view users')).toBeInTheDocument();
        expect(screen.getByText('create clients')).toBeInTheDocument();
        expect(screen.getByText('view clients')).toBeInTheDocument();
    });

    it('has all permissions unchecked by default', () => {
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach(checkbox => {
            expect(checkbox.checked).toBe(false);
        });
    });

    it('has a create button', () => {
        expect(screen.getByText('Создать')).toBeInTheDocument();
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

    it('can select and deselect permissions', () => {
        const checkboxes = screen.getAllByRole('checkbox');
        
        // Select a permission
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0].checked).toBe(true);
        
        // Deselect the permission
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0].checked).toBe(false);
    });

    it('can use select all button for a category', () => {
        const selectAllButtons = screen.getAllByText(/Выбрать все/i);
        
        // Click select all for users category
        fireEvent.click(selectAllButtons[0]);
        
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0].checked).toBe(true); // manage users
        expect(checkboxes[1].checked).toBe(true); // view users
        expect(checkboxes[2].checked).toBe(false); // create clients
        expect(checkboxes[3].checked).toBe(false); // view clients
    });
}); 