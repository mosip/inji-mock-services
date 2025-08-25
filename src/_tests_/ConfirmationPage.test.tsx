import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ConfirmationPage } from '../pages/driverRegistration/ConfirmationPage';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../commans/Stepper';
import { SuccessPopup } from '../components/SuccessPopup';
import '@testing-library/jest-dom';

// Mock react-router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.driverName) return `Driver Name: ${options.driverName}`;
      const translations: Record<string, string> = {
        'confirmationPage.registrationCompleted': 'Registration Completed',
        'confirmationPage.SuccessFullySubmitText': 'You have successfully submitted your registration.',
        'confirmationPage.driverSummary': 'Driver Summary',
        'confirmationPage.registrationDetailsInfo': 'Details for driver',
        'confirmationPage.hideDetails': 'Hide Details',
        'confirmationPage.showDetails': 'Show Details',
        'confirmationPage.fullName': 'Full Name',
        'confirmationPage.uin': 'UIN',
        'confirmationPage.gender': 'Gender',
        'confirmationPage.email': 'Email',
        'confirmationPage.phoneNumber': 'Phone Number',
        'confirmationPage.city': 'City',
        'confirmationPage.transportCompany': 'Transport Company',
        'confirmationPage.licenseNum': 'License Number',
        'confirmationPage.passportNumber': 'Passport Number',
        'confirmationPage.cpcCertificate': 'CPC Certificate',
        'confirmationPage.fileUploaded': 'File Uploaded',
        'confirmationPage.startNewRegistrationBtn': 'Start New Registration',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock Stepper + SuccessPopup + assets
jest.mock('../commans/Stepper', () => ({
  Stepper: jest.fn(() => <div data-testid="stepper">Stepper Component</div>),
}));

jest.mock('../components/SuccessPopup', () => ({
  SuccessPopup: jest.fn(({ showSuccessPopup }) =>
    showSuccessPopup ? <div data-testid="success-popup">Success Popup</div> : null
  ),
}));

jest.mock('../../assets/confirmation_icon.png', () => 'confirmation_icon.png');
jest.mock('../../assets/user_photo.png', () => 'user_photo.png');
jest.mock('../../assets/Hide_Details.png', () => 'Hide_Details.png');
jest.mock('../../assets/Show_Details.png', () => 'Show_Details.png');

describe('ConfirmationPage', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    localStorage.clear();
    jest.useFakeTimers();
    (Stepper as jest.Mock).mockClear();
    (SuccessPopup as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('renders confirmation page UI', () => {
    render(<ConfirmationPage />);
    expect(screen.getByText('Registration Completed')).toBeInTheDocument();
    expect(screen.getByText('You have successfully submitted your registration.')).toBeInTheDocument();
    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.getByAltText('confirmation_icon')).toBeInTheDocument();
    expect(screen.getByText('Driver Summary')).toBeInTheDocument();
  });

  test('shows success popup then hides after 5 seconds', async () => {
    render(<ConfirmationPage />);
    expect(screen.getByTestId('success-popup')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('success-popup')).not.toBeInTheDocument();
    });
  });

  test('toggles driver details visibility (mask/unmask)', async () => {
    render(<ConfirmationPage />);

    const hideBtn = screen.getByText('Hide Details');
    await act(async () => {
      fireEvent.click(hideBtn);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByText('Show Details')).toBeInTheDocument();
    });

    const showBtn = screen.getByText('Show Details');
    await act(async () => {
      fireEvent.click(showBtn);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByText('Hide Details')).toBeInTheDocument();
    });
  });

  test('navigates to LandingPage on start new registration click', async () => {
    render(<ConfirmationPage />);
    const btn = screen.getByText('Start New Registration');

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/LandingPage');
  });

  test('handles invalid JSON in localStorage gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('driverDetails', '{bad json');
    render(<ConfirmationPage />);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test('renders without crashing if no localStorage data', () => {
    render(<ConfirmationPage />);
    expect(screen.getByTestId('confirmation-page')).toBeInTheDocument();
    expect(screen.getByText('Driver Summary')).toBeInTheDocument();
  });
});
