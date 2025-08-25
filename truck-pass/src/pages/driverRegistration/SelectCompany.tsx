import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import help_icon from "../../assets/help_icon.png";
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../commans/Stepper';

export const SelectCompany: React.FC<SelectCompanyProps> = ({ }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const companies: Company[] = useMemo(() => [
        { id: '1', name: t('selectCompany.companyNames.transGlobal1'), licenseStatus: t('selectCompany.activeAndValid'), registrationType: t('selectCompany.commercialTransport') },
        { id: '2', name: t('selectCompany.companyNames.transGlobalLogistics'), licenseStatus: t('selectCompany.activeAndValid'), registrationType: t('selectCompany.commercialTransport') },
        { id: '3', name: t('selectCompany.companyNames.transGlobal2'), licenseStatus: t('selectCompany.activeAndValid'), registrationType: t('selectCompany.commercialTransport') },
        { id: '4', name: t('selectCompany.companyNames.transGlobal3'), licenseStatus: t('selectCompany.activeAndValid'), registrationType: t('selectCompany.commercialTransport') },
        { id: '5', name: t('selectCompany.companyNames.transGlobal4'), licenseStatus: t('selectCompany.activeAndValid'), registrationType: t('selectCompany.commercialTransport') },
        { id: '6', name: t('selectCompany.companyNames.globalExpress'), licenseStatus: t('selectCompany.activeAndValid'), registrationType: t('selectCompany.commercialTransport') },
        { id: '7', name: t('selectCompany.companyNames.internationalFreight'), licenseStatus: t('selectCompany.activeAndValid'), registrationType: t('selectCompany.commercialTransport') },
    ], [t]);


    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [selectionPageContinueBtn, setSelectionPageContinueBtn] = useState(false);

    const moveToVerifyUinPage = () => {
        setSelectionPageContinueBtn(true);
        navigate('/driverRegistrationProcessPage/verifyUINPage');
    };

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCompanySelect = (company: Company) => {
        setSelectedCompany(company);
        setSearchTerm(company.name);
        setShowDropdown(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (!value) setSelectedCompany(null);
        setShowDropdown(true);
    };

    const handleSearchBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
        }, 150);
    };

    return (
        <div className="flex w-[63%] shadow-lg rounded-2xl place-self-center">
            <Stepper
                consentStatus={true}
                selectCompanyStatus={selectionPageContinueBtn}
                uinVerificationStatus={false}
                registrationStatus={false}
                confirmationStatus={false}
            />
            <div className="flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter">
                <div className="space-y-4">
                    <h1 className="font-semibold text-[22px]">{t('selectCompany.selectRegisteredTransportCompany')}</h1>
                    <p className="text-[15px]">{t('selectCompany.chooseCompanyDesc')}</p>

                    <div className="relative mb-6">
                        <label htmlFor="company-search" className="flex items-center text-[13px] font-medium text-gray-700 mb-2">
                            {t('selectCompany.description')}
                            <span className="text-[#006DE7] pl-1">*</span>
                            <img src={help_icon} className="h-3 cursor-pointer px-1" alt="help icon" />
                        </label>

                        <input
                            id="company-search"
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={handleSearchBlur}
                            placeholder={t('selectCompany.inputPlaceholder')}
                            className="w-full p-2.5 border border-[#D5D7DA] rounded-lg text-sm outline-none focus:shadow-sm focus:shadow-[#D5D7DA] transition-all"
                            aria-autocomplete="list"
                            aria-controls="company-list"
                        />

                        {showDropdown && filteredCompanies.length > 0 && (
                            <div id="company-list" className="absolute z-10 w-full mt-3 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredCompanies.map((company) => (
                                    <button
                                        key={company.id}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleCompanySelect(company)}
                                        className="w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedCompany && (
                        <div className="bg-[#EFFDF5] border border-green-200 rounded-lg p-4 mb-4">
                            <h4 className="text-base font-semibold text-[#007F41] mb-3">{t('selectCompany.companyDetails')}</h4>
                            <div>
                                <div>
                                    <span className="text-[12px] font-semibold text-[#007F41]">{t('selectCompany.selected')}</span>
                                    <span className="text-[12px] text-[#007F41]"> {selectedCompany.name}</span>
                                </div>
                                <div>
                                    <span className="text-[12px] font-semibold text-[#007F41]">{t('selectCompany.licenseStatus')}</span>
                                    <span className="text-[12px] text-[#007F41]"> {selectedCompany.licenseStatus}</span>
                                </div>
                                <div>
                                    <span className="text-[12px] font-semibold text-[#007F41]">{t('selectCompany.registrationType')}</span>
                                    <span className="text-[12px] text-[#007F41]"> {selectedCompany.registrationType}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    disabled={!selectedCompany}
                    onClick={moveToVerifyUinPage}
                    className={`${selectedCompany ? "bg-[#006DE7] cursor-pointer" : "bg-[#B0B0B0]"} w-[21%] text-xs font-[600] place-self-end py-2.5 text-center rounded-[5px] text-[#FFFFFF]`}
                >
                    {t('commans.continue')}
                </button>
            </div>
        </div>
    );
};

interface Company {
    id: string;
    name: string;
    licenseStatus: string;
    registrationType: string;
}

interface SelectCompanyProps { }
