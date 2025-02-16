// src/components/ConfirmationModal.js
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Input,
  Container,
  Card,
  Label,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import PackageService from "../../../services/PackageServices/PackageService";
import RescheduleSlotButton from "./RescheduleSlotButton";
import { useNavigate, Link } from "react-router-dom";
import AppointmentService from "../../../services/AppointmentServices/AppointmentService";
import { formatDate, formatDateTime } from "./FormatDate";
import toast from "react-hot-toast";
import ConfirmModal from "../../../Components/ConfirmModal/ConfirmModal";
import { useParams } from "react-router-dom";
import { Triangle } from "react-loader-spinner";

const RescheduleModal = ({
  isOpen,
  toggle,
  onConfirm,
  message,
  dataList,
  onStatusChange,
  setDataList,
  fetchAppointmentDetails
}) => {
  // console.log("🚀 ~ dataList:", dataList);

  const driverId = dataList?.driver?.user_id;
  // console.log("🚀 ~ driverId:", driverId);
  console.log("-------------------re rendeing component-------------");

  const rescheduleAddress = dataList?.pickup_location;

  const session = dataList?.session_duration;

  const rescheduleTotalSlot = dataList?.sessions;
  console.log("🚀 ~ rescheduleTotalSlot:", rescheduleTotalSlot);
  const course_durations = dataList?.course_duration;

  const [datas, setDatas] = useState(null);
  const [duration, setDuration] = useState(1);
  useEffect(() => {
    // console.log("session value changed");
    if (session === 2) {
      setDuration(2);
    }
  }, [session]);

  //for all slots that has been selected and added to list
  const [totalSelectedSlots, setTotalSelectedSlots] = useState([]);
  // console.log("🚀 ~ totalSelectedSlots:", totalSelectedSlots);
  //for current slot that is being edited from total slots or list
  const [currentDaySlotInfo, setCurrentDaySlotInfo] = useState();

  const [address, setAddress] = useState();

  const [prevSelDate, setPrevSelDate] = useState();
  const [selectedDate, setSelectedDate] = useState();
  // console.log("🚀 ~ selectedDate:", selectedDate);

  const [fetchedDate, setFetchedDate] = useState();
  // console.log("🚀 ~ fetchedDate:", fetchedDate);
  const [timeSlots, setTimeSlots] = useState({});
  const [selectedSlots, setSelectedSlots] = useState({});
  console.log("selectedslots", selectedSlots);
  const [showConfirmationCard, setShowConfirmationCard] = useState(true);

  // render confirmation modal for reschedule================
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  useEffect(() => {
    console.log("calling reschedule total slots, reschedule addresss");
    if (rescheduleTotalSlot && rescheduleTotalSlot.length > 0) {
      setTotalSelectedSlots(rescheduleTotalSlot);
      setAddress(rescheduleAddress);
    }
  }, [rescheduleTotalSlot, rescheduleAddress]);

  const handleDurationChange = (e) => {
    console.log("calling handle duration");
    setDuration(Number(e.target.value));
  };

  useEffect(() => {
    console.log("time slots has been changed....", timeSlots);
  }, [timeSlots]);

  const fetchSlotsData = async () => {
    const currentDate = selectedDate; // Use the latest `selectedDate`
    // console.log("Fetching slots for:", currentDate);

    if (!currentDate) {
      console.log("Invalid Date, skipping fetch.");
      return;
    }

    if (fetchedDate === currentDate) {
      // console.log("Already fetched for this date:", currentDate);
      return;
    }

    try {
      const response = await PackageService.getSlot({
        date: currentDate,
        duration: duration,
        driver: driverId,
      });
      // console.log("Fetched slots:", response.data);
      setTimeSlots(response.data);
      setFetchedDate(currentDate); // Update fetched date after a successful fetch
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  useEffect(() => {
    if (!(totalSelectedSlots && totalSelectedSlots.length > 0)) {
      console.log("No selected slots", totalSelectedSlots);
      return;
    }

    // Find the first non-completed and non-past slot
    const firstValidSlot = totalSelectedSlots.find(
      (slot) =>
        slot.status !== "COMPLETED" && new Date(slot.start_time) >= new Date()
    );

    if (!(currentDaySlotInfo && currentDaySlotInfo.id)) {
      setCurrentDaySlotInfo(firstValidSlot || null);
    } else {
      console.log("Already has current day slot info", currentDaySlotInfo);
    }
  }, [totalSelectedSlots]);

  useEffect(() => {
    if (selectedDate && address && duration) {
      // console.log(
      //   "Fetching slots because selectedDate, address, or duration changed."
      // );
      fetchSlotsData();
    }
  }, [selectedDate, address, duration]);

  useEffect(() => {
    // console.log("calling selected Date changed...", selectedDate);
    if (!selectedDate) {
      return;
    }

    fetchSlotsData();
  }, [selectedDate]);

  useEffect(() => {
    // console.log("calling selected slots changed...");

    //const isEditing = editSlot && editSlot.id; // Check if we are editing a slot
    const isEditing = currentDaySlotInfo && currentDaySlotInfo.id; // Check if we are editing a slot
    // console.log("here i am...", currentDaySlotInfo, selectedSlots);
    if (isEditing) {
      // console.log("here i am...2");
      // Update the matching slot in totalSelectedSlots without changing the ID
      setCurrentDaySlotInfo((prevState) => ({
        ...prevState,
        isEdited: true,
        start_time: selectedSlots.start_time,
        end_time: selectedSlots.end_time,
      }));
    } else {
      // console.log("here i am...3");
      // Add the slot if it's not already selected
      setTotalSelectedSlots((prevSlots) => [
        ...prevSlots,
        { ...selectedSlots },
      ]); // Ensure you copy the slot object
    }

    // Show confirmation card
    setShowConfirmationCard(true);
  }, [selectedSlots]);

  const handleSlotClick = (slot) => {
    // console.log("calling handle slot clicked...");
    if (selectedSlots?.id === slot.id) {
      setSelectedSlots({}); // Deselect if the same slot is clicked again
    } else {
      setSelectedSlots(slot); // Select the new slot
    }
  };

  const handleSaveClick = () => {
    toggleModal(); // Open the confirmation modal

    setSelectedSlots({});
  };

  const handleConfirm = async () => {
    toggleModal();

    try {
      const sessionsToSave = totalSelectedSlots.map((slot) => ({
        session_id: `${slot.id}`,
        start_time: `${slot.start_time}`,
        end_time: `${slot.end_time}`,
        is_edited: slot.isEdited ? `${slot.isEdited}` : "false",
      }));

      // console.log("sessionsToSave", sessionsToSave);

      // Capture the API response from the reschedule call
      const updatedData = await AppointmentService.reschedule(dataList.id, {
        sessions: sessionsToSave,
      });

      // Update dataList with the new response
      setDataList(updatedData.data);

      toggle(); // Close RescheduleModal
      await onStatusChange();
      fetchAppointmentDetails()
      toast.success("Reschedule saved successfully!");
      setTotalSelectedSlots([]); // Clear selected slots if needed
    } catch (error) {
      console.log("Error saving reschedule:", error);
      toast.error("Failed to save reschedule: " + error.message);
    }
  };

  useEffect(() => {
    // console.log(
    //   "chaning current day slot info...",
    //   currentDaySlotInfo,
    //   selectedDate
    // );
    if (currentDaySlotInfo && currentDaySlotInfo.start_time) {
      const slotDate = currentDaySlotInfo.start_time.substring(0, 10); //it has time also...
      //fetchSlotsData();
      setTotalSelectedSlots((prevSlots) =>
        prevSlots.map((selectedSlot) =>
          selectedSlot.id === currentDaySlotInfo.id
            ? {
                ...selectedSlot,
                ...currentDaySlotInfo,
              } // Only update relevant properties
            : selectedSlot
        )
      );
      // console.log("trying to set date also...", selectedDate, slotDate);
      //check with  prev selected date and if its different then only set it...
      if (!prevSelDate || prevSelDate != slotDate) {
        setPrevSelDate(slotDate);
        setSelectedDate(slotDate);
      }
    }
  }, [currentDaySlotInfo]);

  const handleSlotEdit = (slot) => {
    if (currentDaySlotInfo.id != slot.id) {
      setSelectedSlots({});
      setCurrentDaySlotInfo(slot);
    }
  };

  const renderSlots = (slots, period) => {
    return slots?.map((slot, index) => {
      const isEditingSlot = false; // editSlot && editSlot.id === slot.id;

      return (
        <RescheduleSlotButton
          key={`${period}-${index}`}
          slot={slot}
          selectedSlots={selectedSlots}
          selectedDate={selectedDate}
          totalSelectedSlots={totalSelectedSlots}
          currentDaySlotInfo={currentDaySlotInfo}
          isEditing={isEditingSlot} // Pass this flag to indicate if the slot is being edited
          onClick={() => handleSlotClick(slot)}
          style={isEditingSlot ? { backgroundColor: "#FE7D29" } : {}}
        />
      );
    });
  };
  const flatpickrRef = useRef(null);

  const [availableDate, setAvailableDate] = useState([]);
  // console.log("🚀 ~ availableDate:", availableDate);
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
  }, [driverId]);

  useEffect(() => {
    if (!isOpen) {
      // setSelectedSlots({});
      // setTotalSelectedSlots([]);
    }
  }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      fullscreen="lg"
      size="lg"
      backdrop="static"
    >
      <ModalHeader toggle={toggle}>Reschedule Appointment</ModalHeader>
      <ModalBody>
        <Row className="d-flex justify-content-center align-content-center">
          <Col lg={12} xs={12}>
            <div className=" p-3" style={{ borderRadius: "15px" }}>
              {datas?.package_type === "PER-HOUR" && (
                <div>
                  <Label
                    className="form-label mb-1"
                    style={{ fontWeight: "bold" }}
                  >
                    Lesson duration
                  </Label>
                  <Input
                    type="select"
                    name="duration"
                    value={duration}
                    onChange={handleDurationChange}
                    className="mb-3"
                    disabled={!address}
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                  </Input>
                </div>
              )}

              <Flatpickr
                ref={flatpickrRef}
                className="form-control"
                options={{
                  altInput: true,
                  altFormat: "d.m.Y",
                  inline: false,
                  dateFormat: "Y.m.d",
                  minDate: "today",
                  defaultDate: selectedDate,
                  locale: {
                    firstDayOfWeek: 1,
                  },
                  enable: availableDate
                    ?.filter(
                      (date) => date.available || date.available === false
                    )
                    .map((date) => date.date),
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
                    const dateInfo = availableDate?.find(
                      (date) => date.date === dateStr
                    );

                    if (dateInfo) {
                      if (dateInfo.available === true) {
                        dayElem.classList.add("available-date"); // Green for truly available dates
                      } else if (dateInfo.available === false) {
                        dayElem.classList.add("unavailable-date"); // Red for unavailable dates
                        dayElem.classList.add("clickable-unavailable-date"); // Additional class for styling
                      }
                    }
                  },
                }}
                value={selectedDate}
                onChange={(date) => {
                  console.log("🚀 ~ date:", date);
                  if (date.length) {
                    const selectedDate = date[0];

                    const formattedDate = `${selectedDate.getFullYear()}-${String(
                      selectedDate.getMonth() + 1
                    ).padStart(2, "0")}-${String(
                      selectedDate.getDate()
                    ).padStart(2, "0")}`;
                    setSelectedDate(formattedDate);
                  } else {
                    setSelectedDate(null); // Clear the date if no selection
                  }
                }}
              />
            </div>
          </Col>
          <Col lg={6} className="mt-3">
            <>
              <h5>{formatDate(selectedDate) || "Select a date"}</h5>
              <h6>Available Slots</h6>

              <Row className="d-flex">
                <Col>
                  <h6>Morning</h6>
                  <div className="d-flex flex-column flex-wrap gap-2">
                    {timeSlots?.morning ? (
                      renderSlots(timeSlots.morning, "morning")
                    ) : (
                      <p></p>
                    )}
                  </div>
                </Col>
                <Col>
                  <h6>Afternoon</h6>
                  <div className="d-flex flex-column flex-wrap gap-2">
                    {timeSlots?.afternoon ? (
                      renderSlots(timeSlots.afternoon, "afternoon")
                    ) : (
                      <p></p>
                    )}
                  </div>
                </Col>
                <Col>
                  <h6>Evening</h6>
                  <div className="d-flex flex-column flex-wrap gap-2">
                    {timeSlots?.evening ? (
                      renderSlots(timeSlots.evening, "evening")
                    ) : (
                      <p></p>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    className="mt-2 w-100 mb-3"
                    style={{
                      backgroundColor: "#FE7D29",
                      border: "none",
                    }}
                    onClick={handleSaveClick}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </>
          </Col>
          <Col lg={6} xs={12}>
            {showConfirmationCard &&
              totalSelectedSlots.length > 0 &&
              course_durations >= 1 && (
                <>
                  <h5>Selected Slots</h5>

                  <Card className="mt-2 p-3" style={{ borderRadius: "15px" }}>
                    <ul className="list-unstyled">
                      {totalSelectedSlots.map((slot, index) => {
                        const isPastDate =
                          new Date(slot.start_time) < new Date();

                        return (
                          <li
                            key={index}
                            className={`d-flex flex-column fs-12 gap-1 ${
                              !slot.is_reschedulable || isPastDate
                                ? "disabled"
                                : ""
                            }`}
                            style={{
                              opacity:
                                !slot.is_reschedulable || isPastDate ? 0.5 : 1,
                            }}
                            // disabled={slot?.status === "COMPLETED"}
                          >
                            <div className="d-flex fs-12 justify-content-between mt-0">
                              <span
                                style={{
                                  color: slot.isEdited
                                    ? "#fe7d29"
                                    : currentDaySlotInfo &&
                                      slot.id === currentDaySlotInfo.id
                                    ? "#FF0000"
                                    : "inherit",
                                  fontWeight:
                                    slot.isEdited ||
                                    (currentDaySlotInfo &&
                                      slot.id === currentDaySlotInfo.id)
                                      ? "bold"
                                      : "normal",
                                }}
                              >
                                {index + 1}.{"  "}
                                {formatDateTime(slot.start_time)}
                              </span>
                              {slot?.status !== "COMPLETED" &&
                                slot.is_reschedulable &&
                                !isPastDate && (
                                  <i
                                    className="bx bx-edit-alt"
                                    style={{ color: "red", cursor: "pointer" }}
                                    onClick={() => handleSlotEdit(slot)}
                                  ></i>
                                )}
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
                        );
                      })}
                    </ul>
                  </Card>
                </>
              )}
          </Col>
        </Row>
      </ModalBody>

      <ConfirmModal
        isConfirmModalOpen={modalOpen}
        toggleConfirm={toggleModal}
        handleStatusChange={handleConfirm}
      />
    </Modal>
  );
};

export default RescheduleModal;
