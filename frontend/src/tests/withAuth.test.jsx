import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import withAuth from '../utils/withAuth';

vi.mock('axios');

const DummyComponent = () => <div>Protected Content</div>;
const WrappedComponent = withAuth(DummyComponent);

describe('withAuth', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should not render protected content when no token exists', async () => {
        render(
            <MemoryRouter>
                <WrappedComponent />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });
    });

    it('should render protected content when token is valid', async () => {
        localStorage.setItem('token', 'valid-token-123');
        axios.get.mockResolvedValueOnce({ data: { valid: true } });

        render(
            <MemoryRouter>
                <WrappedComponent />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
    });

    it('should remove token and not render content when token is invalid', async () => {
        localStorage.setItem('token', 'invalid-token');
        axios.get.mockResolvedValueOnce({ data: { valid: false } });

        render(
            <MemoryRouter>
                <WrappedComponent />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
            expect(localStorage.getItem('token')).toBeNull();
        });
    });

    it('should handle network errors gracefully', async () => {
        localStorage.setItem('token', 'some-token');
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        render(
            <MemoryRouter>
                <WrappedComponent />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });
    });
});