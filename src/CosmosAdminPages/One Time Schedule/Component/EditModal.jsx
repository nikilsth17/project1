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
import Select from "react-select";

const EditModal = ({
  isOpen,
  toggle,
  data,
  setData,
  selectedTimeSlot,
  driverData,
}) => {
  const driverOptions =
    driverData?.map((item) => ({
      value: item.id,
      label: `${item.name} ${item.surname}`,
    })) || [];

  const [timeSlot, setTimeSlot] = useState({
    title: "",
    fromDate: null,
    toDate: null,
  });

  const [driver, setDriver] = useState(null);

  useEffect(() => {
    if (selectedTimeSlot) {
      setTimeSlot({
        title: selectedTimeSlot.title || "",
        fromDate: new Date(selectedTimeSlot.from_date),
        toDate: new Date(selectedTimeSlot.to_date),
      });

      // Only set the initial driver value once when the modal opens
      const matchingDriver = driverOptions.find(
        (driver) => driver.value === selectedTimeSlot.driver_id
      );
      setDriver(matchingDriver || null);
    }
  }, [selectedTimeSlot]);

  const handleFromDateChange = (date) => {
    setTimeSlot((prev) => ({ ...prev, fromDate: date[0] }));
  };

  const handleToDateChange = (date) => {
    setTimeSlot((prev) => ({ ...prev, toDate: date[0] }));
  };

  const handleDriverChange = (selectedOption) => {
    setDriver(selectedOption); // Update state with the new driver
  };

  const handleSubmit = async () => {
    const { title, fromDate, toDate } = timeSlot;

    if (!title.trim() || !fromDate || !toDate) {
      toast.error("Please fill in all fields and select valid dates.");
      return;
    }

    // Format dates to "YYYY-MM-DD HH:mm"
    const formatDate = (date) => {
      const pad = (num) => String(num).padStart(2, "0");
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    try {
      const response = await OneTimeService.update(selectedTimeSlot.id, {
        driver_id: driver?.value || null,
        title,
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      });

      if (response?.data) {
        const updatedSlot = {
          ...response.data,
          dates: [{ date: formatDate(fromDate) }, { date: formatDate(toDate) }],
        };

        setData((prevData) =>
          prevData.map((slot) =>
            slot.id === selectedTimeSlot.id ? updatedSlot : slot
          )
        );

        setTimeSlot({ title: "", fromDate: null, toDate: null });
        toast.success("Time slot updated successfully!");
        toggle();
      }
    } catch (error) {
      console.error("Error updating time slot:", error);
      toast.error(error.message || "Error updating time slot");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit One-Time Schedule</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <Label className="form-label mb-1">Driving Instructor</Label>
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
              value={driver} // This ensures React-Select reflects the state
              onChange={handleDriverChange}
              placeholder="Select a driving instructor"
              isClearable
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
        <div className="mb-3">
          <Label htmlFor="title" className="form-label">
            Title
          </Label>
          <input
            type="text"
            id="title"
            name="title"
            value={timeSlot.title}
            onChange={(e) =>
              setTimeSlot((prev) => ({ ...prev, title: e.target.value }))
            }
            className="form-control"
            placeholder="Enter title's name"
            required
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="fromDate" className="form-label">
            From Date
          </Label>
          <Flatpickr
            className="form-control"
            value={timeSlot.fromDate}
            onChange={handleFromDateChange}
            options={{
              altInput: true,
              altFormat: "d/m/Y H:i",
              enableTime: true,
              dateFormat: "d/m/Y H:i",
              minDate: "today",
            }}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="toDate" className="form-label">
            To Date
          </Label>
          <Flatpickr
            className="form-control"
            value={timeSlot.toDate}
            onChange={handleToDateChange}
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
          Update Time
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
