import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Label, Input, Button } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { Triangle } from "react-loader-spinner";
import OneTimeService from "../../../services/OnetimeScheduleService/OneTimeService";
import PackageService from "../../../services/PackageServices/PackageService";
import SlotButton from "../../Calendar/Component/SlotButton";
import {
  formatDate,
  formatDateTime,
} from "../../Appointment/Component/FormatDate";
// import AddressSelect from "./SelectAddress";
import DriverServices from "../../../services/DriverServices/DriverServices";
import SuburbService from "../../../services/SuburbServices/SuburbService";

const DriverSlotDate = ({
  selectedPackage,
  onSelectedSlotsChange,
  onAddress,
  driver,
  setDriver,
  suburb,
  setSuburb,
  setDuration,
  duration,
}) => {
  // console.log("🚀 ~ selectedPackage:", selectedPackage);

  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("🚀 ~ Calender ~ user:", user);
  const driverId = user?.user?.id;
  const [suburbData, setSuburbData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  console.log("🚀 ~ driverData:", driverData);
  // const [isDriverSelectDisabled, setIsDriverSelectDisabled] = useState(false);

  const session = selectedPackage?.session_duration;
  // const [duration, setDuration] = useState(1);
  useEffect(() => {
    if (session === 2) {
      setDuration(2);
    }
  }, [session]);
  const [address, setAddress] = useState();

  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState({});
  const [showSlots, setShowSlots] = useState(false); // New state to manage visibility
  const [loadingDate, setLoadingDate] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);

  const [selectedSlots, setSelectedSlots] = useState({});
  // console.log("selectedsLOts", selectedSlots);
  const [showConfirmationCard, setShowConfirmationCard] = useState(false);
  const [totalSelectedSlots, setTotalSelectedSlots] = useState([]);

  useEffect(() => {
    // Pass updated totalSelectedSlots to the parent component whenever it changes
    if (onSelectedSlotsChange) {
      onSelectedSlotsChange(totalSelectedSlots);
    }
  }, [totalSelectedSlots, onSelectedSlotsChange]);

  useEffect(() => {
    // Pass updated totalSelectedSlots to the parent component whenever it changes
    if (onAddress) {
      onAddress(address);
    }
  }, [address, onAddress]);

  const totalLessons = selectedPackage?.course_duration;

  const renderSlots = (slots, period) => {
    return slots?.map((slot, index) => (
      <SlotButton
        key={`${period}-${index}`}
        slot={slot}
        selectedSlots={selectedSlots}
        onClick={handleSlotClick}
        selectedDate={selectedDate}
        totalSelectedSlots={totalSelectedSlots} // Pass totalSelectedSlots to SlotButton
      />
    ));
  };

  const fetchSlotsData = async () => {
    try {
      const formattedDate = selectedDate
        ? new Date(selectedDate).toISOString().split("T")[0]
        : "";

      // Duration is already a number, no need to convert it
      const durationNumber = duration;

      // Set loadingTime to true while fetching time slots
      setLoadingTime(true);

      // Fetch available time slots
      const response = await PackageService.getSlot({
        date: formattedDate,
        duration: durationNumber,
        driver: driverId,
      });
      // console.log("🚀 ~ fetchSlotsData ~ response:", response);

      // Set the fetched time slots into state
      setTimeSlots(response.data);

      // Stop loading states
      setLoadingTime(false);
      setLoadingDate(false);
    } catch (error) {
      // console.error("Error fetching slots data:", error);

      // Stop loading states on error
      setLoadingTime(false);
      setLoadingDate(false);
    }
  };

  useEffect(() => {
    if (duration && selectedDate) {
      fetchSlotsData();
    }
  }, [duration, selectedDate, driver]);

  useEffect(() => {
    if (address || selectedDate || selectedSlots.length) {
      setShowSlots(true);
    } else {
      setShowSlots(false);
    }
  }, [selectedDate, selectedSlots]);

  // const handleContinueClick = () => {
  //   const bookingData = {
  //     address: address.label,
  //     duration,
  //     selectedDate,
  //     totalSelectedSlots,
  //     selectedPackage,
  //   };
  // };

  const handleSlotDelete = (slotToDelete) => {
    const updatedSlots = totalSelectedSlots.filter(
      (slot) => slot.id !== slotToDelete.id
    );

    setTotalSelectedSlots(updatedSlots);

    // Disable the Continue button if the number of slots is less than totalLessons
    setIsContinueEnabled(updatedSlots.length === totalLessons);
  };

  const [isNextDisabled, setIsNextDisabled] = useState(true); // Initially, Next is disabled
  const [isContinueEnabled, setIsContinueEnabled] = useState(false); // Initially, Continue is disabled

  const handleSlotClick = (slot) => {
    const isSlotAlreadySelected = totalSelectedSlots.some(
      (selectedSlot) => selectedSlot.id === slot.id
    );

    if (isSlotAlreadySelected) {
      return; // Prevent selecting the same slot again
    }

    if (selectedPackage?.course_duration === 1) {
      // If the course duration is 1, only allow one slot to be selected at a time
      const updatedSlot = {
        ...slot,
        date: selectedDate,
      };

      setTotalSelectedSlots([updatedSlot]); // Replace the previously selected slot
      setSelectedSlots(updatedSlot); // Set the current slot as selected
      setIsContinueEnabled(true); // Enable the Continue button
      setShowConfirmationCard(true); // Show confirmation card
      setIsNextDisabled(true); // Next button should be disabled when only one slot is needed
    } else {
      // For other course durations
      if (selectedSlots?.id === slot.id) {
        setSelectedSlots({});
      } else {
        setSelectedSlots(slot);
      }

      setIsNextDisabled(false);
      setShowConfirmationCard(true);
    }
  };

  const handleNextClick = () => {
    if (selectedDate && Object.keys(selectedSlots).length > 0) {
      const updatedSlot = {
        ...selectedSlots,
        date: selectedDate,
      };

      setTotalSelectedSlots((prevTotalSlots) => {
        const updatedTotalSlots = [...prevTotalSlots, updatedSlot];

        // For course duration of 1, enable Continue and skip Next button
        if (selectedPackage.course_duration === 1) {
          setIsNextDisabled(true);
        } else if (updatedTotalSlots.length === totalLessons) {
          setIsNextDisabled(true);
          setIsContinueEnabled(true);
        }

        return updatedTotalSlots;
      });
      // setIsDriverSelectDisabled(true);

      setSelectedSlots({});
      setIsNextDisabled(true);
      setShowConfirmationCard(true);
    }
  };
  useEffect(() => {
    // Reset the Next button when suburb changes
    // setIsDriverSelectDisabled(false);
    setTotalSelectedSlots([]);
    handleNextClick();
  }, [suburb]);

  useEffect(() => {
    // Enable the Continue button only if the total lessons are selected
    setIsContinueEnabled(totalSelectedSlots.length === totalLessons);
  }, [totalSelectedSlots, totalLessons]); // Watch for changes in totalSelectedSlots and totalLessons

  const [oneTimeData, setOneTimeData] = useState([]);
  // console.log("oneTimeData", oneTimeData);

  const [disabledDates, setDisabledDates] = useState([]); // State to manage disabled dates
  // console.log("disabledDates", disabledDates);
  const flatpickrRef = useRef(null);

  const fetchDisabledDates = async () => {
    try {
      const response = await OneTimeService.get();
      // console.log("one-time-response", response);
      setOneTimeData(response);

      // Filter out unavailable dates
      const datesToDisable =
        response.data?.flatMap((item) =>
          item.dates
            .filter((dateObj) => dateObj.is_available === 0)
            .map((dateObj) => dateObj.date)
        ) || [];

      setDisabledDates(datesToDisable);
    } catch (error) {
      // console.log(error.response);
      // console.log(error);
    }
  };

  // useEffect(() => {
  //   fetchDisabledDates(); // Fetch disabled dates when the component mounts

  //   // Clean up Flatpickr instance on unmount
  //   return () => {
  //     if (flatpickrRef.current) {
  //       flatpickrRef.current.flatpickr.destroy();
  //     }
  //   };
  // }, []);

  // =============================== suburb and driver functionality======================================================

  useEffect(() => {
    if (!suburb) {
      setDriver(null); // Reset driver if suburb is not selected
      return;
    }

    const filteredDrivers = driverData.drivers?.filter(
      (driver) => driver.suburbId === suburb
    );

    if (filteredDrivers?.length) {
      const defaultDriver = filteredDrivers[0];
      setDriver({
        id: defaultDriver.id,
        name: `${defaultDriver.name} ${defaultDriver.surname}`,
      });
    } else {
      setDriver(null); // No drivers for the selected suburb
    }
  }, [suburb, driverData]);

  const fetchSuburb = async () => {
    try {
      const response = await SuburbService.get(); // Fetch suburb data
      setSuburbData(response.data);
    } catch (error) {
      console.error("Error fetching suburbs:", error);
    }
  };

  const fetchDriverBySuburb = async (suburbId) => {
    try {
      if (!suburbId) {
        setDriverData([]); // Clear driver data if no suburb is selected
        return;
      }
      const response = await DriverServices.getBySuburb(suburbId);
      console.log("🚀 ~ fetchDriverBySuburb ~ response:", response);
      setDriverData(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  // Fetch suburbs initially
  useEffect(() => {
    fetchSuburb();
  }, []);

  // Fetch drivers whenever suburb changes
  useEffect(() => {
    fetchDriverBySuburb(suburb);
  }, [suburb]);

  // ========================= Available date in calendar ===================================
  const [availableDate, setAvailableDate] = useState([]);
  console.log("🚀 ~ useEffect ~ availableDate:", availableDate);
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await PackageService.getAvailable({
          driver: driverId,
        });

        setAvailableDate(response.data);
      } catch (error) {
        console.error("Error fetching available dates:", error);
      }
    };

    fetchAvailableDates();
  }, [driver]);

  // useEffect(() => {
  //   if (!availableDate) return;

  //   flatpickrRef.current.flatpickr.redraw();
  // }, [availableDate, driver]);
  return (
    // <Container fluid>
    <div>
      <Row className="">
        {loadingDate ? ( // Show the loader while data is loading
          <Row
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <div className="d-flex flex-column justify-content-center align-items-center">
              <Triangle
                visible={true}
                height="60"
                width="60"
                color="#5B71B9"
                ariaLabel="triangle-loading"
                wrapperStyle={{ display: "block" }}
                wrapperClass=""
              />
              <h5 className="mt-1">Loading...</h5>
            </div>
          </Row>
        ) : (
          // Show this block when showSlots is true

          <Row>
            {/* <Col md={6} xs={12} className="mb-3">
                <AddressSelect
                  address={address}
                  setAddress={setAddress}
                  selectedPackage={selectedPackage}
                />
              </Col> */}
            {selectedPackage?.is_admin_package === 0 && (
              <Col md={6} xs={12} className="mb-2">
                <Label>Calendar</Label>
                <Flatpickr
                  ref={flatpickrRef}
                  placeholder="Select a pickup date"
                  className="form-control"
                  options={{
                    noCalendar: false,
                    inline: false,
                    altInput: true,
                    altFormat: "j-m-Y",
                    dateFormat: "Y-m-d",
                    minDate: "today",
                    enable: availableDate.map((date) => date.date), // Enable all available dates
                    onDayCreate: (dObj, dStr, fp, dayElem) => {
                      const formatDate = (dateObj) => {
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const day = String(dateObj.getDate()).padStart(2, "0");
                        return `${year}-${month}-${day}`;
                      };

                      const dateStr = formatDate(dayElem.dateObj);
                      const dateInfo = availableDate.find(
                        (date) => date.date === dateStr
                      );

                      if (dateInfo) {
                        if (dateInfo.available) {
                          dayElem.classList.add("available-date"); // Green for available
                        } else {
                          dayElem.classList.add(
                            "unavailable-date",
                            "clickable-unavailable-date"
                          ); // Red for unavailable
                        }
                      }
                    },
                    onClose: (selectedDates) => {
                      if (selectedDates.length) {
                        const selectedDate = selectedDates[0];
                        const formattedDate = `${selectedDate.getFullYear()}-${String(
                          selectedDate.getMonth() + 1
                        ).padStart(2, "0")}-${String(
                          selectedDate.getDate()
                        ).padStart(2, "0")}`;

                        const dateInfo = availableDate.find(
                          (date) => date.date === formattedDate
                        );

                        if (dateInfo && !dateInfo.available) {
                          console.log(
                            "Selected an unavailable date. You may proceed with custom logic.",
                            formattedDate
                          );
                          // Handle unavailable date logic here if needed
                        }
                      }
                    },
                  }}
                  onChange={(date) => {
                    if (date.length) {
                      const selectedDate = date[0];
                      const formattedDate = `${selectedDate.getFullYear()}-${String(
                        selectedDate.getMonth() + 1
                      ).padStart(2, "0")}-${String(
                        selectedDate.getDate()
                      ).padStart(2, "0")}`;

                      setSelectedDate(formattedDate);
                      setLoadingTime(true);
                    } else {
                      setSelectedDate(null);
                    }
                  }}
                />
              </Col>
            )}
            {selectedPackage?.is_admin_package === 0 ? (
              <Col md={12}>
                <Row>
                  <Col md={6} xs={12} className="">
                    {loadingTime ? (
                      <Row
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "50vh" }}
                      >
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <Triangle
                            visible={true}
                            height="60"
                            width="60"
                            color="#5B71B9"
                            ariaLabel="triangle-loading"
                            wrapperStyle={{ display: "block" }}
                            wrapperClass=""
                          />
                          <h5 className="mt-1">Loading...</h5>
                        </div>
                      </Row>
                    ) : (
                      selectedDate && (
                        <>
                          <h5>{formatDate(selectedDate) || "Select a date"}</h5>
                          <h6>Available Slots</h6>

                          <Row className="d-flex ">
                            <Col>
                              <h6>Morning</h6>
                              <div className="d-flex flex-column flex-wrap gap-2">
                                {renderSlots(timeSlots.morning, "morning")}
                              </div>
                            </Col>
                            <Col>
                              <h6>Afternoon</h6>
                              <div className="d-flex flex-column flex-wrap gap-2">
                                {renderSlots(timeSlots.afternoon, "afternoon")}
                              </div>
                            </Col>
                            <Col>
                              <h6>Evening</h6>
                              <div className="d-flex flex-column flex-wrap gap-2">
                                {renderSlots(timeSlots.evening, "evening")}
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            {selectedPackage?.course_duration !== 1 && (
                              <Col>
                                <button
                                  type="button"
                                  className={`btn mt-3 w-100 ${
                                    totalSelectedSlots.length === totalLessons
                                      ? "btn-dark" // Dark button when the total selected slots equals total lessons
                                      : "btn-outline-secondary" // Outline primary when slots are selected
                                    // Primary when no slots are selected
                                  }`}
                                  onClick={handleNextClick}
                                  disabled={
                                    totalSelectedSlots.length === totalLessons // Disable if no slots selected or lessons are complete
                                  }
                                >
                                  Next
                                </button>
                              </Col>
                            )}

                            {/* <Col>
                <Button
                  className="mt-3 w-100 mb-3 "
                  style={{
                    backgroundColor: "#FE7D29",
                    color: "white",
                    border: "none",
                  }}
                //   onClick={handleContinueClick} // This opens the login modal if the user is not logged in
                  disabled={!isContinueEnabled} // Enable only when all lessons are selected
                >
                  Continue
                </Button>
              </Col> */}
                          </Row>
                          {/* Card to display selected slots */}
                        </>
                      )
                    )}
                  </Col>
                  <Col md={6} xs={12} className="mt-3">
                    {showConfirmationCard &&
                      totalSelectedSlots.length > 0 &&
                      totalLessons !== 1 && (
                        <>
                          <h5>Selected Slots</h5>

                          <Card
                            className="mt-2 p-3"
                            style={{ borderRadius: "15px" }}
                          >
                            <ol className="list-unstyled">
                              {totalSelectedSlots
                                .sort(
                                  (a, b) =>
                                    new Date(a.start_time) -
                                    new Date(b.start_time)
                                ) // Sort by start_time in ascending order
                                .map((slot, index) => (
                                  <li
                                    key={index}
                                    className="d-flex flex-column fs-12 gap-1"
                                  >
                                    <div className="d-flex fs-12 justify-content-between mt-0">
                                      {index + 1}.{" "}
                                      {formatDateTime(slot.start_time)}
                                      <i
                                        className="bx bx-trash-alt"
                                        style={{
                                          color: "red",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handleSlotDelete(slot)} // Delete slot on click
                                      ></i>
                                    </div>

                                    <hr
                                      className="middle mt-0"
                                      style={{
                                        width: "100%",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                      }}
                                    />
                                  </li>
                                ))}
                            </ol>
                          </Card>
                        </>
                      )}
                  </Col>
                </Row>
              </Col>
            ) : null}
          </Row>
        )}
      </Row>
    </div>
    // </Container>
  );
};

export default DriverSlotDate;
