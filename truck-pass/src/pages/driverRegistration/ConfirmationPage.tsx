import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confirmation_icon from '../../assets/confirmation_icon.png';
import user_photo from "../../assets/user_photo.png";
import { useTranslation } from 'react-i18next';
import eye_icon from "../../assets/eye_icon.png";
import eye_off from "../../assets/eye_off.png";
import { SuccessPopup } from '../../components/SuccessPopup';
import { Stepper } from '../../commans/Stepper';

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [showDetails, setShowDetails] = useState(true);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        setShowSuccessPopup(true);
        const timer = setTimeout(() => setShowSuccessPopup(false), 5000);
        return () => clearTimeout(timer);
    }, []);
    
    const displayValue = (value: string, alwaysVisible = false) =>
        showDetails || alwaysVisible ? value : '*'.repeat(value.length);


    const onStartNewRegistration = () => {
        navigate('/LandingPage')
    }

    return (
        <div className="flex w-[63%] shadow-lg rounded-2xl place-self-center">
            {showSuccessPopup && <SuccessPopup showSuccessPopup={showSuccessPopup} setShowSuccessPopup={setShowSuccessPopup} />}
            <Stepper
                consentStatus={true}
                selectCompanyStatus={true}
                uinVerificationStatus={true}
                registrationStatus={true}
                confirmationStatus={true}
            />
        <div className={`flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-1 rounded-br-2xl rounded-tr-2xl justify-between font-inter`}>
            <div className="flex flex-col items-center space-y-4">
                <img src={confirmation_icon} alt="confirmation_icon" className='h-14' />
                <h1 className="font-semibold text-[20px]">{t('confirmationPage.registrationCompleted')}</h1>
                <p className="text-[13px]">{t('confirmationPage.SuccessFullySubmitText')}</p>

                <div className="w-[90%] border border-[#E2E8F0] rounded-lg p-6">
                    <div className='flex gap-x-3 items-center'>
                        <img src={user_photo} alt="user_photo" className='h-20 pt-2' />
                        <div className='flex flex-col space-y-2 items-start'>
                            <h1 className='font-bold'>{t('confirmationPage.driverSummary')}</h1>
                            <p className='text-xs text-[#6B6B6B] font-[500]'>{t('confirmationPage.registrationDetailsInfo')}</p>
                        </div>
                        <button
                            onClick={() => setShowDetails(prev => !prev)}
                            className="text-sm font-medium text-[#006DE7] border border-[#006DE7] px-3 py-1 rounded-md"
                        >
                            {showDetails ? (
                            <>
                                <img src={eye_icon} alt='eye_icon' className='h-3 inline-block mr-1' />
                                Hide Details
                            </>
                            ) : (
                            <>
                                <img src={eye_off} alt='eye_off' className='h-4 inline-block mr-1' />
                                Show Details
                            </>
                        )}
                        </button>
                    </div>
                    <hr className='w-full border border-[#E5E5E5] my-4' />

                    <div className='flex flex-col'>
                        <ol className='pb-2'>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>{t('confirmationPage.fullName')}</p>
                                <p className='text-sm font-[500]'>{displayValue('Rajesh Singh')}</p>
                            </li>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>{t('confirmationPage.uin')}</p>
                                <p className='text-sm font-[500]'>{displayValue('198765432123')}</p>
                            </li>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>{t('confirmationPage.gender')}</p>
                                <p className='text-sm font-[500]'>{displayValue('Male')}</p>
                            </li>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>{t('confirmationPage.email')}</p>
                                <p className='text-sm font-[500]'>{displayValue('myemail@gmail.com')}</p>
                            </li>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>{t('confirmationPage.phoneNumber')}</p>
                                <p className='text-sm font-[500]'>{displayValue('+91 9876543210')}</p>
                            </li>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>{t('confirmationPage.city')}</p>
                                <p className='text-sm font-[500]'>{displayValue('Chandigarh')}</p>
                            </li>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>{t('confirmationPage.transportCompany')}</p>
                                <p className='text-sm font-[500]'>{displayValue('TransGlobal Logistics Ltd.')}</p>
                            </li>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>{t('confirmationPage.licenseNum')}</p>
                                <p className='text-sm font-[500]'>{displayValue('DL-9876543210')}</p>
                            </li>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>{t('confirmationPage.passportNumber')}</p>
                                <p className='text-sm font-[500]'>{displayValue('Z7654321')}</p>
                            </li>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>{t('confirmationPage.cpcCertificate')}</p>
                                <p className='text-sm font-[500]'>{displayValue('File Uploaded', true)}</p>
                            </li>
                        </ol>
                    </div>
                </div>
                <button onClick={onStartNewRegistration}
                    className={`bg-[#006DE7] w-[31%] cursor-pointer"} text-xs font-[600] py-2.5 px-2.5 mt-6 mr-9 place-self-end text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`}>
                    {t('confirmationPage.startNewRegistrationBtn')}
                </button>
            </div>
            </div>
        </div>
    )
}

interface ConfirmationPageProps {

}