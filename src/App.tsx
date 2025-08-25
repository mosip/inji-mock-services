import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/main.css';
import './i18';

// Landing & Layouts
import LandingPage from './pages/driverRegistration/LandingPage';
import DriverRegistrationProcess from './pages/driverRegistration/DriverRegistrationProcess';
import AppMainLayout from './shared/AppMainLayout';
import DriverRegistrationMainLayout from './shared/DriverRegistrationMainLayout';

// Driver Registration Pages
import { ConsentAndAgreementPage } from './pages/driverRegistration/ConsentAndAgreementPage';
import { SelectCompany } from './pages/driverRegistration/SelectCompany';
import { VerifyUIN } from './pages/driverRegistration/VerifyUIN';
import { Registration } from './pages/driverRegistration/Registration';
import { ConfirmationPage } from './pages/driverRegistration/ConfirmationPage';
import { DriverRegistrationFlow } from './shared/DriverRegistrationFlow';

// TruckPass Request Pages
import { Dashboard } from './pages/requestTruckPass/Dashboard';
import { NewTruckPassRequest } from './pages/requestTruckPass/NewTruckpassRequest';
import { ConsignmentDetails } from './pages/requestTruckPass/ConsignmentDetails';
import { VehicleDetails } from './pages/requestTruckPass/VehicleDetails';
import { JourneyDetails } from './pages/requestTruckPass/JourneyDetails';
import { ReviewPage } from './pages/requestTruckPass/ReviewPage';
import { DriverProfile } from './pages/requestTruckPass/DriverProfile';
import LoginPage from './pages/requestTruckPass/LoginPage';
import OtpVerificationPage from './pages/requestTruckPass/OtpVerificationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/landingPage" replace />} />

        {/* Landing Page */}
        <Route
          path="/landingPage"
          element={
            <DriverRegistrationMainLayout>
              <LandingPage />
            </DriverRegistrationMainLayout>
          }
        />

        {/* Driver Registration Process */}
        <Route
          path="/driverRegistrationProcessPage/consentAndAgreementPage"
          element={
            <DriverRegistrationMainLayout>
              <DriverRegistrationProcess>
                <DriverRegistrationFlow>
                  <ConsentAndAgreementPage />
                </DriverRegistrationFlow>
              </DriverRegistrationProcess>
            </DriverRegistrationMainLayout>
          }
        />
        <Route
          path="/driverRegistrationProcessPage/selectCompanyPage"
          element={
            <DriverRegistrationMainLayout>
              <DriverRegistrationProcess>
                <DriverRegistrationFlow>
                  <SelectCompany />
                </DriverRegistrationFlow>
              </DriverRegistrationProcess>
            </DriverRegistrationMainLayout>
          }
        />
        <Route
          path="/driverRegistrationProcessPage/verifyUINPage"
          element={
            <DriverRegistrationMainLayout>
              <DriverRegistrationProcess>
                <DriverRegistrationFlow>
                  <VerifyUIN />
                </DriverRegistrationFlow>
              </DriverRegistrationProcess>
            </DriverRegistrationMainLayout>
          }
        />
        <Route
          path="/driverRegistrationProcessPage/registrationPage"
          element={
            <DriverRegistrationMainLayout>
              <DriverRegistrationProcess>
                <DriverRegistrationFlow>
                  <Registration />
                </DriverRegistrationFlow>
              </DriverRegistrationProcess>
            </DriverRegistrationMainLayout>
          }
        />
        <Route
          path="/driverRegistrationProcessPage/confirmationPagePage"
          element={
            <DriverRegistrationMainLayout>
              <DriverRegistrationProcess>
                <DriverRegistrationFlow>
                  <ConfirmationPage />
                </DriverRegistrationFlow>
              </DriverRegistrationProcess>
            </DriverRegistrationMainLayout>
          }
        />

        {/* TruckPass Request Flow */}
        <Route
          path="/requestTruckpassProcess/requestedPassesDashboard"
          element={
            <AppMainLayout>
              <Dashboard />
            </AppMainLayout>
          }
        />
        <Route
          path="/requestTruckpassProcess/driverProfile"
          element={
            <AppMainLayout>
              <NewTruckPassRequest>
                <DriverProfile />
              </NewTruckPassRequest>
            </AppMainLayout>
          }
        />
        <Route
          path="/requestTruckpassProcess/consignmentDetails"
          element={
            <AppMainLayout>
              <NewTruckPassRequest>
                <ConsignmentDetails />
              </NewTruckPassRequest>
            </AppMainLayout>
          }
        />
        <Route
          path="/requestTruckpassProcess/vehicleDetails"
          element={
            <AppMainLayout>
              <NewTruckPassRequest>
                <VehicleDetails />
              </NewTruckPassRequest>
            </AppMainLayout>
          }
        />
        <Route
          path="/requestTruckpassProcess/journeyDetails"
          element={
            <AppMainLayout>
              <NewTruckPassRequest>
                <JourneyDetails />
              </NewTruckPassRequest>
            </AppMainLayout>
          }
        />
        <Route
          path="/requestTruckpassProcess/reviewPage"
          element={
            <AppMainLayout>
              <NewTruckPassRequest>
                <ReviewPage />
              </NewTruckPassRequest>
            </AppMainLayout>
          }
        />

        {/* TruckPass Auth Flow */}
        <Route
          path="/truckpasslogin"
          element={
            <DriverRegistrationMainLayout>
              <LoginPage />
            </DriverRegistrationMainLayout>
          }
        />
        <Route
          path="/truckpass-otp-verification"
          element={
            <DriverRegistrationMainLayout>
              <OtpVerificationPage />
            </DriverRegistrationMainLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/landingPage" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
