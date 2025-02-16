import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import { useFormik } from "formik";
import * as Yup from "yup";
import EventService from "../../../services/EventServices/EventService";
import { toast } from "react-hot-toast";
import AppointmentService from "../../../services/AppointmentServices/AppointmentService";
import CustomerServices from "../../../services/CustomerServices/CustomerServices";
import Select from "react-select";
import PackageService from "../../../services/PackageServices/PackageService";
import DriverSlotDate from "./SlotDate";
// import AddressSelect from "./SelectAddress";

const AddAppointment = ({
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
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("🚀 ~ Calender ~ user:", user);
  const driverId = user?.user?.id;
  // console.log("Driver id in customer", driverId);

  const userType = user?.user?.user_type;

  const [sortBy, setSortBy] = useState(null);
  const [sortPackage, setSortPackage] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [filteredCustomerData, setFilteredCustomerData] = useState([]);
  const [filteredPackageData, setFilteredPackageData] = useState([]);
  const [sortbyname, setSortByName] = useState([]);
  // console.log("🚀 ~ sortbyname:", sortbyname);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  // console.log("🚀 ~ selectedCustomer:", selectedCustomer);
  const [sortByPackage, setSortByPackage] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPackage, setSelectedPackage] = useState({});
  // console.log("🚀 ~ selectedPackage:", selectedPackage)
  const [totalSelectedSlots, setTotalSelectedSlots] = useState([]);
  console.log("🚀 ~ totalSelectedSlots:", totalSelectedSlots);

  const [totalDateTime, setTotalDateTime] = useState([]);
  console.log("🚀 ~ totalDateTime:", totalDateTime);

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

  const [customDuration, setCustomDuration] = useState("00:00");
  console.log("🚀 ~ customDuration:", customDuration);
  const [startTime, setStartTime] = useState("");
  console.log("🚀 ~ startTime:", startTime);
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
  const [driver, setDriver] = useState();
  const [loading, setLoading] = useState(false);

  const handleSelectedSlots = (slots) => {
    setTotalSelectedSlots(slots);
  };

  const handleAddress = (slots) => {
    setAddress(slots);
  };
  const [data, setData] = useState([]);

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
      // console.log("Response in customer", response);
      const customers = response.data || [];
      // console.log("🚀 ~ fetchCustomer ~ customers:", customers);
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
      const response = await PackageService.getList();
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
    const filteredData = customerData.filter((customer) =>
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const appointmentSessions = (
    totalSelectedSlots?.length > 0 ? totalSelectedSlots : totalDateTime
  )?.map((slot) => ({
    start_time: slot.start_time || formatDate(slot.startTime || startTime),
    end_time: slot.end_time || formatDate(slot.endTime || endTime),
    duration: totalDateTime?.length ? customDuration : duration, // Use customDuration if totalDateTime exists
  }));

  const handleDurationChange = (event) => {
    setDuration(Number(event.target.value)); // Convert to number
  };

  const calculateEndTime = (startTime, customDuration) => {
    if (!startTime || !customDuration) return;

    // Ensure start time is in a valid format (DD/MM/YYYY HH:mm)
    let startDate;
    if (typeof startTime === "string") {
      // Handle startTime as "DD/MM/YYYY HH:mm" format
      const [datePart, timePart] = startTime.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes] = timePart.split(":").map(Number);

      // Manually create a Date object using the parsed parts
      startDate = new Date(year, month - 1, day, hours, minutes);
    } else {
      // If startTime is already a Date object, use it directly
      startDate = new Date(startTime);
    }

    // Determine total minutes from duration (customDuration in "HH:mm")
    const [durationHours, durationMinutes] = customDuration
      .split(":")
      .map(Number);
    const totalDurationInMinutes = durationHours * 60 + durationMinutes;

    // Add totalDurationInMinutes to the start date
    const endDate = new Date(
      startDate.getTime() + totalDurationInMinutes * 60000
    );

    // Format end time as "YYYY-MM-DD HH:mm" in the local time zone
    const formattedEndTime = `${endDate.getFullYear()}-${String(
      endDate.getMonth() + 1
    ).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")} ${String(
      endDate.getHours()
    ).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

    // Set the end time state
    setEndTime(formattedEndTime);
  };
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
            driver: +driverId, // suburb: +suburb,
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
  const [errors, setErrors] = useState({
    startTime: "",
    customDuration: "",
    amount: "",
  });
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
                  setSortBy(option); // If still needed
                  setSelectedCustomer(option.data);
                }}
                options={sortbyname}
                className="js-example-basic-single mb-0"
              />
            </Col>
            <Col xs={12} lg={6} className="mb-3">
              <Label>Package</Label>
              <Select
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
                      if (date && customDuration) {
                        calculateEndTime(date, customDuration);
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
                  <Flatpickr
                    ref={flatpickrRef}
                    placeholder="Select duration"
                    className={`form-control ${
                      errors.customDuration ? "is-invalid" : ""
                    }`}
                    value={customDuration}
                    onChange={(selectedDates) => {
                      if (selectedDates.length > 0) {
                        const hours = selectedDates[0].getHours();
                        const minutes = selectedDates[0].getMinutes();
                        const formattedDuration = `${String(hours).padStart(
                          2,
                          "0"
                        )}:${String(minutes).padStart(2, "0")}`;

                        if (formattedDuration === "") {
                          setErrors((prev) => ({
                            ...prev,
                            customDuration: "Duration is required",
                          }));
                        } else {
                          setCustomDuration(formattedDuration);
                          setErrors((prev) => ({
                            ...prev,
                            customDuration: "",
                          }));
                          if (startTime) {
                            calculateEndTime(startTime, formattedDuration);
                          }
                        }
                      }
                    }}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: "H:i",
                      time_24hr: true,
                      // defaultDate: "00:00",
                      defaultHour: "00",
                      defaultMinute: "00",
                      disableMobile: true,
                    }}
                  />
                  {errors.customDuration && (
                    <div className="text-danger">{errors.customDuration}</div>
                  )}
                </Col>

                <Col md={6} xs={12} className="mb-2">
                  <Label>End Time</Label>
                  <input
                    type="text"
                    className="form-control"
                    value={endTime ? formatEndTimeForDisplay(endTime) : ""}
                    readOnly
                  />
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

            <DriverSlotDate
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
            {/* <button
              className="btn btn-success"
              type="submit"
              disabled={
                totalSelectedSlots.length !== selectedPackage.course_duration
              }
            ></button> */}
            <button className="btn btn-danger" type="button" onClick={toggle}>
              Cancel
            </button>
            <Button
              className="mr-3 me-2"
              color="success"
              type="submit"
              disabled={loading}
            >
              {isEdit ? "Save Changes" : "Add Appointment"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddAppointment;
