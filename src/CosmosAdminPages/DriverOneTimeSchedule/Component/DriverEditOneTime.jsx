import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import toast from "react-hot-toast";
import OneTimeService from "../../../services/OnetimeScheduleService/OneTimeService";

const DriverEditOneTime = ({
  isOpen,
  toggle,
  data,
  setData,
  selectedTimeSlot,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const driverId = user?.user?.id;

  const [timeSlot, setTimeSlot] = useState({
    title: "",
    fromDate: null,
    toDate: null,
  });

  // Parse date string to ensure consistent format
  const parseDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  // Format date for UI display (d.m.Y H:i)
  const formatDateForUI = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  // Format date for API submission (Y-m-d H:i)
  const formatDateForAPI = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Update state when `selectedTimeSlot` changes
  useEffect(() => {
    if (selectedTimeSlot) {
      const fromDate = parseDate(selectedTimeSlot.from_date);
      const toDate = parseDate(selectedTimeSlot.to_date);

      setTimeSlot({
        title: selectedTimeSlot.title || "",
        fromDate,
        toDate,
      });
    }
  }, [selectedTimeSlot]);

  const handleFromDateChange = (date) => {
    setTimeSlot((prev) => ({ ...prev, fromDate: date[0] }));
  };

  const handleToDateChange = (date) => {
    setTimeSlot((prev) => ({ ...prev, toDate: date[0] }));
  };

  const handleSubmit = async () => {
    const { title, fromDate, toDate } = timeSlot;

    // Validate input fields
    if (!title.trim() || !fromDate || !toDate) {
      toast.error("Please fill in all fields and select valid dates.");
      return;
    }

    try {
      const response = await OneTimeService.update(selectedTimeSlot.id, {
        driver_id: driverId,
        title,
        from_date: formatDateForAPI(fromDate),
        to_date: formatDateForAPI(toDate),
      });

      if (response && response.data) {
        const updatedSlot = {
          ...response.data,
          dates: [
            { date: formatDateForUI(fromDate) },
            { date: formatDateForUI(toDate) },
          ],
        };

        setData((prevData) =>
          prevData.map((slot) =>
            slot.id === selectedTimeSlot.id ? updatedSlot : slot
          )
        );

        setTimeSlot({ title: "", fromDate: null, toDate: null });
        toggle();
      }
    } catch (error) {
      console.error("Error updating time slot:", error);
      toast.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit One-Time Schedule</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={timeSlot.title}
            onChange={(e) =>
              setTimeSlot({ ...timeSlot, title: e.target.value })
            }
            className="form-control"
            placeholder="Enter title's name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fromDate">From Date</label>
          <Flatpickr
            className="form-control"
            value={timeSlot.fromDate}
            onChange={handleFromDateChange}
            options={{
              altInput: true,
              altFormat: "d.m.Y H:i",
              enableTime: true,
              dateFormat: "Y-m-d H:i",
              time_24hr: true,
              defaultDate: timeSlot.fromDate,
              minDate: "today",
              locale: {
                firstDayOfWeek: 1,
              },
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="toDate">To Date</label>
          <Flatpickr
            className="form-control"
            value={timeSlot.toDate}
            onChange={handleToDateChange}
            options={{
              altInput: true,
              altFormat: "d.m.Y H:i",
              enableTime: true,
              dateFormat: "Y-m-d H:i",
              time_24hr: true,
              defaultDate: timeSlot.toDate,
              minDate: timeSlot.fromDate ? timeSlot.fromDate : null,
              locale: {
                firstDayOfWeek: 1,
              },
            }}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={toggle}>
          Cancel
        </Button>
        <Button color="success" onClick={handleSubmit}>
          Update Time
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DriverEditOneTime;
