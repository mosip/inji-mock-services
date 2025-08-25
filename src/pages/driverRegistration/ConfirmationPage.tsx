import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confirmation_icon from '../../assets/confirmation_icon.png';
import user_photo from "../../assets/user_photo.png";
import Hide_Details from "../../assets/Hide_Details.png";
import Show_Details from "../../assets/Show_Details.png";
import { useTranslation } from 'react-i18next';
import { SuccessPopup } from '../../components/SuccessPopup';
import { Stepper } from '../../commans/Stepper';

export const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showDetails, setShowDetails] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);

  useEffect(() => {
    try {
      const details = localStorage.getItem('driverDetails');
      const additionalFiles = localStorage.getItem('driverAdditionalFiles');

      if (details) {
        const driverDetails = JSON.parse(details);
        setConfirmationDetails(driverDetails);
      }

      if (additionalFiles) {
        const additionalDetails = JSON.parse(additionalFiles);
        setAdditionalInfo(additionalDetails);
      }
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
    }

    setShowSuccessPopup(true);
    const timer = setTimeout(() => setShowSuccessPopup(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const displayValue = (value: string | undefined, alwaysVisible = false) => {
    if (!value) return '-';
    return showDetails || alwaysVisible
      ? value
      : value.length <= 4
        ? '*'.repeat(value.length)
        : value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);
  };

  const onStartNewRegistration = () => {
    navigate('/landingPage');
  };

  const driverSummaryItems = [
    { id: 0, title: t('confirmationPage.fullName'), value: confirmationDetails?.fullName },
    { id: 1, title: t('confirmationPage.uin'), value: confirmationDetails?.uin },
    { id: 2, title: t('confirmationPage.gender'), value: confirmationDetails?.gender },
    { id: 3, title: t('confirmationPage.email'), value: confirmationDetails?.emailId },
    { id: 4, title: t('confirmationPage.phoneNumber'), value: confirmationDetails?.phoneNumber },
    { id: 5, title: t('confirmationPage.city'), value: confirmationDetails?.city },
    { id: 6, title: t('confirmationPage.transportCompany'), value: confirmationDetails?.transportCompany },
    { id: 7, title: t('confirmationPage.licenseNum'), value: confirmationDetails?.driverLicenseNum },
    { id: 8, title: t('confirmationPage.passportNumber'), value: confirmationDetails?.passportNum },
    { id: 9, title: t('confirmationPage.cpcCertificate'), value: t('confirmationPage.fileUploaded') }
  ];

  return (
    <div className="flex max-w-[1100px] w-full shadow-lg rounded-2xl place-self-center" data-testid="confirmation-page">
      {showSuccessPopup && (
        <SuccessPopup showSuccessPopup={showSuccessPopup} setShowSuccessPopup={setShowSuccessPopup} />
      )}

      <Stepper
        consentStatus
        selectCompanyStatus
        uinVerificationStatus
        registrationStatus
        confirmationStatus
      />

      <div className="flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter">
        <div className="flex flex-col items-center space-y-4">
          <img src={confirmation_icon} alt="confirmation_icon" className="h-14" />
          <h1 className="font-semibold text-[20px]">{t('confirmationPage.registrationCompleted')}</h1>
          <p className="text-[13px] text-center max-w-[600px] text-[#4B5563] px-4">
            {t('confirmationPage.SuccessFullySubmitText')}
          </p>

          <div className="w-[90%] border border-[#E2E8F0] rounded-lg p-6" data-testid="driver-summary">
            <div className="flex gap-x-3 items-center">
              {additionalInfo?.driverPicture ? (
                <img src={additionalInfo.driverPicture} alt="driver_user_icon" className="h-20 pt-2" />
              ) : (
                <img src={user_photo} alt="user_photo" className="h-20 pt-2" />
              )}
              <div className="flex flex-col space-y-2 items-start">
                <h1 className="font-bold">{t('confirmationPage.driverSummary')}</h1>
                <p className="text-xs text-[#6B6B6B] font-[500]">
                  {t('confirmationPage.registrationDetailsInfo', { driverName: confirmationDetails?.fullName || '' })}
                </p>
              </div>
              <button
                onClick={() => setShowDetails(prev => !prev)}
                className="text-sm font-medium text-[#414651] border border-[#FFFFFF] px-3 py-1 rounded-md ml-auto cursor-pointer"
              >
                {showDetails ? (
                  <>
                    <img src={Show_Details} alt="eye_icon" className="h-3 inline-block mr-1" />
                    {t('confirmationPage.hideDetails')}
                  </>
                ) : (
                  <>
                    <img src={Hide_Details} alt="eye_off" className="h-4 inline-block mr-1" />
                    {t('confirmationPage.showDetails')}
                  </>
                )}
              </button>
            </div>

            <hr className="w-full border border-[#E5E5E5] my-4" />

            {driverSummaryItems.map((item) => (
              <div key={item.id} className="flex flex-col">
                <ol className="pb-[12px] flex justify-between">
                  <p className="font-[600] text-[15px]">{item.title}</p>
                  <p className="font-[500] text-[15px]">{displayValue(item.value as string)}</p>
                </ol>
              </div>
            ))}
          </div>

          <button
            onClick={onStartNewRegistration}
            data-testid="new-registration-btn"
            className="bg-[#006DE7] w-[31%] text-xs font-[600] py-2.5 px-2.5 mt-6 mr-9 place-self-end text-center rounded-[5px] text-[#FFFFFF] cursor-pointer"
          >
            {t('confirmationPage.startNewRegistrationBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface AdditionalInfo {
  driverPicture: string;
  cpcFile: string;
}

interface ConfirmationDetails {
  picture?: string;
  fullName?: string;
  uin?: string;
  gender?: string;
  emailId?: string;
  city?: string;
  phoneNumber?: string;
  driverLicenseNum?: string;
  passportNum?: string;
  transportCompany?: string;
}
