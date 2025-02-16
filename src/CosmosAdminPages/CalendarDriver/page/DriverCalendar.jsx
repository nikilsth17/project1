import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// import "../../Calendar/Calendar.css";
import {
  Card,
  CardBody,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import BootstrapTheme from "@fullcalendar/bootstrap";
import Flatpickr from "react-flatpickr";

//redux
import { useSelector, useDispatch } from "react-redux";

import {
  getEvents as onGetEvents,
  getCategories as onGetCategories,
  addNewEvent as onAddNewEvent,
  deleteEvent as onDeleteEvent,
  updateEvent as onUpdateEvent,
  resetCalendar,
} from "../../../slices/thunks";
import { createSelector } from "reselect";
import DeleteModal from "../../../Components/Common/DeleteModal";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import { events } from "../../common/data/calender";
import EventService from "../../../services/EventServices/EventService";
import Status from "../../Calendar/Status";
import { useNavigate } from "react-router-dom";
import RightOffCanvas from "../../Appointment/Component/RightOffCanvas";
import AppointmentService from "../../../services/AppointmentServices/AppointmentService";
import CalendarModal from "../../Calendar/Component/CalendarModal";
import AvailableModal from "../../Calendar/Component/AvailableModal";
import toast from "react-hot-toast";
import DriverRightOffCanvas from "../Component/DriverRightOffCanvas";
import DriverServices from "../../../services/DriverServices/DriverServices";
import Select from "react-select";
import AddAppointment from "../Component/AddAppointment";
import { formatDateTime } from "../../Appointment/Component/FormatDate";

const DriverCalender = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("🚀 ~ Calender ~ user:", user);
  const driverId = user?.user?.id;
  // console.log("🚀 ~ Calender ~ driverId:", driverId);
  const userType = user?.user?.user_type;

  const dispatch = useDispatch();
  const [event, setEvent] = useState([]);
  // console.log("eventcalendar", event);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedNewDay, setSelectedNewDay] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditButton, setIsEditButton] = useState(true);
  const [upcommingevents, setUpcommingevents] = useState([]);
  const [events, setEvents] = useState([]);
  // console.log("Events", events);

  const [filteredEvents, setFilteredEvents] = useState([]);
  // console.log("filteredEvents", filteredEvents);

  const calendarRef = useRef(null); // Create a ref for the calendar
  const [isRight, setIsRight] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [allowedStatus, setAllowedStatus] = useState("ALL");
  const [payStatus, setPayStatus] = useState("ALL");

  const [driverData, setDriverData] = useState([]);
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await DriverServices.get();
        setDriverData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDriver();
  }, []);
  const driverOptions = [
    { value: "all", label: "All" }, // Manually added option
    ...(driverData?.map((item) => ({
      value: item.id,
      label: `${item.name} ${item.surname}`,
    })) || []), // Existing options from driverData
  ];

  const [selectedDriver, setSelectedDriver] = useState(
    driverOptions.find((option) => option.value === "all") // Default to "All"
  );
  const toggleRightCanvas = () => {
    setIsRight(!isRight);
  };

  const refreshCalendar = () => {
    // Call fetchEvent to get the latest events after updating the event's start time
    const month = new Date().getMonth() + 1; // Get current month
    const year = new Date().getFullYear(); // Get current year

    // Fetch the events again to refresh the calendar
    fetchEvent(month, year);
    setRefreshKey((prevKey) => prevKey + 1); // Force re-render of calendar
    // console.log("Calendar refreshed with updated time");
  };

  // const scrollToCalendar = () => {
  //   if (calendarRef.current) {
  //     calendarRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  const selectLayoutState = (state) => state.Calendar;
  const calendarDataProperties = createSelector(selectLayoutState, (state) => ({
    events: state.events,
    categories: state.categories,
    isEventUpdated: state.isEventUpdated,
  }));
  // Inside your component
  const { categories, isEventUpdated } = useSelector(calendarDataProperties);
  // console.log("categories", categories);

  useEffect(() => {
    dispatch(onGetEvents());
    dispatch(onGetCategories());
    new Draggable(document.getElementById("external-events"), {
      itemSelector: ".external-event",
    });
  }, [dispatch]);

  useEffect(() => {
    if (isEventUpdated) {
      setIsEdit(false);
      setEvent({});
      setTimeout(() => {
        dispatch(resetCalendar("isEventUpdated", false));
      }, 500);
    }
  }, [dispatch, isEventUpdated]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const prevDateRef = useRef(currentDate); // Use a ref to track previous date

  // const handleDateChange = (dateInfo) => {
  //   // Capture the current date before changing it
  //   const previousDate = currentDate;

  //   // Check if the clicked button is "next" or "previous"
  //   if (dateInfo.start > previousDate) {
  //     console.log('next:',dateInfo);
  //     console.log('Next button clicked');
  //   } else {
  //     //console.log('pre:',dateInfo.startStr);
  //     console.log('Previous button clicked');
  //   }

  //   // Update the ref and state
  //   prevDateRef.current = previousDate;
  //   setCurrentDate(dateInfo.start);
  // };
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setEvent(null);
      setIsEdit(false);
      setIsEditButton(true);
    } else {
      setModal(true);
    }
  };
  const handleDateChange = (dateInfo) => {
    // Capture the current date before changing it
    const previousDate = currentDate;

    // Get the new month and year from the dateInfo
    const newStartDate = dateInfo.start; // This is the date the user clicked on

    // Create a new date that represents the first day of the selected month
    const firstDayOfMonth = new Date(
      newStartDate.getFullYear(),
      newStartDate.getMonth(),
      1
    );

    // Check if the clicked button is "next" or "previous"
    if (firstDayOfMonth > previousDate) {
      // console.log("Next month selected:", firstDayOfMonth);
      // console.log("Next button clicked");
    } else {
      // console.log("Previous month selected:", firstDayOfMonth);
      // console.log("Previous button clicked");
    }

    // Update the ref and state to the first day of the new month
    prevDateRef.current = previousDate;
    setCurrentDate(firstDayOfMonth); // Set the current date to the first day of the new month
  };

  function getTimeOnly(timestamp) {
    if (!timestamp) return ""; // Handle invalid input
    const date = new Date(timestamp.replace(" ", "T"));
    if (isNaN(date)) {
      // console.error("Invalid time format for timestamp:", timestamp);
      return ""; // Return empty or a default value if invalid
    }
    return date.toTimeString().split(" ")[0].slice(0, 5);
  }

  const fetchEvent = async (month, year) => {
    try {
      const response = await EventService.getList(month, year, driverId);

      if (response && Array.isArray(response.data)) {
        const sortedEvents = response.data.sort((o1, o2) => {
          const startTime1 = o1?.start_time;
          const startTime2 = o2?.start_time;

          // Sort events by start time
          if (!startTime1 || !startTime2) return 0;
          return new Date(startTime1) - new Date(startTime2);
        });

        console.log("🚀 ~ Sorted Events:", sortedEvents);

        // Format the sorted events to display in the calendar
        const formattedEvents = sortedEvents.map((event) => ({
          icon: "bx bx-dollar ",

          appointment: event.appointment,
          id: event.id,
          payment_symbol: `${
            event?.appointment?.appointment_status === "CONFIRMED" ? "✅" : ""
          }`,
          title: `${event.appointment?.customer?.name || "Unknown Customer"} `,

          fullName: `${
            event?.appointment?.appointment_status === "CONFIRMED" ? "✅" : ""
          }${event.appointment?.customer?.name || ""}${" "}${
            event.appointment?.customer?.surname || ""
          }-${getTimeOnly(event.start_time)}`,
          start_time: `${getTimeOnly(event.start_time)}`,
          end: event.end_time,

          start: new Date(event.start_time),
          className:
            event?.appointment?.package?.package_type === "DRIVING-TEST"
              ? "bg-dark-red text-white px-0 mx-0"
              : event?.appointment?.package?.package_type === "CUSTOM"
              ? "bg-dark text-white px-0 mx-0"
              : event.appointment?.appointment_status === "CANCELLED"
              ? "light-cancel px-0 mx-0"
              : // : event.status === "COMPLETED" && event?.payment_status === 1
              // ? "bg-success "
              event.status === "COMPLETED" && event?.payment_status !== 1
              ? "bg-calendar-yellow  text-white px-0 mx-0"
              : event?.payment_status === 1
              ? "bg-calendar-green text-white px-0 mx-0"
              : "bg-primary text-white px-0 mx-0",
          status: event.appointment?.payment_status,
          location: event.appointment?.pickup_location || "Unknown Location",
          allDay: false,
          appointment_status:
            event.appointment?.appointment_status || "Unknown Status",
          description: `Package: ${
            event.appointment?.package?.name || "Unknown Package"
          }`,
          completed_status: event?.status,
          payment_status: event?.payment_status,
        }));

        // Update the state with the new events
        setEvents(formattedEvents);
        setFilteredEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      // Optionally, provide user feedback, e.g., a toast or alert
      toast.error("Failed to fetch events. Please try again later.");
    }
  };

  // Function to filter events based on both payStatus and allowedStatus
  const applyFilters = (
    allEvents,
    payStatus,
    allowedStatus,
    selectedDriver
  ) => {
    return allEvents.filter((event) => {
      // Check Payment Status
      const matchesPayStatus =
        payStatus === "ALL" || event.status === payStatus;

      // Check Appointment Status
      const matchesAllowedStatus =
        allowedStatus === "ALL" ||
        event.appointment?.appointment_status === allowedStatus ||
        event.completed_status === allowedStatus;

      // Check Driver Selection
      const matchesDriver =
        !selectedDriver || selectedDriver.value === "all"
          ? true // Show all events if "All" is selected
          : event?.appointment?.driver_id === selectedDriver?.value;

      // Combine all filters
      return matchesPayStatus && matchesAllowedStatus && matchesDriver;
    });
  };

  // const togglePayStatus = (status) => {
  //   setPayStatus((prevStatus = []) => {
  //     const updatedPayStatus = prevStatus.includes(status)
  //       ? prevStatus.filter((s) => s !== status) // Remove status if already selected
  //       : [...prevStatus, status]; // Add status to the existing selection

  //     // Apply both filters after updating payStatus
  //     setEvents(
  //       applyFilters(
  //         filteredEvents,
  //         updatedPayStatus,
  //         allowedStatus,
  //         selectedDriver
  //       )
  //     );

  //     return updatedPayStatus; // Return the updated payStatus
  //   });
  // };

  const toggleAllowedStatus = (selectedValue) => {
    setAllowedStatus(selectedValue); // Update the selected appointment status
  };

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth() returns 0-based month, so we add 1
    const year = today.getFullYear();

    fetchEvent(month, year);
    // Fetch data for the current month and year
  }, []);

  useEffect(() => {
    console.log("EVENTS UPDATE", events);
  }, [events]);

  // useEffect(() => {
  //   fetchEvent();
  // }, []);

  /**
   * Handling the modal state
   */
  // const toggle = () => {
  //   if (modal) {
  //     setModal(false);
  //     setEvent(null);
  //     setIsEdit(false);
  //     setIsEditButton(true);
  //   } else {
  //     setModal(true);
  //   }
  // };
  /**
   * Handling date click on calendar
   */

  const [availableModal, setAvailableModal] = useState(false);

  const availableToggle = () => {
    if (availableModal) {
      setAvailableModal(false);
      setEvent(null);
      setIsEdit(false);
      setIsEditButton(true);
    } else {
      setAvailableModal(true); // Correctly toggle availableModal state
    }
  };

  let clickTimeout = null;

  const handleDateClick = (arg) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      const date = arg["date"];
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      const currectDate = new Date();
      const currentHour = currectDate.getHours();
      const currentMin = currectDate.getMinutes();
      const currentSec = currectDate.getSeconds();
      const modifiedDate = new Date(
        year,
        month,
        day,
        currentHour,
        currentMin,
        currentSec
      );

      const modifiedData = { ...arg, date: modifiedDate };

      setSelectedNewDay(date);
      setSelectedDay(modifiedData);
      // availableToggle();
      toggle();
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
      }, 200);
    }
  };

  const str_dt = function formatDate(date) {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var d = new Date(date),
      month = "" + monthNames[d.getMonth()],
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day + " " + month, year].join(",");
  };

  const date_r = function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = (arg) => {
    console.log("arg", arg);

    const event = arg.event;
    console.log("🚀 ~ handleEventClick ~ event:", event);
    const st_date = event.start;
    const ed_date = event.end;
    const r_date = str_dt(st_date);

    const er_date =
      ed_date == null
        ? date_r(st_date)
        : date_r(st_date) + " to " + date_r(ed_date);
    const appointment = event.extendedProps?.appointment || null;
    const status = event.extendedProps?.completed_status || null;
    const payment_status = event.extendedProps?.payment_status || null;

    setEvent({
      icon: event?.extendedProps.icon,

      appointment: appointment,
      id: event.id,
      title: event.title,
      fullName: event.extendedProps?.fullName,

      start: event.start,
      end: event.end,
      className: event.classNames,
      category: event.classNames[0],
      location: event._def.extendedProps.location,
      description: event._def.extendedProps.description,
      defaultDate: er_date,
      datetag: r_date,
      status: status,
      payment_status: payment_status,
    });

    // setIsEdit(true);
    // setIsEditButton(false);
    // toggle();
    // availableToggle();
    setIsRight(!isRight);
    setModalOpen(false);
  };
  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    dispatch(onDeleteEvent(event.id));
    setDeleteModal(false);
    toggle();
  };

  // events validation

  const submitOtherEvent = () => {
    document.getElementById("form-event").classList.remove("view-event");

    // document
    //   .getElementById("event-title")
    //   .classList.replace("d-none", "d-block");
    document
      .getElementById("event-category")
      .classList.replace("d-none", "d-block");
    document
      .getElementById("payment-category")
      .classList.replace("d-none", "d-block");
    document
      .getElementById("event-start-date")
      .parentNode.classList.remove("d-none");
    document
      .getElementById("event-start-date")
      .classList.replace("d-none", "d-block");
    document
      .getElementById("event-location")
      .classList.replace("d-none", "d-block");
    // document
    //   .getElementById("event-description")
    //   .classList.replace("d-none", "d-block");
    document
      .getElementById("event-start-date-tag")
      .classList.replace("d-block", "d-none");
    document
      .getElementById("event-location-tag")
      .classList.replace("d-block", "d-none");
    // document
    //   .getElementById("event-description-tag")
    //   .classList.replace("d-block", "d-none");

    setIsEditButton(true);
  };

  /**
   * On category darg event
   */
  const onDrag = (event) => {
    event.preventDefault();
  };

  /**
   * On calendar drop event
   */

  const onDrop = (event) => {
    const date = event["date"];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currectDate = new Date();
    const currentHour = currectDate.getHours();
    const currentMin = currectDate.getMinutes();
    const currentSec = currectDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );

    const draggedEl = event.draggedEl;
    const draggedElclass = draggedEl.className;
    if (
      draggedEl.classList.contains("external-event") &&
      draggedElclass.indexOf("fc-event-draggable") === -1
    ) {
      const modifiedData = {
        id: Math.floor(Math.random() * 1000),
        title: draggedEl.innerText,
        start: modifiedDate,
        className: draggedEl.className,
      };
      dispatch(onAddNewEvent(modifiedData));
    }
  };

  useEffect(() => {
    const newEvents = applyFilters(
      filteredEvents,
      payStatus,
      allowedStatus,
      selectedDriver
    );
    setEvents(newEvents);
  }, [allowedStatus, filteredEvents, payStatus, selectedDriver]);

  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for filter visibility

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev); // Toggle the filter visibility
  };

  // Automatically open filter on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsFilterOpen(true); // Open the filter for large screens
      } else {
        setIsFilterOpen(false); // Close the filter for small screens
      }
    };

    // Check screen size on initial load
    handleResize();

    // Add event listener to handle screen resizing
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // This function updates the specific event in the events array
  const updateEventInCalendar = (updatedEvent) => {
    console.log("updatedEvent", updatedEvent);
    setEvent((prevEvents) => {
      // Ensure prevEvents is an array
      if (!Array.isArray(prevEvents)) {
        return prevEvents; // Return unchanged if not an array
      }

      // Replace the event with the updated one in the array
      return prevEvents.map((evt) =>
        evt.id === updatedEvent.id ? updatedEvent : evt
      );
    });
  };

  const handleFormSubmit = (updatedEvent) => {
    fetchEvent();
  };

  const [appointmentDropdownOpen, setAppointmentDropdownOpen] = useState(false);

  const appointmentToggleDropdown = () =>
    setAppointmentDropdownOpen((prevState) => !prevState);

  const appointmentStatusOptions = [
    { label: "All", value: "ALL" },
    { label: "Scheduled", value: "SCHEDULED", className: "btn-warning" },
    { label: "Confirmed", value: "CONFIRMED", className: "btn-secondary" },
    { label: "Completed", value: "COMPLETED", className: "btn-success" },
  ];
  const getSelectedFiltersText = () => {
    const selectedOption = appointmentStatusOptions.find(
      (option) => option.value === allowedStatus
    );
    return selectedOption ? selectedOption.label : "All";
  };

  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);

  const paymentToggleDropdown = () =>
    setPaymentDropdownOpen((prevState) => !prevState);
  const togglePayStatus = (selectedValue) => {
    setPayStatus(selectedValue); // Update the selected payment status
  };

  const paymentStatusOptions = [
    { label: "All", value: "ALL" },
    { label: "Paid", value: "PAID", className: "btn-success" },
    { label: "Pending", value: "PENDING", className: "btn-warning" },
  ];
  const getPaymentSelectedFiltersText = () => {
    const selectedOption = paymentStatusOptions.find(
      (option) => option.value === payStatus
    );
    return selectedOption ? selectedOption.label : "Select Payment Status";
  };

  const handleDriverChange = (selectedOption) => {
    setSelectedDriver(
      selectedOption || driverOptions.find((option) => option.value === "all")
    );
    // console.log("Selected Driver:", selectedOption);
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);

  const toggleModal = () => setModalOpen(!modalOpen);

  // Handle hover start: set the timer to show the modal after 10 seconds
  const handleEventHoverStart = (info) => {
    setSelectedEvent(info.event);

    // Check if the device is mobile
    if (window.innerWidth > 768) {
      // Adjust the width according to your breakpoints
      const timer = setTimeout(() => {
        toggleModal();
      }, 2000);
      setHoverTimer(timer);
    } else {
      // Skip setting the timer for mobile
      toggleModal();
    }
  };

  // Handle hover end: clear the timer if the hover ends before 10 seconds
  const handleEventHoverEnd = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
  };
  const renderEventContent = (eventInfo) => {
    // const avatarPath =
    //   eventInfo.event.extendedProps?.appointment?.driver?.user?.avatar?.path ||
    //   avatar1;

    const isDayGridView =
      eventInfo.view.type === "dayGridMonth" ||
      eventInfo.view.type === "dayGridWeek";

    const isListWeekView =
      eventInfo.view.type === "listWeek" ||
      eventInfo.view.type === "dayGridDay";
    const isTimeGridWeek = eventInfo.view.type === "timeGridWeek";

    const containerStyle = isTimeGridWeek
      ? {
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "10px",
          width: "100%",
        }
      : {
          display: "flex",
          // flexDirection: isMobile && isDayGridView ? "column" : "row",
          justifyContent: isMobile && isDayGridView ? "" : "",
          alignItems: "center",
          gap: "2px",
          width: "100%",
          maxHeight: isMobile && isDayGridView ? "50px" : "",
          minHeight: isMobile && isDayGridView ? "50px" : "",
        };

    const titleStyle =
      isMobile && isTimeGridWeek
        ? {
            fontSize: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }
        : {
            fontWeight: isMobile && isDayGridView ? "bold" : "bold",
            fontSize: isMobile && isDayGridView ? "10px" : "12px",
            flex: 1,
            flexWrap: "wrap",
            display: isMobile && isDayGridView ? "flex" : "flex",
            flexDirection: isMobile && isDayGridView ? "column" : "row",
            justifyContent: isMobile && isDayGridView ? "center" : "start",
            alignItems: isMobile && isDayGridView ? "center" : "start",
            alignContent: isMobile && isDayGridView ? "center" : "start",
            minWidth: 0,
            // overflowWrap: "break-word",
            // wordBreak: "break-word",
            whiteSpace: "normal",
            textTransform: "capitalize",
            // maxHeight: isMobile && isDayGridView ? "60px" : "",
          };
    return (
      <div style={containerStyle}>
        <div style={titleStyle}>
          <span className="d-flex justify-content-center align-content-around align-items-center gap-1">
            {eventInfo?.event?.extendedProps?.payment_status === 1 && (
              <i
                className={eventInfo?.event?.extendedProps?.icon}
                style={{
                  fontSize: "14px",
                  fontWeight: "normal",
                  color: "white",
                }}
              ></i>
            )}
            {isDayGridView || isTimeGridWeek
              ? eventInfo?.event?.extendedProps?.payment_symbol
              : null}
          </span>
          <span style={{ textOverflow: "ellipsis" }}>
            {isListWeekView
              ? eventInfo.event.extendedProps?.fullName
              : eventInfo.event.title}
          </span>
          {(isDayGridView || isTimeGridWeek) && !isMobile ? "-" : ""}{" "}
          <span className="fw-normal">
            {isDayGridView || isTimeGridWeek
              ? eventInfo?.event?.extendedProps?.start_time
              : null}
          </span>
        </div>
      </div>
    );
  };
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid className="gx-3 gx-md-4 gx-lg-4">
          <BreadCrumb title="Appointment Calendar" pageTitle="Appointment" />
          <Row>
            <Col xs={12}>
              <Col lg={12}>
                <Row>
                  <Col
                    lg={3}
                    xs={8}
                    className="d-flex align-items-center mb-2 mt-1 mt-md-4"
                  >
                    <Row>
                      <Col lg={12} xs={10}>
                        <button
                          className="btn btn-primary w-100"
                          id="btn-new-event"
                          onClick={toggle}
                        >
                          <i className="mdi mdi-plus"></i>
                          {isEdit ? "Edit Booking" : "New Booking"}
                        </button>

                        <div id="external-events">
                          <br />
                          {categories &&
                            categories.map((category, i) => (
                              <div
                                className={`bg-${category.type}-subtle external-event fc-event text-${category.type}`}
                                key={"cat-" + category.id}
                                draggable
                                onDrag={(event) => {
                                  onDrag(event, category);
                                }}
                              >
                                <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2" />
                                {category.title}
                              </div>
                            ))}
                        </div>
                      </Col>
                      <Col xs={2}>
                        {/* Toggle Button for Filter Section - Only visible on small screens */}
                        <Button
                          onClick={toggleFilter}
                          size="sm"
                          className="mt-0 d-md-none"
                          style={{ border: "none" }}
                        >
                          {isFilterOpen ? (
                            <i
                              class="ri-filter-line"
                              style={{ fontSize: "20px" }}
                            ></i>
                          ) : (
                            // <i class='bx bxs-filter-alt' style={{fontSize:"20px"}}></i>
                            <i
                              class="ri-filter-off-line"
                              style={{ fontSize: "20px" }}
                            ></i>
                            // <i className="bx bx-filter-alt" style={{fontSize:"20px"}}></i>
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={9} xs={12}>
                    {/* Always show filter section on large screens */}
                    {(isFilterOpen || window.innerWidth >= 768) && (
                      <Row>
                        {/* Payment Status Section */}
                        <Col md={4}>
                          <p className="fs-5 text-center mb-0">
                            Payment Status
                          </p>

                          <Dropdown
                            isOpen={paymentDropdownOpen}
                            toggle={paymentToggleDropdown}
                            className="text-center"
                          >
                            <DropdownToggle
                              caret
                              className={`btn btn-md w-75 ${
                                paymentStatusOptions.find(
                                  (opt) => opt.value === payStatus
                                )?.className || "btn-secondary"
                              }`}
                            >
                              {getPaymentSelectedFiltersText()}
                            </DropdownToggle>
                            <DropdownMenu>
                              {paymentStatusOptions.map((status) => (
                                <div
                                  key={status.value}
                                  className={`dropdown-item ${
                                    status.className || ""
                                  }`}
                                  onClick={() => setPayStatus(status.value)}
                                >
                                  {status.label}
                                </div>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </Col>

                        {/* Appointment Status Section */}
                        <Col md={4}>
                          <p className="fs-5 text-center mb-0">
                            Appointment Status
                          </p>

                          <Dropdown
                            isOpen={appointmentDropdownOpen}
                            toggle={appointmentToggleDropdown}
                            className="text-center"
                          >
                            <DropdownToggle
                              caret
                              className={`btn btn-md w-75 ${
                                appointmentStatusOptions.find(
                                  (opt) => opt.value === allowedStatus
                                )?.className || "btn-secondary"
                              }`}
                            >
                              {getSelectedFiltersText()}
                            </DropdownToggle>
                            <DropdownMenu>
                              {appointmentStatusOptions.map((status) => (
                                <div
                                  key={status.value}
                                  className={`dropdown-item ${
                                    status.className || ""
                                  }`}
                                  onClick={() =>
                                    toggleAllowedStatus(status.value)
                                  }
                                >
                                  {status.label}
                                </div>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </Col>

              <Row>
                <Col xs={12} className="px-0 px-md-3 mt-2 mt-md-0 mx-0 mx-md-1">
                  {isMobile ? (
                    <div ref={calendarRef} className="bg-white py-4 mx-0 w-100">
                      <FullCalendar
                        eventContent={renderEventContent}
                        plugins={[
                          BootstrapTheme,
                          dayGridPlugin,
                          interactionPlugin,
                          listPlugin,
                          timeGridPlugin,
                        ]}
                        initialView={
                          window.matchMedia("(max-width: 468px)").matches
                            ? "dayGridWeek"
                            : "dayGridMonth"
                        }
                        firstDay={1} // Start the week on Monday
                        views={{
                          dayGridWeek: {
                            dayHeaderFormat: {
                              weekday: "short", // Mon, Tue, Wed
                              day: "2-digit", // 05, 06, 07
                              month: "2-digit", // 02, 03, 04
                            },
                          },
                          timeGridWeek: {
                            type: "timeGrid",
                            duration: { days: 7 }, // Custom 7-day view
                            slotDuration: "00:15:00", // 30-minute intervals
                            slotMinTime: "06:00:00",
                            slotMaxTime: "20:00:00",

                            allDaySlot: false, // Hide all-day section
                            slotLabelFormat: {
                              hour: "2-digit", // Ensures two-digit hours (05, 06, etc.)
                              minute: "2-digit", // Ensures two-digit minutes (00, 30, etc.)
                              hour12: false, // Uses 24-hour format (no AM/PM)
                            },
                          },
                        }}
                        locale="en-GB"
                        slotDuration={"00:30:00"}
                        handleWindowResize={true}
                        themeSystem="bootstrap"
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right:
                            "dayGridMonth,dayGridWeek,dayGridDay,listWeek,timeGridWeek",
                        }}
                        events={events}
                        // editable={true}
                        droppable={true}
                        selectable={true}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        drop={onDrop}
                        viewDidMount={(viewInfo) => {
                          localStorage.setItem(
                            "lastCalendarView",
                            viewInfo.view.type
                          );

                          if (viewInfo.start) {
                            const startDate = viewInfo.start;
                            const year = startDate.getFullYear();
                            const month = startDate.getMonth() + 1;
                            fetchEvent(month, year);
                          }
                        }}
                        datesSet={handleDateChange}
                        height={"auto"}
                        contentHeight={"auto"}
                        // eventMouseEnter={handleEventHoverStart}
                        // eventMouseLeave={handleEventHoverEnd}
                      />
                    </div>
                  ) : (
                    <Card className="card-h-100">
                      <CardBody className="px-1 px-md-3">
                        <div ref={calendarRef} className="w-100">
                          <FullCalendar
                            eventContent={renderEventContent}
                            plugins={[
                              BootstrapTheme,
                              dayGridPlugin,
                              interactionPlugin,
                              listPlugin,
                              timeGridPlugin,
                            ]}
                            initialView={
                              window.matchMedia("(max-width: 468px)").matches
                                ? "dayGridWeek"
                                : "dayGridMonth"
                            }
                            firstDay={1} // Start the week on Monday
                            views={{
                              dayGridWeek: {
                                dayHeaderFormat: {
                                  weekday: "short", // Mon, Tue, Wed
                                  day: "2-digit", // 05, 06, 07
                                  month: "2-digit", // 02, 03, 04
                                },
                              },
                              timeGridWeek: {
                                type: "timeGrid",
                                duration: { days: 7 }, // Custom 4-day view
                                slotDuration: "00:30:00",
                                slotMinTime: "06:00:00",
                                slotMaxTime: "20:00:00",
                                allDaySlot: false, // Hide all-day section
                                slotLabelFormat: {
                                  hour: "2-digit", // Ensures two-digit hours (05, 06, etc.)
                                  minute: "2-digit", // Ensures two-digit minutes (00, 30, etc.)
                                  hour12: false, // Uses 24-hour format (no AM/PM)
                                },
                              },
                            }}
                            locale="en-GB"
                            slotDuration={"00:15:00"}
                            handleWindowResize={true}
                            themeSystem="bootstrap"
                            headerToolbar={{
                              left: "prev,next today",
                              center: "title",
                              right:
                                "dayGridMonth,dayGridWeek,dayGridDay,listWeek,timeGridWeek",
                            }}
                            events={events}
                            // editable={true}
                            droppable={true}
                            selectable={true}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            drop={onDrop}
                            viewDidMount={(viewInfo) => {
                              localStorage.setItem(
                                "lastCalendarView",
                                viewInfo.view.type
                              );

                              if (viewInfo.start) {
                                const startDate = viewInfo.start;
                                const year = startDate.getFullYear();
                                const month = startDate.getMonth() + 1;
                                fetchEvent(month, year);
                              }
                            }}
                            datesSet={handleDateChange}
                            height={"auto"}
                            contentHeight={"auto"}
                            // eventMouseEnter={handleEventHoverStart}
                            // eventMouseLeave={handleEventHoverEnd}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </Col>
              </Row>

              <div style={{ clear: "both" }}></div>

              <DriverRightOffCanvas
                key={event?.id}
                isRight={isRight}
                toggleRightCanvas={toggleRightCanvas}
                event={event}
                setEvent={setEvent}
                onStatusChange={(updatedEvent) => {
                  updateEventInCalendar(updatedEvent); // Update the specific event
                  refreshCalendar(); // Force the calendar to refresh
                }}
                isEdit={isEdit}
                toggle={toggle}
              />
            </Col>
          </Row>
        </Container>
        <AddAppointment
          isOpen={modal}
          toggle={toggle}
          event={event}
          isEdit={isEdit}
          submitOtherEvent={submitOtherEvent}
          setSelectedNewDay={setSelectedNewDay}
          onFormSubmit={handleFormSubmit}
          setEvent={setEvent}
        />
        <AvailableModal
          availableModal={availableModal} // AvailableModal only opens when 'availableModal' is true
          availableToggle={availableToggle}
          event={event}
          isEdit={isEdit}
          setSelectedNewDay={setSelectedNewDay}
        />
      </div>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Event Details</ModalHeader>
        <ModalBody>
          {selectedEvent ? (
            <>
              <p>
                <strong>Event Title:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Start Time:</strong>{" "}
                {formatDateTime(selectedEvent.start)}
              </p>
              <p>
                {selectedEvent.extendedProps.description ||
                  "No description available"}
              </p>
            </>
          ) : (
            <p>Loading event details...</p>
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

DriverCalender.propTypes = {
  events: PropTypes.any,
  categories: PropTypes.array,
  className: PropTypes.string,
  onGetEvents: PropTypes.func,
  onAddNewEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onGetCategories: PropTypes.func,
};

export default DriverCalender;
