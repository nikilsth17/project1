import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import usFlag from "../../assets/images/flags/us.svg";
import SimpleBar from "simplebar-react";
import { country } from "../../common/data";
import languages from "../../common/languages";
import { useTranslation } from "react-i18next";

const Country = () => {
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleLanguageChange = (langKey) => {
    setSelectedLanguage(langKey);
    i18n.changeLanguage(langKey);
  };

  return (
    <div className="d-flex justify-content-center align-items-center gap-2">
      <span className="fw-bold">{t("language")}:</span>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggleDropdown}
        className="topbar-head-dropdown header-item p-0"
      >
        <DropdownToggle
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle d-flex align-items-center"
          tag="button"
        >
          <img
            src={languages[selectedLanguage].flag}
            alt={languages[selectedLanguage].label}
            className="options-flagimg"
            height="15"
          />
        </DropdownToggle>

        <DropdownMenu className="notify-item language">
          <SimpleBar style={{ maxHeight: "300px" }}>
            {Object.entries(languages).map(([key, lang]) => (
              <DropdownItem
                key={key}
                onClick={() => handleLanguageChange(key)}
                className="d-flex align-items-center"
              >
                <img
                  src={lang.flag}
                  alt={lang.label}
                  className="me-2 options-flagimg"
                  height="14"
                />
                <span className="country-name">{lang.label}</span>
              </DropdownItem>
            ))}
          </SimpleBar>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default Country;

