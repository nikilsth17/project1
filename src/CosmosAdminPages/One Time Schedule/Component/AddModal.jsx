import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import OneTimeService from "../../../services/OnetimeScheduleService/OneTimeService";
import toast from "react-hot-toast";
import DriverServices from "../../../services/DriverServices/DriverServices";
import Select from "react-select";

const AddModal = ({
  isOpen,
  toggle,
  setData,
  selectedTimeSlot,
  driverOptions,
  setDriverData,
  driverData,
}) => {
  const [driver, setDriver] = useState();
  const [timeSlot, setTimeSlot] = useState({
    title: "",
    fromDate: null,
    toDate: null,
  });

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

  // const handleFromDateChange = (date) => {
  //   setTimeSlot((prev) => ({ ...prev, fromDate: date[0] }));
  // };

  const handleFromDateChange = (date) => {
    setTimeSlot((prev) => ({
      ...prev,
      fromDate: date[0],
      toDate: null, // Reset "To Date" if "From Date" changes
    }));
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

    try {
      const response = await OneTimeService.create({
        driver_id: driver?.id,
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
        setDriver(null);
        toggle();
      }
    } catch (error) {
      console.error("Error adding time slot:", error);
      toast.error(
        "An error occurred while adding the time slot. Please try again."
      );
    }
  };

  const handleDriverChange = (selectedOption) => {
    const selectedId = selectedOption?.value || null;
    console.log("Selected Driver ID:", selectedId);
    console.log("Driver Data:", driverData);

    if (!driverData) {
      console.log("No drivers available.");
      return;
    }

    const selectedDriver = driverData?.find(
      (item) => item.id === selectedId // Compare by value directly
    );

    console.log("Selected Driver:", selectedDriver);

    // Update state if a driver is found
    if (selectedDriver) {
      setDriver({
        id: selectedDriver.id,
        name: `${selectedDriver.name} ${selectedDriver.surname}`,
      });
    } else {
      console.log("No driver found with the selected ID.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add One-Time Schedule</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <Label
            className="form-label mb-1"
            style={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            Driving Instructor
          </Label>
          <div style={{ position: "relative" }}>
            <i
              className="bx bx-user"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#6c757d",
                fontSize: "16px",
                zIndex: 1,
              }}
            ></i>
            <Select
              options={driverOptions}
              value={driver ? { value: driver.id, label: driver.name } : null} // Set the selected driver as an object
              onChange={handleDriverChange}
              placeholder={"Select a driving instructor"}
              isClearable
              // isDisabled={!suburb}
              styles={{
                control: (base, state) => ({
                  ...base,
                  paddingLeft: "40px",
                  borderColor: state.isFocused ? "#6c757d" : base.borderColor,
                  boxShadow: state.isFocused
                    ? "0 0 0 0.2rem rgba(0,123,255,.25)"
                    : "none",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#6c757d",
                }),
                singleValue: (base) => ({
                  ...base,
                  marginLeft: "10px",
                }),
              }}
            />
          </div>
        </div>

        <div className="form-group mb-3">
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
        <div className="form-group mb-3">
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
        <div className="form-group mb-3">
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
        <Button color="success" onClick={handleSubmit}>
          Add Time
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
