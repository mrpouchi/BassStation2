import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { routes } from '@/app/router';

function AppRoutes() {
  return useRoutes(routes);
}

describe('language switch', () => {
  it('renders the app in French and back in English', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/learn']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Curriculum' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Français' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Programme' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Apprendre/ })).toBeInTheDocument();
    // Content is translated too (chapter title from the curriculum).
    expect(screen.getByText('Les bases du son')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('fr');
    await user.click(screen.getByRole('radio', { name: 'English' }));
    expect(await screen.findByText('Sound Fundamentals')).toBeInTheDocument();
  });
});
