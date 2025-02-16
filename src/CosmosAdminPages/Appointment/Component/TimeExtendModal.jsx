import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonDropdown,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import toast from "react-hot-toast";
import AppointmentService from "../../../services/AppointmentServices/AppointmentService";
// import { differenceInMinutes, addMinutes, subMinutes } from 'date-fns';

const TimeExtendModal = ({
  isOpen,
  toggle,
  id,
  initialTime,
  onTimeExtended,
  fetchAppointmentDetails,
  setEvent,
}) => {
  console.log("🚀 ~ initialTime:", initialTime);
  const [selectedTime, setSelectedTime] = useState(new Date(initialTime));
  console.log("🚀 ~ selectedTime:", selectedTime);

  useEffect(() => {
    if (isOpen) {
      setSelectedTime(new Date(initialTime));
    }
  }, [isOpen, initialTime]);

  const calculateTimeDifference = () => {
    const initialDateTime = new Date(initialTime);

    // Ensure only the time part changes
    const adjustedInitialTime = new Date(initialDateTime);
    adjustedInitialTime.setHours(selectedTime.getHours());
    adjustedInitialTime.setMinutes(selectedTime.getMinutes());

    const diffInMinutes = Math.floor(
      (adjustedInitialTime.getTime() - initialDateTime.getTime()) / (1000 * 60)
    );
    return diffInMinutes;
  };

  const handleSave = async () => {
    try {
      const timeAmount = calculateTimeDifference();

      if (timeAmount === 0) {
        toast.error("Please select a different time.");
        return;
      }

      // Determine the action type and prepare request data
      const action = timeAmount > 0 ? "extend" : "unextend";
      const response = await AppointmentService.extendTime(id, {
        action: timeAmount > 0 ? 1 : 0,
        time: Math.abs(timeAmount),
      });

      // Update the UI after successful API call
      onTimeExtended(id, Math.abs(timeAmount), action);

      const actionText = timeAmount > 0 ? "extended" : "shortened";
      toast.success(
        `Time has been ${actionText} by ${Math.abs(timeAmount)} minutes.`
      );

      // Update the event state
      setEvent((prevEvent) => ({
        ...prevEvent,
        time: prevEvent.time + timeAmount, // Adjust time based on the difference
      }));

      // Toggle the modal and fetch updated appointment details
      toggle();
      await fetchAppointmentDetails();
    } catch (error) {
      console.log("error@@@@", error);
      toast.error("Failed to change appointment time. Please try again.");
    }
  };

  const handleTimeChange = (selectedDates) => {
    if (selectedDates[0]) {
      const newTime = new Date(selectedDates[0]);

      // Only update the time portion
      const updatedTime = new Date(selectedTime);
      updatedTime.setHours(newTime.getHours());
      updatedTime.setMinutes(newTime.getMinutes());

      setSelectedTime(updatedTime);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Change Appointment Time</ModalHeader>
      <ModalBody>
        <h6>Current Appointment Time:</h6>
        <p className="font-medium">
          {new Date(initialTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <Row className="mt-4">
          <h6>Select New Time</h6>
          <Col lg={12}>
            <Flatpickr
              className="form-control"
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                minuteIncrement: 5,
              }}
              value={selectedTime}
              onChange={handleTimeChange}
            />
            {selectedTime && initialTime && (
              <p className="text-muted mt-2">
                {calculateTimeDifference() > 0
                  ? "Moving forward"
                  : "Moving backward"}{" "}
                by {Math.abs(calculateTimeDifference())} minutes
              </p>
            )}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-danger" onClick={toggle}>
          Cancel
        </button>
        <button
          className="btn btn-success"
          onClick={handleSave}
          disabled={!selectedTime || calculateTimeDifference() === 0}
        >
          Save
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default TimeExtendModal;
