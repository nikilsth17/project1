import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Spinner,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import toast from "react-hot-toast";
import OneTimeService from "../../../services/OnetimeScheduleService/OneTimeService";

const DriverAddOneTime = ({ isOpen, toggle, setData, selectedTimeSlot }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const driverId = user?.user?.id;

  const [timeSlot, setTimeSlot] = useState({
    title: "",
    fromDate: null,
    toDate: null,
  });
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so +1
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    if (selectedTimeSlot) {
      setTimeSlot({
        title: selectedTimeSlot.title || "",
        fromDate: selectedTimeSlot.fromDate
          ? new Date(selectedTimeSlot.fromDate)
          : null,
        toDate: selectedTimeSlot.toDate
          ? new Date(selectedTimeSlot.toDate)
          : null,
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

    if (!title.trim() || !fromDate || !toDate) {
      toast.error("Please fill in all fields and select valid dates.");
      return;
    }

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);
    setLoading(true);
    try {
      const response = await OneTimeService.create({
        driver_id: driverId,
        title,
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });

      if (response && response.data) {
        const newSlot = {
          ...response.data,
          dates: [{ date: formattedFromDate }, { date: formattedToDate }],
        };

        setData((prevData) => [...prevData, newSlot]);
        setTimeSlot({ title: "", fromDate: null, toDate: null });
        toggle();
      }
    } catch (error) {
      console.error("Error adding time slot:", error);
      toast.error(
        "An error occurred while adding the time slot. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add One-Time Schedule</ModalHeader>
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
        <div className="form-group mt-1">
          <label htmlFor="fromDate">From Date</label>
          <Flatpickr
            className="form-control"
            value={timeSlot.fromDate}
            onChange={handleFromDateChange}
            placeholder="Select from date"
            options={{
              altInput: true,
              altFormat: "d/m/Y H:i",
              enableTime: true,
              dateFormat: "d/m/Y H:i",
              minDate: "today",
            }}
          />
        </div>
        <div className="form-group mt-1">
          <label htmlFor="toDate">To Date</label>
          <Flatpickr
            className="form-control"
            value={timeSlot.toDate}
            onChange={handleToDateChange}
            placeholder="Select to date"
            options={{
              altInput: true,
              altFormat: "d/m/Y H:i",
              enableTime: true,
              dateFormat: "d/m/Y H:i",
              minDate: timeSlot.fromDate ? timeSlot.fromDate : null,
            }}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={toggle}>
          Cancel
        </Button>
        {/* <Button color="success" onClick={handleSubmit}>
          Add Time
        </Button> */}
        <Button
          className="mr-3 me-2"
          color="success"
          disabled={loading}
          onClick={handleSubmit}
        >
          {/* {loading && <Spinner size="sm" className="me-2" />} */}
          Add Time
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DriverAddOneTime;
