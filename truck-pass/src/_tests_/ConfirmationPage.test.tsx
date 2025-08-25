import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ConfirmationPage } from '../pages/driverRegistration/ConfirmationPage';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../commans/Stepper';
import { SuccessPopup } from '../components/SuccessPopup';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'confirmationPage.registrationCompleted': 'Registration Completed',
        'confirmationPage.SuccessFullySubmitText': 'You have successfully submitted your registration.',
        'confirmationPage.driverSummary': 'Driver Summary',
        'confirmationPage.registrationDetailsInfo': 'Details for driver: Rajesh Singh',
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
        'registration.DfullName': 'Rajesh Singh',
        'registration.Dgender': 'Male',
        'registration.Dcity': 'Chandigarh',
        'registration.Dcompany': 'TransGlobal Logistics Ltd.',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

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

describe('ConfirmationPage Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.useFakeTimers();
    (Stepper as jest.Mock).mockClear();
    (SuccessPopup as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('renders confirmation page elements correctly', () => {
    render(<ConfirmationPage />);
    console.log('Test 1: Rendering initial UI...');
    screen.debug();

    expect(screen.getByText('Registration Completed')).toBeInTheDocument();
    expect(screen.getByText('You have successfully submitted your registration.')).toBeInTheDocument();
    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.getByAltText('confirmation_icon')).toBeInTheDocument();
    expect(screen.getByAltText('user_photo')).toBeInTheDocument();
    expect(screen.getByText('Driver Summary')).toBeInTheDocument();
  });

  test('shows success popup on mount and hides after 5 seconds', async () => {
    render(<ConfirmationPage />);
    console.log('Test 2: Checking success popup...');
    screen.debug();

    expect(screen.getByTestId('success-popup')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      console.log('Test 2: Checking popup disappearance...');
      screen.debug();
      expect(screen.queryByTestId('success-popup')).not.toBeInTheDocument();
    }, { timeout: 6000 });
  });

  test('toggles driver summary details visibility', async () => {
    render(<ConfirmationPage />);
    console.log('Test 3: Checking initial details...');
    screen.debug();

    const hideDetailsButton = screen.getByText('Hide Details');
    expect(screen.getByText('Rajesh Singh')).toBeInTheDocument();
    expect(screen.getByText('198765432123')).toBeInTheDocument();
    expect(screen.getByText('myemail@gmail.com')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(hideDetailsButton);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      console.log('Test 3: Checking masked details...');
      screen.debug();
      expect(screen.getByText('19********23')).toBeInTheDocument();
      expect(screen.getByText('my*************om')).toBeInTheDocument();
      expect(screen.getByText('Show Details')).toBeInTheDocument();
    }, { timeout: 2000 });

    const showDetailsButton = screen.getByText('Show Details');

    await act(async () => {
      fireEvent.click(showDetailsButton);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      console.log('Test 3: Checking unmasked details...');
      screen.debug();
      expect(screen.getByText('Rajesh Singh')).toBeInTheDocument();
      expect(screen.getByText('198765432123')).toBeInTheDocument();
      expect(screen.getByText('myemail@gmail.com')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('displays driver summary items correctly', () => {
    render(<ConfirmationPage />);
    console.log('Test 4: Checking driver summary items...');
    screen.debug();

    const items = [
      'Full Name',
      'UIN',
      'Gender',
      'Email',
      'Phone Number',
      'City',
      'Transport Company',
      'License Number',
      'Passport Number',
      'CPC Certificate',
    ];

    items.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    expect(screen.getByText('Rajesh Singh')).toBeInTheDocument();
    expect(screen.getByText('198765432123')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('myemail@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('+91 9876543210')).toBeInTheDocument();
    expect(screen.getByText('Chandigarh')).toBeInTheDocument();
    expect(screen.getByText('TransGlobal Logistics Ltd.')).toBeInTheDocument();
    expect(screen.getByText('DL-9876543210')).toBeInTheDocument();
    expect(screen.getByText('Z7654321')).toBeInTheDocument();
    expect(screen.getByText('File Uploaded')).toBeInTheDocument();
  });

  test('navigates to LandingPage on start new registration button click', async () => {
    render(<ConfirmationPage />);
    console.log('Test 5: Checking navigation...');
    screen.debug();

    const startNewButton = screen.getByText('Start New Registration');

    await act(async () => {
      fireEvent.click(startNewButton);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/LandingPage');
    }, { timeout: 2000 });
  });
});