import React, { useEffect, useState } from "react";

import { getLoggedInUser } from "../helpers/fakebackend_helper";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();

  const [isDashboard, setIsDashboard] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isFertility, setIsFertility] = useState(false);

  const [setttings, setSetttings] = useState(false);

  const [isUsers, setIsUsers] = useState(false);
  const authUser = getLoggedInUser();
  // console.log("authUserr", authUser);

  const isDriverLogin = authUser.user.user_type === "DRIVER";
  // const isDriverLogin = true;
  // console.log("isDriverLogin", isDriverLogin);
  const isAdmin = true;

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }

    if (iscurrentState !== "User") {
      setIsUser(false);
    }
    if (iscurrentState !== "Fertility") {
      setIsFertility(false);
    }
    if (iscurrentState !== "settings") {
      setSetttings(false);
    }
  }, [history, iscurrentState, isDashboard, setttings, isFertility, isUser]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-line",
      link: "/dashboard",
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
      },
    },
    {
      id: "User",
      label: "User",
      icon: "ri-group-line",
      link: "/user",
      click: (e) => {
        e.preventDefault();
        setIsUser(!isUser);
        setIscurrentState("User");
      },
    },
    {
      id: "Fertility",
      label: "Fertility",
      icon: "ri-group-line",
      link: "/fertility",
      click: (e) => {
        e.preventDefault();
        setIsFertility(!isUser);
        setIscurrentState("Fertility");
      },
    },
    //  {
    //    id: "Booking",
    //    label: "Bookings",
    //    icon: "ri-apps-2-line",
    //    link: "/bookings",
    //    click: (e) => {
    //      e.preventDefault();
    //      setIsDashboard(!isBooking);
    //     setIscurrentState("Booking");;
    //    },
    //  },
    // {
    //   id: "Package",
    //   label: "Packages",
    //   icon: "ri-apps-2-line",
    //   link: "/packages",
    //   click: (e) => {
    //     e.preventDefault();
    //     setIsDashboard(!isPackage);
    //     setIscurrentState("Package");
    //   },
    // },
    // {
    //   id: "Appointment",
    //   label: "Appointment",
    //   icon: "ri-calendar-line",
    //   link: "/appointment",
    //   parentId: "appointment",
    //   click: (e) => {
    //     e.preventDefault();
    //     setIsAppointment(!isAppointment);
    //     setIscurrentState("Appointment");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isAppointment,
    //   subItems: [
    //     {
    //       id: "Appointment List",
    //       label: "Appointment List",
    //       link: "/appointment",
    //       parentId: "appointment",
    //     },
    //     {
    //       id: "Calendar",
    //       label: "Calendar",
    //       link: "/apps-calendar",
    //       parentId: "appointment",
    //     },
    //   ],
    // },
    // {
    //   id: "Unavailable TimeSlot",
    //   label: "Unavailable TimeSlot",
    //   icon: "bx bx-user-pin",
    //   link: "/unavailable-time-slot",
    //   parentId: "Unavailable TimeSlot",
    //   click: (e) => {
    //     e.preventDefault();
    //     setIsUnavailable(!isUnavailable);
    //     setIscurrentState("Unavailable TimeSlot");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isUnavailable,
    //   subItems: [
    //     {
    //       id: "Unavailable TimeSlot List",
    //       label: "Unavailable TimeSlot List",
    //       link: "/unavailable-time-slot-list",
    //       parentId: "Unavailable TimeSlot",
    //     },
    //     {
    //       id: "Unavailable TimeSlot Form",
    //       label: "Unavailable TimeSlot Form",
    //       link: "/unavailable-time-slot",
    //       parentId: "Unavailable TimeSlot",
    //     },
    //   ],
    // },
    // {
    //   id: "weekly-schedule",
    //   label: "Schedule",
    //   icon: "bx bx-user-pin",
    //   link: "/weekly-schedule",
    //   parentId: "weekly-schedule",
    //   click: (e) => {
    //     e.preventDefault();
    //     setIsWeeklyReschedule(!isWeeklyReschedule);
    //     setIscurrentState("weekly-schedule");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isWeeklyReschedule,
    //   subItems: [
    //     // {
    //     //   id: "weekly-schedule",
    //     //   label: "Weekly Schedule",
    //     //   link: "/weekly-schedule",
    //     //   parentId: "weekly-schedule",
    //     // },
    //     {
    //       id: "/drivers/weekly-schedule",
    //       label: "Instructor Weekly Schedule",
    //       link: "/drivers/weekly-schedule",
    //       parentId: "weekly-schedule",
    //     },
    //     {
    //       id: "one-time-schedule",
    //       label: "One time Schedule",
    //       link: "/one-time-schedule",
    //       parentId: "weekly-schedule",
    //     },
    //   ],
    // },
    // {
    //   id: "weekly-schedule",
    //   label: "Weekly Schedule",
    //   icon: "ri-apps-2-line",
    //   link: "/weekly-schedule",
    //   click: (e) => {
    //     e.preventDefault();
    //     handleMenuClick("weekly-schedule");
    //   },
    // },
    // {
    //   id: "one-time-schedule",
    //   label: "One time Schedule",
    //   icon: "ri-apps-2-line",
    //   link: "/one-time-schedule",
    //   click: (e) => {
    //     e.preventDefault();
    //     handleMenuClick("one-time-schedule");
    //   },
    // },

    // {
    //   id: "payment-type",
    //   label: "Payment Type",
    //   icon: "ri-apps-2-line",
    //   link: "/payment-type",
    //   click: (e) => {
    //     e.preventDefault();
    //     handleMenuClick("payment-type");
    //   },
    // },
    // {
    //   id: "PaymentReport",
    //   label: "Payment Reports",
    //   icon: "ri-apps-2-line",
    //   link: "/payment-reports",
    //   click: (e) => {
    //     e.preventDefault();
    //     setIsDashboard(!isPaymentReport);
    //     setIscurrentState("Payment Report");
    //   },
    // },
    // {
    //   id: "SMS",
    //   label: "SMS",
    //   icon: "ri-apps-2-line",
    //   link: "/sms",
    //   click: (e) => {
    //     e.preventDefault();
    //     handleMenuClick("SMS");
    //   },
    // },
    // {
    //   id: "drivers",
    //   label: "Driving Instructor",
    //   icon: "ri-apps-2-line",
    //   link: "/drivers",
    //   click: (e) => {
    //     e.preventDefault();
    //     handleMenuClick("drivers");
    //   },
    // },
    // {
    //   id: "suburb",
    //   label: "Suburb",
    //   icon: "ri-apps-2-line",
    //   link: "/suburb",
    //   click: (e) => {
    //     e.preventDefault();
    //     handleMenuClick("suburb");
    //   },
    // },
    {
      id: "Settings",
      label: "Settings",
      icon: "ri-settings-5-line",
      link: "/settings",
      click: (e) => {
        e.preventDefault();
        handleMenuClick("Settings");
      },
    },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: "ri-settings-5-line",
    //   link: "/settings",
    //   parentId: "settings",
    //   click: (e) => {
    //     e.preventDefault();
    //     setSetttings(!setttings);
    //     setIscurrentState("settings");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: setttings,
    //   subItems: [
    //     {
    //       id: "contact-us",
    //       label: "Contact Us",
    //       link: "/contact-us",
    //       parentId: "setttings",
    //     },
    //     // {
    //     //   id: "one-time-schedule",
    //     //   label: "One time Schedule",
    //     //   link: "/one-time-schedule",
    //     //   parentId: "weekly-schedule",
    //     // },
    //   ],
    // },
  ];

  // if (isAdmin) {
  //   const usersSection = {

  //   };

  //   menuItems.push(usersSection);
  // }

  const filteredMenuItems = menuItems;

  return <React.Fragment>{filteredMenuItems}</React.Fragment>;
};

export default Navdata;
