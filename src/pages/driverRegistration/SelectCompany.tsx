import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import help_icon from "../../assets/help_icon.png";
import { useNavigate } from 'react-router-dom';
import relyingPartyService from '../../services/relyingPartyService';
import { Stepper } from '../../commans/Stepper';

export const SelectCompany: React.FC<SelectCompanyProps> = ({ }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [companies, setCompanies] = useState<Company[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [selectionPageContinueBtn, setSelectionPageContinueBtn] = useState(false);

    const { get_companiesList } = { ...relyingPartyService };

    // Fetch companies dynamically from backend
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const list = await get_companiesList();
                if (list) {
                    setCompanies(list);
                }
            } catch (e) {
                console.error("Failed to fetch companies:", e);
            }
        };
        fetchCompanies();
    }, []);

    const moveToVerifyUinPage = () => {
        setSelectionPageContinueBtn(true);
        if (selectedCompany) {
            localStorage.setItem('companySelected', JSON.stringify(selectedCompany));
        }
        navigate('/driverRegistrationProcessPage/verifyUINPage');
    };

    const filteredCompanies = companies.filter(company =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCompanySelect = (company: Company) => {
        setSelectedCompany(company);
        setSearchTerm(company.companyName);
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
                        <label
                            htmlFor="company-search"
                            className="flex items-center text-[13px] font-medium text-gray-700 mb-2"
                        >
                            {t('selectCompany.searchTransportCompany')}
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
                        />

                        {/* Dropdown */}
                        {showDropdown && filteredCompanies.length > 0 && (
                            <div className="absolute z-10 w-full mt-3 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredCompanies.map((company) => (
                                    <button
                                        key={company.id}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleCompanySelect(company)}
                                        className="w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="text-sm font-medium text-gray-900">
                                            {company.companyName}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected Company Details */}
                    {selectedCompany && (
                        <div
                            className={`${selectedCompany.registrationStatus === 'Active'
                                ? "bg-[#EFFDF5] border-green-200"
                                : "bg-[#FDEDED] border-red-200"
                                } border rounded-lg p-4 mb-4`}
                        >
                            <h4
                                className={`text-base font-semibold mb-3 ${selectedCompany.registrationStatus === 'Active'
                                    ? "text-[#007F41]"
                                    : "text-[#ea1e14]"
                                    }`}
                            >
                                {t('selectCompany.companyDetails')}
                            </h4>
                            <div>
                                <div>
                                    <span
                                        className={`text-[12px] font-semibold ${selectedCompany.registrationStatus === 'Active'
                                            ? "text-[#007F41]"
                                            : "text-[#ea1e14]"
                                            }`}
                                    >
                                        {t('selectCompany.selected')}
                                    </span>
                                    <span
                                        className={`text-[12px] ${selectedCompany.registrationStatus === 'Active'
                                            ? "text-[#007F41]"
                                            : "text-[#ea1e14]"
                                            }`}
                                    >
                                        {selectedCompany.companyName}
                                    </span>
                                </div>
                                <div>
                                    <span
                                        className={`text-[12px] font-semibold ${selectedCompany.registrationStatus === 'Active'
                                            ? "text-[#007F41]"
                                            : "text-[#ea1e14]"
                                            }`}
                                    >
                                        {t('selectCompany.licenseStatus')}
                                    </span>
                                    <span
                                        className={`text-[12px] ${selectedCompany.registrationStatus === 'Active'
                                            ? "text-[#007F41]"
                                            : "text-[#ea1e14]"
                                            }`}
                                    >
                                        {selectedCompany.registrationStatus === 'Active'
                                            ? t('selectCompany.activeText')
                                            : t('selectCompany.inActiveText')}
                                    </span>
                                </div>
                                <div>
                                    <span
                                        className={`text-[12px] font-semibold ${selectedCompany.registrationStatus === 'Active'
                                            ? "text-[#007F41]"
                                            : "text-[#ea1e14]"
                                            }`}
                                    >
                                        {t('selectCompany.registrationType')}
                                    </span>
                                    <span
                                        className={`text-[12px] ${selectedCompany.registrationStatus === 'Active'
                                            ? "text-[#007F41]"
                                            : "text-[#ea1e14]"
                                            }`}
                                    >
                                        {selectedCompany.registrationType}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    disabled={!selectedCompany || selectedCompany.registrationStatus === 'Inactive'}
                    onClick={moveToVerifyUinPage}
                    className={`${selectedCompany && selectedCompany.registrationStatus === 'Active'
                        ? "bg-[#006DE7] cursor-pointer"
                        : "bg-[#B0B0B0] cursor-default"
                        } w-[21%] text-xs font-[600] place-self-end py-2.5 text-center rounded-[5px] text-[#FFFFFF]`}
                >
                    {t('commans.continue')}
                </button>
            </div>
        </div>
    );
};

interface Company {
    id: string;
    companyName: string;
    registrationStatus: string;
    registrationType: string;
    licenseStatus?: string;
}

interface SelectCompanyProps { }
