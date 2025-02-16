// src/components/ConfirmationModal.js
import React, { useState, useEffect } from "react";
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

const RescheduleModal = ({
  isOpen,
  toggle,
  onConfirm,
  message,
  dataList,
  onStatusChange,
}) => {
  // console.log("dataList", dataList);

  const navigate = useNavigate();

  const rescheduleAddress = dataList?.pickup_location;

  const session = dataList?.session_duration;

  const packageId = dataList?.package?.id;
  const rescheduleTotalSlot = dataList?.sessions;
  const course_durations = dataList?.course_duration;

  const [datas, setDatas] = useState(null);
  const [duration, setDuration] = useState(1);

  const [address, setAddress] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState({});
  const [loadingDate, setLoadingDate] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState({});
  // console.log("selectedSlots", selectedSlots);

  const [showConfirmationCard, setShowConfirmationCard] = useState(true);
  const [totalSelectedSlots, setTotalSelectedSlots] = useState([]);
  // console.log("totalSelectedSlots", totalSelectedSlots);
  const [editSlot, setEditSlot] = useState(null);
  // console.log("editSlot", editSlot);
  const [modalOpen, setModalOpen] = useState(false);
  console.log("modalOpen", modalOpen);

  const toggleModal = () => setModalOpen(!modalOpen);
  const [editDate, setEditDate] = useState(null);

  // Handle setting duration based on session
  useEffect(() => {
    if (session === 2) {
      setDuration(2);
    }
  }, [session]);

  useEffect(() => {
    if (rescheduleTotalSlot && rescheduleTotalSlot.length > 0) {
      setTotalSelectedSlots(rescheduleTotalSlot);
      setAddress(rescheduleAddress);
    }
  }, [rescheduleTotalSlot, rescheduleAddress]);

  const handleDurationChange = (e) => {
    setDuration(Number(e.target.value));
    fetchSlotsData(); // Fetch slots when duration changes
  };

  // Fetch slot data for a given date and duration
  const fetchSlotsData = async () => {
    try {
      const formattedDate = selectedDate
        ? new Date(selectedDate).toISOString().split("T")[0]
        : new Date(totalSelectedSlots[0]?.start_time)
            .toISOString()
            .split("T")[0];

      setLoadingTime(true);
      const durationNumber = duration;

      const response = await PackageService.getSlot({
        date: formattedDate,
        duration: durationNumber,
      });

      setTimeSlots(response.data);
    } catch (error) {
      toast.error("Failed to fetch slots: " + error.message); // Display error message
    } finally {
      setLoadingTime(false);
    }
  };

  useEffect(() => {
    if (!(totalSelectedSlots && totalSelectedSlots.length > 0)) {
      // console.log("no selected slots", totalSelectedSlots);
      return;
    }
    // Find the first editable slot
    setEditSlot(totalSelectedSlots[0]);
  }, [totalSelectedSlots]);
  // Fetch slots when relevant state changes
  useEffect(() => {
    if (address && duration && selectedDate) {
      fetchSlotsData();
    }
  }, [address, duration, selectedDate]);

  // Trigger fetchSlotsData on initial load if there's an initial selected slot
  useEffect(() => {
    if (totalSelectedSlots[0]?.start_time) {
      const initialDate = new Date(totalSelectedSlots[0]?.start_time)
        .toISOString()
        .split("T")[0];
      setSelectedDate(initialDate);
      fetchSlotsData();
    }
  }, [totalSelectedSlots]);

  // Handle slot click logic
  const handleSlotClick = (slot) => {
    const isEditing = editSlot && editSlot.id; // Check if we are editing a slot

    if (isEditing) {
      // Update the matching slot in totalSelectedSlots
      setTotalSelectedSlots((prevSlots) =>
        prevSlots.map((selectedSlot) =>
          selectedSlot.id === editSlot.id
            ? {
                ...selectedSlot,
                start_time: slot.start_time,
                end_time: slot.end_time,
                isEdited: true,
              }
            : selectedSlot
        )
      );
      setEditSlot(null); // Clear the edit state after the update
    } else {
      const isSlotAlreadySelected = totalSelectedSlots.some(
        (selectedSlot) => selectedSlot.id === slot.id
      );

      if (isSlotAlreadySelected) {
        // Update existing slot
        setTotalSelectedSlots((prevSlots) =>
          prevSlots.map((selectedSlot) =>
            selectedSlot.id === slot.id
              ? {
                  ...selectedSlot,
                  start_time: slot.start_time,
                  end_time: slot.end_time,
                }
              : selectedSlot
          )
        );
      } else {
        // Ensure we don't exceed the number of allowed slots
        if (totalSelectedSlots.length < course_durations) {
          setTotalSelectedSlots((prevSlots) => [...prevSlots, { ...slot }]);
        } else {
          toast.error(`You can only select ${course_durations} slots`);
        }
      }
    }

    setSelectedSlots(selectedSlots?.id === slot.id ? {} : slot); // Toggle selected slots
    setShowConfirmationCard(true); // Show confirmation card
  };

  const handleSaveClick = () => {
    toggleModal();
  };

  const handleConfirm = async () => {
    toggleModal(); // Close ConfirmModal

    try {
      const sessionsToSave = totalSelectedSlots.map((slot) => ({
        session_id: `${slot.id}`,
        start_time: `${slot.start_time}`,
        end_time: `${slot.end_time}`,
        is_edited: slot.isEdited ? `${slot.isEdited}` : "false",
      }));

      await AppointmentService.reschedule(dataList.id, {
        sessions: sessionsToSave,
      });
      toast.success("Reschedule saved successfully!");
      // setDataList(sessionsToSave);
      toggle(); // Close RescheduleModal


      onStatusChange();
      
      console.log("rescheduled-> calendar refresh");
      // setTotalSelectedSlots([]); // Clear slots
    } catch (error) {
      toast.error("Failed to save reschedule: " + error.message);
    }
  };

  useEffect(() => {
    if (editSlot) {
      const slotDate = new Date(editSlot.start_time);
      setSelectedDate(slotDate);
      fetchSlotsData();
    }
  }, [editSlot]);

  const handleSlotEdit = (slot) => {
    setEditSlot(slot); // Keep the entire slot object, including ID
    setEditDate(slot.start_time); // Set the start time directly
    setDuration(1); // Set duration based on your logic
    setLoadingTime(true); // Show loading while fetching slots
    fetchSlotsData(); // Fetch available slots for the selected date and duration
  };

  // Render slot buttons
  const renderSlots = (slots, period) => {
    return slots?.map((slot, index) => {
      const isEditingSlot = editSlot && editSlot.id === slot.id;

      return (
        <RescheduleSlotButton
          key={`${period}-${index}`}
          slot={slot}
          selectedSlots={selectedSlots}
          selectedDate={selectedDate}
          totalSelectedSlots={totalSelectedSlots}
          isEditing={isEditingSlot}
          onClick={() => handleSlotClick(slot)}
          style={isEditingSlot ? { backgroundColor: "#FE7D29" } : {}}
        />
      );
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} fullscreen="md" backdrop="static">
      <ModalHeader toggle={toggle}>Reschedule Appointment</ModalHeader>
      <ModalBody>
        <Row className="d-flex justify-content-end align-content-end">
          <Col lg={12} xxl={10}>
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
                className="form-control "
                options={{
                  inline: false,
                  dateFormat: "Y-m-d",
                  minDate: "today",
                }}
                value={
                  selectedDate || // First priority: currently selected date
                  (editSlot?.start_time
                    ? new Date(editSlot.start_time) // Second priority
                    : totalSelectedSlots[0]?.start_time
                    ? new Date(totalSelectedSlots[0].start_time) // Third priority
                    : null) // Default: null
                }
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
                    fetchSlotsData(); // Fetch slots immediately after selecting the date
                  } else {
                    setSelectedDate(null);
                  }
                }}
              />
            </div>
          </Col>
          <Col lg={12}>
            <>
              <h5>{formatDate(selectedDate) || "Select a date"}</h5>
              <h6>Available Slots</h6>

              <Row className="d-flex">
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
            <Col lg={12} xs={12} className="mt-3">
              {showConfirmationCard &&
                totalSelectedSlots.length > 0 &&
                course_durations !== 1 && (
                  <>
                    <h5>Selected Slots</h5>
                    <Card className="mt-2 p-3" style={{ borderRadius: "15px" }}>
                      <ul className="list-unstyled">
                        {totalSelectedSlots.map((slot, index) => (
                          <li
                            key={index} // Assuming slot.id is unique
                            className={`d-flex flex-column fs-12 gap-1 ${
                              !slot.is_reschedulable ? "disabled" : ""
                            }`}
                            style={{
                              opacity: !slot.is_reschedulable ? 0.5 : 1,
                            }}
                          >
                            <div className="d-flex fs-12 justify-content-between mt-0">
                              <span
                                style={{
                                  color: slot.isEdited
                                    ? "#fe7d29"
                                    : editSlot && slot.id === editSlot.id
                                    ? "#FF0000"
                                    : "inherit",
                                  fontWeight:
                                    slot.isEdited ||
                                    (editSlot && slot.id === editSlot.id)
                                      ? "bold"
                                      : "normal",
                                }}
                              >
                                {slot.confirmationId} {index + 1}.{" "}
                                {formatDateTime(slot.start_time)}
                              </span>
                              {slot.is_reschedulable && (
                                <i
                                  className="bx bx-edit-alt"
                                  style={{ color: "red", cursor: "pointer" }}
                                  onClick={() => handleSlotEdit(slot)}
                                  aria-label={`Edit slot ${slot.confirmationId}`} // Accessibility
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
                        ))}
                      </ul>
                    </Card>
                  </>
                )}
            </Col>
          </Col>

          {/* Other content */}
        </Row>
      </ModalBody>
      <ModalFooter></ModalFooter>
      <ConfirmModal
        isConfirmModalOpen={modalOpen}
        toggleConfirm={toggleModal}
        handleStatusChange={handleConfirm}
      />
    </Modal>
  );
};

export default RescheduleModal;
