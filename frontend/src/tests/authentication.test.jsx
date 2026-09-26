import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Authentication from '../pages/authentication';
import { AuthContext } from '../contexts/AuthContext';

const renderWithAuthContext = (contextValue) => {
    return render(
        <AuthContext.Provider value={contextValue}>
            <Authentication />
        </AuthContext.Provider>
    );
};

describe('Authentication Page', () => {
    it('should render Sign In form by default', () => {
        renderWithAuthContext({ handleLogin: vi.fn(), handleRegister: vi.fn() });
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
    });

    it('should switch to Sign Up form and show Full Name field', async () => {
        renderWithAuthContext({ handleLogin: vi.fn(), handleRegister: vi.fn() });
        const user = userEvent.setup();

        await user.click(screen.getByText('Sign Up'));

        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    it('should show error when password is less than 6 characters on register', async () => {
        const mockRegister = vi.fn();
        renderWithAuthContext({ handleLogin: vi.fn(), handleRegister: mockRegister });
        const user = userEvent.setup();

        await user.click(screen.getByText('Sign Up'));
        await user.type(screen.getByLabelText(/username/i), 'testuser');
        await user.type(screen.getByLabelText(/password/i), 'short');
        await user.click(screen.getByRole('button', { name: /register/i }));

        expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should call handleRegister when password is valid', async () => {
        const mockRegister = vi.fn().mockResolvedValue('User Register');
        renderWithAuthContext({ handleLogin: vi.fn(), handleRegister: mockRegister });
        const user = userEvent.setup();

        await user.click(screen.getByText('Sign Up'));
        await user.type(screen.getByLabelText(/full name/i), 'Test User');
        await user.type(screen.getByLabelText(/username/i), 'testuser');
        await user.type(screen.getByLabelText(/password/i), 'passwordlong123');
        await user.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith('Test User', 'testuser', 'passwordlong123');
        });
    });

    it('should display error message on failed login', async () => {
        const mockLogin = vi.fn().mockRejectedValue({
            response: { data: { message: 'Invalid Username or password' } }
        });
        renderWithAuthContext({ handleLogin: mockLogin, handleRegister: vi.fn() });
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/username/i), 'wronguser');
        await user.type(screen.getByLabelText(/password/i), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid Username or password')).toBeInTheDocument();
        });
    });
});