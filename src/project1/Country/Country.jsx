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

const Country = () => {
  const [seletedCountry4, setseletedCountry4] = useState({
    id: 240,
    flagImg: usFlag,
    countryName: "United States of America",
    countryCode: "+1",
  });
  const [dropdownOpen5, setDropdownOpen5] = useState(false);
  const toggle5 = () => setDropdownOpen5((prevState) => !prevState);

  return (
    <div className="d-flex justify-content-center align-items-center gap-2">
      <span className="fw-bold">Language:</span>
      <Dropdown
        isOpen={dropdownOpen5}
        toggle={toggle5}
        className="topbar-head-dropdown header-item p-0"
      >
        <DropdownToggle
          as="button"
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle d-flex align-items-center"
          tag="button"
        >
          <img
            src={seletedCountry4.flagImg}
            alt="country flag"
            className="options-flagimg"
            height="15"
          />
        </DropdownToggle>

        <DropdownMenu className="notify-item language">
          <SimpleBar style={{ maxHeight: "300px" }}>
            {(country || []).map((item, key) => (
              <DropdownItem
                as="li"
                onClick={() => setseletedCountry4(item)}
                key={key}
                className="d-flex "
              >
                <div className="me-2">
                  <img
                    src={item.flagImg}
                    alt="country flag"
                    className="options-flagimg"
                    height="14"
                  />
                </div>

                <div className="d-flex">
                  <div className="country-name">{item.countryName}</div>
                </div>
              </DropdownItem>
            ))}
          </SimpleBar>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default Country;
