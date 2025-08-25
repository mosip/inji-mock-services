import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';

describe('NavBar', () => {
  test('renders logo and navigation links', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    const logoImages = screen.getAllByAltText('truckpassTitle');
    expect(logoImages[0]).toBeInTheDocument();
    expect(screen.getByText('navbar.home')).toBeInTheDocument();
    expect(screen.getByText('navbar.help')).toBeInTheDocument();
  });

  test('renders language selector and toggles dropdown', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByAltText('globe_icon')).toBeInTheDocument();
    const languageDisplay = screen.getByText('English', { selector: 'div:not(button)' }); 
    expect(languageDisplay).toBeInTheDocument();
    const dropdownIcon = screen.getByAltText('dropdown'); 
    fireEvent.click(dropdownIcon);
    expect(languageDisplay).toBeInTheDocument();
    expect(screen.getByText('Française')).toBeInTheDocument();  // Fixed label
  });

  test('changes language and closes dropdown on selection', async () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    const dropdownIcon = screen.getByAltText('dropdown');
    fireEvent.click(dropdownIcon);

    const frenchButton = screen.getByText('Française'); // Fixed label
    fireEvent.click(frenchButton);

    await waitFor(() => {
      expect(screen.getByText('Française', { selector: 'div:not(button)' })).toBeInTheDocument();
    }, { timeout: 1000 });

    const englishInDisplay = screen.queryByText('English', { selector: 'div:not(button)' });
    expect(englishInDisplay).toBeNull(); 
    expect(screen.queryByText('Française', { selector: 'button' })).not.toBeInTheDocument();
  });

  test('navigation links have correct href and id attributes', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    const homeLink = screen.getByText('navbar.home');
    const helpLink = screen.getByText('navbar.help');
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveAttribute('id', 'home');
    expect(helpLink).not.toHaveAttribute('href');
    expect(helpLink).toHaveAttribute('id', 'help');
  });
});

// Test1: Checks if the navigation bar shows the logo and the home and help links
// Test2: Tests if the language selector appears and the dropdown opens when clicked
// Test3: Verifies that selecting a language (like French) updates the display and closes the dropdown
// Test4: Ensures the home and help links have the correct href and id attributes
