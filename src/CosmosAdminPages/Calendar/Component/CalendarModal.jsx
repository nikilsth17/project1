import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import { useFormik } from "formik";
import * as Yup from "yup";
import EventService from "../../../services/EventServices/EventService";
import { toast } from "react-hot-toast";
import AppointmentService from "../../../services/AppointmentServices/AppointmentService";
import CustomerServices from "../../../services/CustomerServices/CustomerServices";
import Select from "react-select";
import SelectSlotDate from "./SelectSlotDate";
import PackageService from "../../../services/PackageServices/PackageService";
import AddressSelect from "./SelectAddress";

const CalendarModal = ({
  isOpen,
  toggle,
  event,
  isEdit,
  setDeleteModal,
  submitOtherEvent,
  setSelectedNewDay,
  selectedNewDay,
  setEvent,
  onFormSubmit,
}) => {
  useEffect(() => {
    setEvent(event); // Update the state when the event prop changes
  }, [event, setEvent]);

  const [sortBy, setSortBy] = useState(null);
  const [sortPackage, setSortPackage] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [filteredCustomerData, setFilteredCustomerData] = useState([]);
  const [filteredPackageData, setFilteredPackageData] = useState([]);
  const [sortbyname, setSortByName] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  // console.log("🚀 ~ selectedCustomer:", selectedCustomer);
  const [sortByPackage, setSortByPackage] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPackage, setSelectedPackage] = useState({});
  // console.log("🚀 ~ selectedPackage:", selectedPackage)
  const [totalSelectedSlots, setTotalSelectedSlots] = useState([]);

  const [totalDateTime, setTotalDateTime] = useState([]);
  // console.log("🚀 ~ totalDateTime:", totalDateTime);
  // console.log("🚀 ~ totalSelectedSlots:", totalSelectedSlots);
  const [address, setAddress] = useState([]);

  const [total, setTotal] = useState(selectedPackage?.price || 0);
  const [basePrice, setBasePrice] = useState(selectedPackage?.price || 0);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    if (duration === 2 && selectedPackage?.package_type === "PER-HOUR") {
      setBasePrice((selectedPackage?.price || 0) * 2);
    } else {
      setBasePrice(selectedPackage?.price || 0);
    }
  }, [selectedPackage, duration]); // Added `duration` as a dependency

  useEffect(() => {
    setTotal(basePrice);
  }, [basePrice]);

  console.log("🚀 ~ total:", total);
  console.log("🚀 ~ basePrice:", basePrice);

  const [customDuration, setCustomDuration] = useState("00:00");
  console.log("🚀 ~ customDuration:", customDuration);
  const [startTime, setStartTime] = useState("");
  console.log("🚀 ~ startTime:", startTime);
  // console.log("🚀 ~ startTime:", startTime);
  const [endTime, setEndTime] = useState("");
  console.log("🚀 ~ endTime:", endTime);
  // Update totalDateTime whenever startTime, endTime, or duration changes
  useEffect(() => {
    const newDateTime =
      startTime || endTime || customDuration
        ? [{ startTime, endTime, customDuration }]
        : [];

    setTotalDateTime(newDateTime);
  }, [startTime, endTime, customDuration]);

  const [suburb, setSuburb] = useState();
  // console.log("🚀 ~ suburb:", suburb);
  const [driver, setDriver] = useState();
  // console.log("🚀 ~ useEffect ~ driver:", driver);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    startTime: "",
    customDuration: "",
    amount: "",
  });

  const handleSelectedSlots = (slots) => {
    setTotalSelectedSlots(slots);
  };

  const handleAddress = (slots) => {
    setAddress(slots);
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so +1
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  // Fetch customer data
  const fetchCustomer = async () => {
    try {
      const response = await CustomerServices.getList();
      const customers = response.data || [];
      setFilteredCustomerData(customers);
      setCustomerData(customers);
      setSortByName(
        customers.map((customer) => ({
          value: customer.id,
          label: `${customer.name} ${customer.surname}`,
          data: customer,
        }))
      );
    } catch (error) {
      setCustomerData([]);
      setFilteredCustomerData([]);
      setSortByName([]);
    }
  };

  // Fetch package data
  const fetchPackage = async () => {
    try {
      const response = await PackageService.getPackages();
      const packages = response.data || [];
      setPackageData(packages);
      setFilteredPackageData(packages);
      setSortByPackage(
        packages.map((item) => ({
          value: item.name,
          label: item.name,
          data: item,
        }))
      );
    } catch (error) {
      setFilteredPackageData([]);
      setPackageData([]);
      setSortByPackage([]);
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchPackage();
  }, []);

  useEffect(() => {
    const filteredData = customerData.filter(
      (customer) =>
        customer.name &&
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomerData(filteredData);
  }, [searchQuery, customerData]);

  useEffect(() => {
    if (sortBy && filteredCustomerData.length > 0) {
      const sortedData = [...filteredCustomerData].sort((a, b) => {
        return sortBy.value === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });
      setFilteredCustomerData(sortedData);
    }
  }, [sortBy]);

  // const appointmentSessions = totalSelectedSlots?.map((slot) => ({
  //   start_time: `${slot.start_time || formatDate(startTime)}`,
  //   end_time: `${slot.end_time || formatDate(endTime)}`,
  //   duration: duration,
  // }));

  const appointmentSessions = (
    totalSelectedSlots?.length > 0 ? totalSelectedSlots : totalDateTime
  )?.map((slot) => ({
    start_time: slot.start_time || formatDate(slot.startTime || startTime),
    end_time: slot.end_time || formatDate(slot.endTime || endTime),
    duration: totalDateTime?.length ? customDuration : duration, // Use customDuration if totalDateTime exists
  }));

  // console.log("🚀 ~ appointmentSessions:", appointmentSessions);

  // const handleDurationChange = (e) => {
  //   const newDuration = Number(e.target.value); // Convert the selected value to a number
  //   setDuration(newDuration);
  // };

  const validateDuration = (duration) => {
    // Validate the format "HH:mm"
    const regex = /^\d{2}:\d{2}$/;
    if (!regex.test(duration)) return false;
  
    const [hours, minutes] = duration.split(":").map(Number);
    return hours >= 0 && minutes >= 0 && minutes < 60; // Validate hours and minutes
  };
  
  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    const isValid = validateDuration(newDuration);
  
    setCustomDuration(newDuration);
    if (isValid) {
      setErrors((prev) => ({ ...prev, customDuration: "" }));
  
      if (startTime) {
        const newEndTime = calculateEndTime(startTime, newDuration);
        setEndTime(newEndTime);
      } else if (endTime) {
        const newStartTime = calculateStartTime(endTime, newDuration);
        setStartTime(newStartTime);
      }
    } else {
      setErrors((prev) => ({ ...prev, customDuration: "Invalid duration format (HH:mm)" }));
    }
  };
  

  // const handleCustomDurationChange = (value) => {
  //   if (Array.isArray(value) && value.length > 0) {
  //     // Flatpickr returns an array of dates
  //     const selectedTime = value[0];
  //     const hours = String(selectedTime.getHours()).padStart(2, "0");
  //     const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
  //     const formattedDuration = `${hours}:${minutes}`;

  //     setCustomDuration(formattedDuration); // Store as "HH:MM"
  //     calculateEndTime(startTime, formattedDuration);
  //   }
  // };
  // const calculateEndTime = (startTime, customDuration) => {
  //   if (!startTime || !customDuration) return;

  //   // Ensure start time is in a valid format (DD/MM/YYYY HH:mm)
  //   let startDate;
  //   if (typeof startTime === "string") {
  //     // Handle startTime as "DD/MM/YYYY HH:mm" format
  //     const [datePart, timePart] = startTime.split(" ");
  //     const [day, month, year] = datePart.split("/").map(Number);
  //     const [hours, minutes] = timePart.split(":").map(Number);

  //     // Manually create a Date object using the parsed parts
  //     startDate = new Date(year, month - 1, day, hours, minutes);
  //   } else {
  //     // If startTime is already a Date object, use it directly
  //     startDate = new Date(startTime);
  //   }

  //   // Determine total minutes from duration (customDuration in "HH:mm")
  //   const [durationHours, durationMinutes] = customDuration
  //     .split(":")
  //     .map(Number);
  //   const totalDurationInMinutes = durationHours * 60 + durationMinutes;

  //   // Add totalDurationInMinutes to the start date
  //   const endDate = new Date(
  //     startDate.getTime() + totalDurationInMinutes * 60000
  //   );

  //   // Format end time as "YYYY-MM-DD HH:mm" in the local time zone
  //   const formattedEndTime = `${endDate.getFullYear()}-${String(
  //     endDate.getMonth() + 1
  //   ).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")} ${String(
  //     endDate.getHours()
  //   ).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

  //   // Set the end time state
  //   setEndTime(formattedEndTime);
  // };
  const [amount, setAmount] = useState("");

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };
  // Formik setup
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      pickupAddress: selectedCustomer?.address,
    },
    validationSchema: Yup.object({
      pickupAddress: Yup.string().required("Please Enter a Location"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEdit) {
          // Handle edit logic
        } else {
          const newEvent = {
            customer_id: selectedCustomer?.id,
            package_id: selectedPackage?.id,
            pickup_location: selectedCustomer?.address,
            course_duration: selectedPackage?.course_duration,
            session_duration:
              totalDateTime?.length > 0 ? customDuration : duration || 0,
            payment_type_id: 1,
            payment_status: "PENDING",
            base_price: totalDateTime?.length > 0 ? amount : basePrice || 0,
            service_fee: 0,
            gst: 0,
            total_amount: totalDateTime?.length > 0 ? amount : total || 0,
            appointment_status: "APPOINTMENT-CREATED",
            appointment_sessions: appointmentSessions || [],
            driver: +driver.id,
          };

          await EventService.create(newEvent);
          toast.success("Booking created successfully.");

          // Reset form and states
          validation.resetForm();
          setSelectedNewDay(null);
          setSelectedCustomer(null);
          setSelectedPackage({});
          setTotalSelectedSlots([]);
          setAddress([]);
          toggle();
        }
        onFormSubmit(); // Callback to trigger refresh in parent
      } catch (error) {
        toast.error("An error occurred while submitting.");
      } finally {
        setLoading(false);
      }
    },
  });
  const flatpickrRef = useRef(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      validation.resetForm();
      setSelectedPackage({});
      setDriver(null);
      setTotalDateTime([]);
      setEndTime(null);
      setStartTime(null);
      setTotalSelectedSlots([]);
      setCustomerData([]);
      setCustomDuration(null);
      // setSelectedNewDay(null);
      setSelectedCustomer(null);
      setAddress([]);
      setSuburb(null);
      setAmount(null);
    }
  }, [isOpen]);

  const formatEndTimeForDisplay = (time) => {
    if (!time) return "";
    const [datePart, timePart] = time.split(" ");
    const [year, month, day] = datePart.split("-");
    const [hours, minutes] = timePart.split(":");

    return `${parseInt(day)}/${parseInt(month)}/${year} ${parseInt(
      hours
    )}:${minutes}`;
  };

  const validateDateTime = (dateTime) => {
    // Validate the format "dd/mm/yyyy HH:mm"
    const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/;
    if (!regex.test(dateTime)) return false;

    // Parse the date and time parts
    const [datePart, timePart] = dateTime.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    // Validate the parsed date
    const date = new Date(year, month - 1, day, hours, minutes);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date.getHours() === hours &&
      date.getMinutes() === minutes
    );
  };

  const parseDateTime = (dateTime) => {
    // If dateTime is already a Date object, return it directly
    if (dateTime instanceof Date) {
      return dateTime;
    }

    // If dateTime is a string, parse it
    if (typeof dateTime === "string") {
      const [datePart, timePart, period] = dateTime.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes] = timePart.split(":").map(Number);

      // Convert 12-hour format to 24-hour format
      let hours24 = hours;
      if (period === "PM" && hours !== 12) {
        hours24 += 12;
      } else if (period === "AM" && hours === 12) {
        hours24 = 0;
      }

      return new Date(year, month - 1, day, hours24, minutes);
    }

    // If dateTime is neither a Date nor a string, throw an error
    throw new Error(
      "Invalid dateTime format. Expected a Date object or a string in 'dd/mm/yyyy hh:mm AM/PM' format."
    );
  };

  const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours() % 12 || 12).padStart(2, "0"); // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = date.getHours() >= 12 ? "PM" : "AM";
    return `${day}/${month}/${year} ${hours}:${minutes} ${period}`;
  };

  const calculateDuration = (startTime, endTime) => {
    const startDate = parseDateTime(startTime);
    const endDate = parseDateTime(endTime);

    // Calculate the difference in milliseconds
    const diff = endDate.getTime() - startDate.getTime();

    // Handle negative differences (invalid case)
    if (diff < 0) {
      return "00:00";
    }

    // Convert milliseconds to hours and minutes
    const totalMinutes = Math.floor(diff / 60000); // 1 minute = 60000 ms
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format as "HH:mm"
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const calculateEndTime = (startTime, customDuration) => {
    const startDate = new Date(startTime);
    const [hours, minutes] = customDuration.split(":").map(Number);
    const totalDurationInMinutes = hours * 60 + minutes;

    const endDate = new Date(
      startDate.getTime() + totalDurationInMinutes * 60000
    );
    return endDate; // Return a Date object
  };

  const calculateStartTime = (endTime, customDuration) => {
    const endDate = new Date(endTime);
    const [hours, minutes] = customDuration.split(":").map(Number);
    const totalDurationInMinutes = hours * 60 + minutes;

    const startDate = new Date(
      endDate.getTime() - totalDurationInMinutes * 60000
    );
    return startDate; // Return a Date object
  };
  const handleEndTimeChange = ([date]) => {
    // date is a Date object from Flatpickr
    const newEndTime = date; // Use the Date object directly
    const isValid = true; // Flatpickr ensures valid dates, so no need for additional validation

    setEndTime(newEndTime); // Set endTime as a Date object
    setErrors((prev) => ({ ...prev, endTime: "" }));

    const currentStartTime = startTime;

    if (currentStartTime) {
      const newDuration = calculateDuration(currentStartTime, newEndTime);
      setCustomDuration(newDuration);
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static">
      <ModalHeader toggle={toggle} className="p-3 bg-info-subtle modal-title">
        {isEdit ? `${event.title}` : "Add Appointment"}
      </ModalHeader>
      <ModalBody>
        <Form className="needs-validation" onSubmit={validation.handleSubmit}>
          {isEdit && (
            <div className="text-end">
              <Link
                to="#"
                className="btn btn-sm btn-soft-primary"
                onClick={(e) => {
                  e.preventDefault();
                  submitOtherEvent();
                }}
              >
                Edit
              </Link>
            </div>
          )}

          <Row className="event-form">
            <Col xs={12} lg={6} className="mb-3">
              <Label>Customer Name</Label>
              <Select
                value={
                  selectedCustomer &&
                  selectedCustomer.name &&
                  selectedCustomer.surname
                    ? {
                        value: selectedCustomer.id,
                        label: `${selectedCustomer.name} ${selectedCustomer.surname}`,
                      }
                    : null
                }
                onChange={(option) => {
                  if (option?.data) {
                    setSelectedCustomer(option.data);
                  }
                }}
                placeholder="Select the customer"
                options={sortbyname}
                className="js-example-basic-single mb-0"
              />
            </Col>

            <Col xs={12} lg={6} className="mb-3">
              <Label>Package</Label>
              <Select
                placeholder="Select the package"
                value={
                  selectedPackage
                    ? {
                        value: selectedPackage.name,
                        label: selectedPackage.name,
                      }
                    : null
                }
                onChange={(option) => {
                  setSortPackage(option); // If still needed
                  setSelectedPackage(option.data);
                }}
                options={sortByPackage}
                className="js-example-basic-single mb-0"
              />
            </Col>

            {selectedPackage?.is_admin_package === 1 ? (
              <>
                <Col md={6} xs={12} className="mb-2">
                  <Label>Start Time</Label>
                  <Flatpickr
                    placeholder="Select a start time"
                    className={`form-control ${
                      errors.startTime ? "is-invalid" : ""
                    }`}
                    value={startTime}
                    onChange={([date]) => {
                      setStartTime(date);
                      setErrors((prev) => ({ ...prev, startTime: "" }));

                      if (date) {
                        if (customDuration) {
                          const newEndTime = calculateEndTime(
                            date,
                            customDuration
                          );
                          setEndTime(newEndTime);
                        } else if (endTime) {
                          const newDuration = calculateDuration(date, endTime);
                          setCustomDuration(newDuration);
                        }
                      }
                    }}
                    options={{
                      enableTime: true,
                      altInput: true,
                      noCalendar: false,
                      dateFormat: "d/m/Y H:i",
                      altFormat: "d/m/Y H:i",
                      time_24hr: false,
                      defaultDate: new Date(),
                      disableMobile: true,
                    }}
                  />
                  {errors.startTime && (
                    <div className="text-danger">{errors.startTime}</div>
                  )}
                </Col>

                <Col md={6} xs={12} className="mb-2">
                  <Label>Duration</Label>
                  <input
                    type="text"
                    placeholder="Enter duration (HH:mm)"
                    className={`form-control ${
                      errors.customDuration ? "is-invalid" : ""
                    }`}
                    value={customDuration}
                    onChange={handleDurationChange}
                  />
                  {errors.customDuration && (
                    <div className="text-danger">{errors.customDuration}</div>
                  )}
                </Col>

                <Col md={6} xs={12} className="mb-2">
                  <Label>End Time</Label>
                  <Flatpickr
                    placeholder="Select an end time"
                    className={`form-control ${
                      errors.endTime ? "is-invalid" : ""
                    }`}
                    value={endTime}
                    onChange={handleEndTimeChange}
                    options={{
                      enableTime: true,
                      altInput: true,
                      noCalendar: false,
                      dateFormat: "d/m/Y H:i",
                      altFormat: "d/m/Y H:i",
                      time_24hr: false,
                      defaultDate: new Date(),
                      disableMobile: true,
                    }}
                  />
                  {errors.endTime && (
                    <div className="text-danger">{errors.endTime}</div>
                  )}
                </Col>

                <Col md={6} xs={12} className="mb-2">
                  <Label>Package Amount</Label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.amount ? "is-invalid" : ""
                    }`}
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value.trim(); // Trim spaces to avoid empty input issues
                      if (!value) {
                        setErrors((prev) => ({
                          ...prev,
                          amount: "Amount is required",
                        }));
                      } else if (!/^\d*\.?\d*$/.test(value)) {
                        setErrors((prev) => ({
                          ...prev,
                          amount: "Amount must be a valid number",
                        }));
                      } else {
                        setErrors((prev) => ({ ...prev, amount: "" }));
                      }
                      handleAmount(e);
                    }}
                    onBlur={() => {
                      if (!amount) {
                        setErrors((prev) => ({
                          ...prev,
                          amount: "Amount is required",
                        }));
                      }
                    }}
                  />
                  {errors.amount && (
                    <div className="text-danger">{errors.amount}</div>
                  )}
                </Col>
              </>
            ) : (
              <Col lg={6} xs={12}>
                {selectedPackage?.package_type === "PER-HOUR" && (
                  <div>
                    <Label>Lesson duration</Label>
                    <div style={{ position: "relative" }}>
                      <i
                        className="bx bx-time-five"
                        style={{
                          position: "absolute",
                          left: "10px", // Place the icon on the left side
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#6c757d",
                          fontSize: "16px",
                        }}
                      ></i>
                      <Input
                        type="select"
                        name="duration"
                        value={duration}
                        onChange={handleDurationChange}
                        className="mb-3"
                        // disabled={!address}
                        style={{ paddingLeft: "40px" }} // Add padding to make room for the icon
                      >
                        <option value={1}>1 hour</option>
                        <option value={2}>2 hour</option>
                      </Input>
                    </div>
                  </div>
                )}
              </Col>
            )}

            <SelectSlotDate
              selectedPackage={selectedPackage}
              onSelectedSlotsChange={handleSelectedSlots}
              setSelectedPackage={setSelectedPackage}
              onAddress={handleAddress}
              suburb={suburb}
              setSuburb={setSuburb}
              driver={driver}
              setDriver={setDriver}
              setDuration={setDuration}
              duration={duration}
            />
          </Row>

          <div className="hstack gap-2 justify-content-end">
            <button className="btn btn-danger" type="button" onClick={toggle}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              type="submit"
              disabled={
                loading ||
                (!driver &&
                  (totalSelectedSlots.length !==
                    selectedPackage.course_duration ||
                    !startTime))
              }
            >
              {isEdit ? "Save Changes" : "Add Appointment"}
            </button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CalendarModal;
