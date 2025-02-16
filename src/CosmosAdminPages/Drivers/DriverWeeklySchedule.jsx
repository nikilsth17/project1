import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Input,
  InputGroup,
  Row,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CustomDataTable from "../../Components/CustomTable/CustomTable";
import DriverModal from "./Component/DriverModal";
import { driverData } from "./data/data";
import DriverWeeklyService from "../../services/DriverWeeklyService/DriverWeeklyService";
import Select from "react-select";
import DriverServices from "../../services/DriverServices/DriverServices";

const DriverWeeklySchedule = () => {
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState({
    driver: "",
  });
  const [data, setData] = useState([]);
  console.log("🚀 ~ DriverWeeklySchedule ~ data:", data);
  const [driverData, setDriverData] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterText((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await DriverWeeklyService.get({ driver_id: "" });
        if (response && Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.error("Unexpected response format:", response);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  // const TimeSlotCell = ({ times }) => {
  //   // Handle null, undefined, or empty array
  //   if (!Array.isArray(times) || times.length === 0) {
  //     return <span className="text-gray-500">No Slots</span>;
  //   }

  //   return (
  //     <ul className="list-none m-0 p-2 list-unstyled">
  //       {times.map((slot, index) => (
  //         <li key={index} className="mb-2 fs-12">
  //           {slot?.start_time || "N/A"} - {slot?.end_time || "N/A"}
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // };

  // const TimeSlotCell = ({ dayData }) => {
  //   if (dayData === null) {
  //     return <span >No Time Slots</span>;
  //   }

  //   if (!dayData.is_available) {
  //     return (
  //       <span className="text-danger ">Not Available</span>
  //     );
  //   }

  //   if (!Array.isArray(dayData.times) || dayData.times.length === 0) {
  //     return <span >No Time Slots</span>;
  //   }

  //   return (
  //     <ul className="list-none m-0 p-2 list-unstyled">
  //       {dayData.times.map((slot, index) => (
  //         <li key={index} className="mb-2 fs-12">
  //           {slot?.start_time || "N/A"} - {slot?.end_time || "N/A"}
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // };

  // const columns = [
  //   {
  //     name: "Driver Name",
  //     selector: (row) => row.driver || "No Name",
  //     cell: (row) => (
  //       <Link to={`/driver/weekly-schedule/${row.driver_id}`}>
  //         {row.driver?.user?.name || "No Driver Name"} {row.driver?.user?.surname}
  //       </Link>
  //     ),
  //     sortable: true,
  //   },
  //   ...days.map((day) => ({
  //     name: day.toUpperCase(),
  //     selector: (row) => row[day] || {}, // Ensure row[day] is an object
  //     cell: (row) => (
  //       <TimeSlotCell times={row[day]?.times || []} /> // Safely handle times
  //     ),
  //     center: true,
  //   })),
  // ];

  //filter by driver

  const TimeSlotCell = ({ dayData }) => {
    // Handle null day data
    if (dayData === null) {
      return <span className="">No Time Slots</span>;
    }

    // Handle day marked as unavailable
    if (!dayData.is_available) {
      return <span className="text-danger fw-bold">Not Available</span>;
    }

    // Handle no valid time slots
    const hasValidSlots = dayData.times.some(
      (slot) => slot.start_time && slot.end_time
    );
    if (!hasValidSlots) {
      return <span className="">No Time Slots</span>;
    }

    // Render valid time slots
    return (
      <ul className="list-none m-0 p-2 list-unstyled">
        {dayData.times.map(
          (slot, index) =>
            slot.start_time &&
            slot.end_time && (
              <li key={index} className="mb-2 fs-12">
                {slot.start_time} - {slot.end_time}
              </li>
            )
        )}
      </ul>
    );
  };

  const columns = [
    {
      name: "Instructor ",
      selector: (row) => row.driver || "No Name",
      cell: (row) => (
        <Link to={`/driver/weekly-schedule/${row.driver_id}`}>
          {row.driver?.user?.name || "No Driver Name"}{" "}
          {row.driver?.user?.surname}
        </Link>
      ),
      sortable: true,
    },
    ...days.map((day) => ({
      name: day.toUpperCase(),
      selector: (row) => row[day] || {}, // Ensure row[day] is an object
      cell: (row) => <TimeSlotCell dayData={row[day]} />, // Use updated TimeSlotCell
      center: true,
    })),
  ];

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await DriverServices.get();
        setDriverData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDriver();
  }, []);

  const driverOptions = [
    { value: "all", label: "All Instructor" }, // Manually added option
    ...(driverData?.map((item) => ({
      value: item.id,
      label: `${item.name} ${item.surname}`,
    })) || []), // Existing options from driverData
  ];

  const [selectedDriver, setSelectedDriver] = useState(
    driverOptions.find((option) => option.value === "all") // Default to "All"
  );
  const handleDriverChange = (selectedOption) => {
    setSelectedDriver(
      selectedOption || driverOptions.find((option) => option.value === "all")
    );
    console.log("Selected Driver:", selectedOption);
  };
  const filteredData = data?.filter((item) => {
    const matchesDriver =
      selectedDriver?.value === "all"
        ? true // Show all events when "All" is selected
        : item?.driver_id === selectedDriver?.value;
    return matchesDriver;
  });

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Instructor List" pageTitle="Instructor" />
      </div>

      <Row className="mb-3">
        {/* <Col md={5}>
          <InputGroup className="d-flex gap-3">
            <Input
              name="driver"
              placeholder="Search by driver name"
              value={filterText.driver}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Col> */}
        <Col md={3} xs={12} className="mb-2">
          <div style={{ position: "relative" }}>
            <i
              className="bx bx-user"
              style={{
                position: "absolute",
                left: "5px", // Reduce left offset to align properly
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#6c757d",
                fontSize: "16px",
                zIndex: 999,
              }}
            ></i>

            <Select
              options={driverOptions}
              value={selectedDriver}
              onChange={handleDriverChange}
              placeholder="Select a driver"
              isClearable={selectedDriver?.value !== "all"}
              menuPortalTarget={document.body} // Renders the menu in the body
              styles={{
                control: (base, state) => ({
                  ...base,
                  paddingLeft: "25px",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 1050, // Adjust as needed
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999, // Ensure it’s above everything
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#6c757d",
                }),
                singleValue: (base) => ({
                  ...base,
                  marginLeft: "5px",
                }),
              }}
            />
          </div>
        </Col>
      </Row>

      <Card>
        <CustomDataTable
          responsive
          pagination
          progressPending={loading}
          data={filteredData}
          columns={columns}
          progressComponent={
            <div className="my-3">
              <Triangle
                visible={true}
                height="80"
                width="80"
                color="#5B71B9"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <h5 className="mt-1">Loading...</h5>
            </div>
          }
          customStyles={{
            headCells: {
              style: {
                fontSize: "0.8rem",
                fontWeight: 610,
              },
            },
            rows: {
              style: {
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            },
          }}
        />
      </Card>
    </div>
  );
};

export default DriverWeeklySchedule;
