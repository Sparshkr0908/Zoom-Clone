import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomeComponent from '../pages/home';
import { AuthContext } from '../contexts/AuthContext';

vi.mock('../utils/withAuth', () => ({
    default: (Component) => Component,
}));

const renderHome = (contextValue) => {
    return render(
        <MemoryRouter>
            <AuthContext.Provider value={contextValue}>
                <HomeComponent />
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

describe('HomeComponent', () => {
    let mockContext;

    beforeEach(() => {
        mockContext = {
            addToUserHistory: vi.fn().mockResolvedValue({}),
            checkMeetingActive: vi.fn(),
        };
    });

    it('should show error when Join is clicked with empty code', async () => {
        renderHome(mockContext);
        const user = userEvent.setup();

        await user.click(screen.getByText('Join'));

        expect(screen.getByText(/please enter a meeting code/i)).toBeInTheDocument();
        expect(mockContext.checkMeetingActive).not.toHaveBeenCalled();
    });

    it('should show error when meeting code does not exist', async () => {
        mockContext.checkMeetingActive.mockResolvedValue(false);
        renderHome(mockContext);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/meeting code/i), 'invalidcode');
        await user.click(screen.getByText('Join'));

        await waitFor(() => {
            expect(screen.getByText(/meeting not found or has ended/i)).toBeInTheDocument();
        });
    });

    it('should call addToUserHistory when meeting code is valid', async () => {
        mockContext.checkMeetingActive.mockResolvedValue(true);
        renderHome(mockContext);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/meeting code/i), 'validcode123');
        await user.click(screen.getByText('Join'));

        await waitFor(() => {
            expect(mockContext.addToUserHistory).toHaveBeenCalledWith('validcode123');
        });
    });

    it('should generate a new meeting code and add to history on New Meeting click', async () => {
        renderHome(mockContext);
        const user = userEvent.setup();

        await user.click(screen.getByText('+ New Meeting'));

        await waitFor(() => {
            expect(mockContext.addToUserHistory).toHaveBeenCalled();
        });
    });
});