import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import WeeklyService from "../../../services/Weekly Schedule Service/WeeklyService";
import toast from "react-hot-toast";
import Flatpickr from "react-flatpickr";

const EditTimeDriverModal = ({
  isOpen,
  toggle,
  data,
  setData,
  fetchData,
  selectedId,
  selectedDay,
}) => {
  const [timeSlot, setTimeSlot] = useState([{ start_time: "", end_time: "" }]);
  const [loading, setLoading] = useState(false);
  console.log("🚀 ~ loading:", loading);

  useEffect(() => {
    if (data && selectedDay && data[selectedDay]) {
      setTimeSlot(
        data[selectedDay].times?.length > 0
          ? [...data[selectedDay].times]
          : [{ start_time: "", end_time: "" }]
      );
    }
  }, [selectedId, data, selectedDay]);

  const handleCancel = () => {
    setTimeSlot([{ start_time: "", end_time: "" }]);
    toggle(); // Close modal
  };

  const handleTimeChange = (index, field, value) => {
    const updatedTimeSlots = [...timeSlot];

    // If the value is a Date object (like from Flatpickr), format it as "HH:mm"
    const time =
      value instanceof Date
        ? value.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : value; // In case it's already in "HH:mm" format

    updatedTimeSlots[index] = {
      ...updatedTimeSlots[index],
      [field]: time, // Save time in "HH:mm" format
    };
    if (field === "start_time") {
      updatedTimeSlots[index].end_time = null;
    }
    setTimeSlot(updatedTimeSlots);
  };

  const handleSubmit = async () => {
    const invalidTimeSlot = timeSlot.some((slot) => {
      if (!slot.start_time && !slot.end_time) {
        return false;
      }

      return slot.start_time === slot.end_time;
    });

    if (invalidTimeSlot) {
      toast.error("Start time and end time cannot be the same.");
      return; // Prevent form submission if validation fails
    }
    setLoading(true);
    try {
      const formattedTimeSlot = timeSlot.map((slot) => ({
        start_time:
          typeof slot.start_time === "string"
            ? slot.start_time
            : new Date(slot.start_time).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
        end_time:
          typeof slot.end_time === "string"
            ? slot.end_time
            : new Date(slot.end_time).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
      }));

      const updatedPayload = {
        [selectedDay]: {
          is_available: true,
          times: formattedTimeSlot,
        },
      };

      await WeeklyService.update(selectedId, updatedPayload);
      toggle();
      fetchData();
      toast.success("The time slot is updated successfully.");

      // Update local data
      setData(
        data.map((item) =>
          item.day === selectedDay
            ? { ...item, is_available: true, times: formattedTimeSlot }
            : item
        )
      );

      setTimeSlot([{ start_time: "", end_time: "" }]);
      fetchData();
      toggle();
      toast.success("The time slot is updated successfully.");
    } catch (error) {
      console.error("Error updating schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = () => {
    setTimeSlot([...timeSlot, { start_time: "", end_time: "" }]);
  };

  const removeTimeSlot = (index) => {
    const updatedTimeSlots = timeSlot.filter((_, i) => i !== index);
    setTimeSlot(updatedTimeSlots);
  };

  return (
    <Modal isOpen={isOpen} toggle={handleCancel} backdrop="static">
      <ModalHeader toggle={handleCancel}>
        Edit Time for {selectedDay}
      </ModalHeader>
      <ModalBody>
        {timeSlot.map((slot, index) => (
          <Row key={`${selectedId}-${index}`}>
            <Col md={6} className="mb-3">
              <label>Start Time</label>
              <Flatpickr
                data-enable-time
                value={slot.start_time}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "h:i K", // Updated format for 12-hour with AM/PM
                  time_24hr: false,
                  minuteIncrement: 60,
                }}
                onChange={([value]) =>
                  handleTimeChange(index, "start_time", value)
                }
                className="form-control"
              />
            </Col>
            <Col md={6} className="mb-3">
              <div className="d-flex justify-content-between">
                <label>End Time</label>
                {timeSlot.length >= 1 && (
                  <h6
                    className="text-end"
                    title="Delete Time Slot"
                    style={{ cursor: "pointer" }}
                    onClick={() => removeTimeSlot(index)}
                  >
                    <i className="bx bx-trash text-danger"></i>
                  </h6>
                )}
              </div>
              <Flatpickr
                data-enable-time
                value={slot.end_time}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "h:i K", // Updated format for 12-hour with AM/PM
                  time_24hr: false, // Set to false for AM/PM format
                  minuteIncrement: 60,
                  minTime: slot.start_time,
                }}
                onChange={([value]) =>
                  handleTimeChange(index, "end_time", value)
                }
                className="form-control"
              />
            </Col>
          </Row>
        ))}
        <Button color="primary" onClick={addTimeSlot}>
          Add Time
        </Button>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleCancel}>
          Cancel
        </Button>
        {/* <Button color="success" onClick={handleSubmit}>
          Update
        </Button> */}
        <Button
          className="mr-3 me-2"
          color="success"
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading && <Spinner size="sm" className="me-2" />}
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditTimeDriverModal;
