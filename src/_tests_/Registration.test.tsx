import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppMainLayout from '../shared/AppMainLayout';

jest.mock('../components/NavBar', () => () => <div data-testid="navbar">NavBar</div>);

describe('AppMainLayout Component', () => {
  test('renders NavBar and children with correct classes', () => {
    const testChild = <div data-testid="test-child">Test Content</div>;
    render(
      <MemoryRouter>
        <AppMainLayout>{testChild}</AppMainLayout>
      </MemoryRouter>
    );

    const mainLayout = screen.getByTestId('test-child').closest('[class*="font-inter"]');
    expect(mainLayout).toHaveClass('h-full w-full font-inter');
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  test('renders correctly without children', () => {
    render(
      <MemoryRouter>
        <AppMainLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    // No test-child should exist
    expect(screen.queryByTestId('test-child')).toBeNull();
  });

  test('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AppMainLayout>
          <div>Snapshot Child</div>
        </AppMainLayout>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('has a container with layout classes applied', () => {
    const testChild = <div data-testid="child">Hello</div>;
    render(
      <MemoryRouter>
        <AppMainLayout>{testChild}</AppMainLayout>
      </MemoryRouter>
    );

    const container = screen.getByTestId('child').closest('div');
    expect(container).toHaveClass('h-full');
    expect(container).toHaveClass('w-full');
    expect(container).toHaveClass('font-inter');
  });
});
