import { Link } from "react-router-dom";
import truckpass_title from "../assets/truck_pass_title.png";
import globe_icon from "../assets/globe_icon.png";
import dropdown_icon from "../assets/Dropdown_icon.png";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Française" },
  { code: "es", label: "Española" },
  { code: "hi", label: "हिन्दी" },
];

const NavBar: React.FC = () => {
  const [dropdown, setDropdown] = useState(false);
  const [language, setLanguage] = useState("English");

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string, label: string) => {
    i18n.changeLanguage(lng);
    setLanguage(label);
    localStorage.setItem("appLanguage", lng);
    localStorage.setItem("languageOpt", label);
    setDropdown(false);
  };

  useEffect(() => {
    const savedLng = localStorage.getItem("appLanguage");
    const savedLabel = localStorage.getItem("languageOpt");

    if (savedLng && savedLabel) {
      i18n.changeLanguage(savedLng);
      setLanguage(savedLabel);
    }
  }, [i18n]);

  return (
    <nav className="flex justify-between items-center h-auto my-5 bg-white px-[5%] text-black font-inter">
      <img
        src={truckpass_title}
        alt="truckpassTitle"
        className="h-4 lg:h-[20px]"
      />

      <div className="flex space-x-8 items-center text-[15px]">
        <Link
          to="/"
          id="home"
          className="cursor-pointer font-[400] text-sm"
        >
          {t("navbar.home")}
        </Link>
        <p
          id="help"
          className="cursor-pointer font-[400] text-sm"
        >
          {t("navbar.help")}
        </p>

        {/* Language Dropdown */}
        <div className="relative flex gap-x-1.5 items-center">
          <img src={globe_icon} alt="globe_icon" className="h-5" />
          {language}
          <div className="flex flex-col items-center">
            <button
              type="button"
              className={`h-[6px] ${dropdown ? "rotate-180" : ""} cursor-pointer duration-700 bg-transparent border-none p-0`}
              onClick={() => setDropdown((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={dropdown}
            >
              <img src={dropdown_icon} alt="dropdown" />
            </button>

            {dropdown && (
              <div
                className="flex flex-col absolute w-36 p-2 mt-4.5 right-0 
                bg-[#EEF5FB] border border-[#C9E0F7]
                space-y-1 rounded-lg shadow-xl z-50 transition"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`
                      cursor-pointer px-4 py-2 text-[15px] rounded-md text-left font-medium transition
                      ${
                        language === lang.label
                          ? "bg-[#C3DCF6] text-[#0065BA] font-semibold"
                          : "text-[#223245] hover:bg-[#E0ECFA]"
                      }
                    `}
                    onClick={() => changeLanguage(lang.code, lang.label)}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
