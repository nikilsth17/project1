import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";

import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CustomDataTable from "../../../Components/CustomTable/CustomTable";
import EditTimeModal from "../../Weekly Schedule/Component/EditTimeModal";
import WeeklyService from "../../../services/Weekly Schedule Service/WeeklyService";
import { useParams } from "react-router-dom";
import DriverWeeklyService from "../../../services/DriverWeeklyService/DriverWeeklyService";

const DriverWeeklyScheduleDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [modal, setModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const toggleModal = (id, day) => {
    setSelectedDay(day);
    setSelectedId(id);
    setModal(!modal);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const isPM = hours >= 12;
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${isPM ? "PM" : "AM"}`;
  };

  const columns = [
    {
      name: "Day",
      selector: "day",
      sortable: false,
      cell: (row) => <div style={{ textTransform: "capitalize" }}>{row}</div>,
    },
    // {
    //   name: "Available Time",
    //   selector: "times",
    //   sortable: false,
    //   cell: (row) => (
    //     <div className="py-2 w-100">
         
    //       {data[row] === null ? (
    //         <span >No Time Slots</span>
    //       ) : data[row]?.is_available && data[row]?.times?.length > 0 ? (
    //         data[row].times.map((timeSlot, idx) => (
    //           <div
    //             key={`${row}-time-${idx}`}
    //             className="d-flex justify-content-between align-items-center"
    //           >
    //             <span className="fw-semibold text-dark">
    //               {formatTime(timeSlot.start_time)} -{" "}
    //               {formatTime(timeSlot.end_time)}
    //             </span>
    //           </div>
    //         ))
    //       ) : (
    //         <span className="text-danger fw-bold">
    //           Not Available
    //         </span>
    //       )}
    //     </div>
    //   ),
    // },
    {
      name: "Available Time",
      selector: "times",
      sortable: false,
      cell: (row) => (
        <div className="py-2 w-100">
          {data[row] === null ? (
            <span className="">No Time Slots</span>
          ) : data[row]?.is_available && data[row]?.times?.length > 0 ? (
            data[row].times.some(
              (timeSlot) => timeSlot.start_time && timeSlot.end_time
            ) ? (
              data[row].times.map((timeSlot, idx) => (
                timeSlot.start_time && timeSlot.end_time && (
                  <div
                    key={`${row}-time-${idx}`}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span className="fw-semibold text-dark">
                      {formatTime(timeSlot.start_time)} -{" "}
                      {formatTime(timeSlot.end_time)}
                    </span>
                  </div>
                )
              ))
            ) : (
              <span className="">No Time Slots</span>
            )
          ) : (
            <span className="text-danger fw-bold">Not Available</span>
          )}
        </div>
      ),
    },
    
    {
      name: "Actions",
      cell: (row) => (
        <ButtonGroup className="gap-3">
          <Button
            color="warning"
            className="rounded-circle btn-sm"
            onClick={() => toggleModal(data.id, row)}
          >
            <i className="bx bx-edit"></i>
          </Button>
        </ButtonGroup>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  // For demonstration, using the sample data directly

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await DriverWeeklyService.getById(id);
      console.log("🚀 ~ fetchData ~ response:", response);
      setData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb
          title="Weekly Schedule"
          pageTitle="Schedule Details"
          breadcrumbItems={[
            { title: "Back To List", link: "/drivers/weekly-schedule" },
          ]}
        />
      </div>
      <CustomDataTable
        responsive
        progressPending={loading}
        data={days}
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
              fontSize: "0.93rem",
              fontWeight: 610,
            },
          },
          rows: {
            style: {
              fontSize: "0.9rem",
            },
          },
        }}
      />

      <EditTimeModal
        isOpen={modal}
        toggle={() => setModal(!modal)}
        data={data}
        setData={setData}
        selectedId={selectedId}
        selectedDay={selectedDay}
        fetchData={fetchData}
      />
    </div>
  );
};

export default DriverWeeklyScheduleDetail;
