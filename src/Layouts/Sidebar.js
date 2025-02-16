import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
//import logo
import logoSm from "../assets/images/cosmos.png";
import logoLight from "../assets/images/logo-light.png";
import logoDark from "../assets/images/cosmos.png";

//Import Components
import { Container } from "reactstrap";
import HorizontalLayout from "./HorizontalLayout";

const Sidebar = ({ layoutType }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    var verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener("click", function () {
        document.body.classList.remove("vertical-sidebar-enable");
      });
    }
  }, []);

  const toggleSidebarItem = (item) => {
    if (expandedItem === item) {
      setExpandedItem(null);
    } else {
      setExpandedItem(item);
    }
  };

  const addEventListenerOnSmHoverMenu = () => {
    if (
      document.documentElement.getAttribute("data-sidebar-size") === "sm-hover"
    ) {
      document.documentElement.setAttribute(
        "data-sidebar-size",
        "sm-hover-active"
      );
    } else if (
      document.documentElement.getAttribute("data-sidebar-size") ===
      "sm-hover-active"
    ) {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    } else {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    }
  };

  const sidebarItemStyle = {
    transition: "height 0.3s ease",
    overflow: "hidden",
  };

  return (
    <React.Fragment>
      <div className="app-menu navbar-menu bg-white">
        <div className="navbar-brand-box">
          <Link to="/dashboard" className="logo logo-dark">
            <span className="logo-sm color-black">
              {/* <img src={logoSm} alt="" height="45" /> */}
              {/* <img
                src={"/" + window.APP_CONFIG.tenent + "/logo.png"}
                alt=""
                height="45"
              /> */}
            </span>
            <span className="logo-lg test1 mx-2">
              {/* <img src={logoDark} alt="" height="60" /> */}
              {/* <img
                src={"/" + window.APP_CONFIG.tenent + "/logo.png"}
                alt=""
                height="40"
              /> */}
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              {/* <img src={logoSm} alt="" height="22" /> */}
            
              <img
                src={"/" + window.APP_CONFIG.tenent + "/logo.png"}
                alt=""
                height="22"
              />
            </span>
            <span className="logo-lg tet">
              {/* <img src={logoLight} alt="" height="17" /> */}
              <img
                src={"/" + window.APP_CONFIG.tenent + "/logo.png"}
                alt=""
                height="17"
              />
            </span>
          </Link>
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>

        <SimpleBar
          id="scrollbar"
          style={{ height: "100%", width: "100%" }} // Set the desired height and width inline
        >
          <Container fluid>
          
            <div id="two-column-menu"></div>
            <ul className="navbar-nav" id="navbar-nav">
              {/* <li>
                <div onClick={() => toggleSidebarItem("item1")}>
                  <span>Item 1</span>
                  {expandedItem === "item1" ? (
                    <div style={{ ...sidebarItemStyle, height: "auto" }}>
                      <p>Expanded content for Item 1</p>
                    </div>
                  ) : null}
                </div>
              </li>
              <li>
                <div onClick={() => toggleSidebarItem("item2")}>
                  <span>Item 2</span>
                  {expandedItem === "item2" ? (
                    <div style={{ ...sidebarItemStyle, height: "auto" }}>
                      <p>Expanded content for Item 2</p>
                    </div>
                  ) : null}
                </div>
              </li> */}
              <HorizontalLayout />
            </ul>
          </Container>
        </SimpleBar>
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;
