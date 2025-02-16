// import React, { useEffect, useState } from "react";
// import BreadCrumb from "../../Components/Common/BreadCrumb";
// import {
//   Button,
//   ButtonGroup,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
//   Table,
// } from "reactstrap";

// import CustomDataTable from "../../Components/CustomTable/CustomTable";
// import { Triangle } from "react-loader-spinner";
// import WeeklyService from "../../services/Weekly Schedule Service/WeeklyService";
// import EditTimeModal from "./Component/EditTimeModal";
// import { getLoggedInUser } from "../../helpers/fakebackend_helper";

// const WeeklySchedule = () => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [modal, setModal] = useState(false);
//   const [selectedId, setSelectedId] = useState("");
//   const [selectedDay, setSelectedDay] = useState("");

//   const authUser = getLoggedInUser();
//   console.log("authUserr", authUser);

//   // const driverId = authUser.user.id;
//   const driverId = 31;
//   console.log("diver id", driverId);

//   const toggleModal = (id, day) => {
//     setSelectedDay(day);
//     setSelectedId(id);
//     setModal(!modal);
//   };

//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(":").map(Number);
//     const isPM = hours >= 12;
//     const formattedHours = hours % 12 || 12; // Converts 0 to 12
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Ensures minutes are two digits
//     return `${formattedHours}:${formattedMinutes} ${isPM ? "PM" : "AM"}`;
//   };

//   const columns = [
//     {
//       name: "Day",
//       selector: "day",
//       sortable: false,
//       cell: (row) => <div style={{ textTransform: "capitalize" }}>{row}</div>,
//     },
//     {
//       name: "Available Time",
//       selector: "times",
//       sortable: false,
//       cell: (row) => (
//         <div className="py-2 w-100">
//           {data[row]?.is_available ? (
//             data[row]?.times?.length ? (
//               data[row].times.map((timeSlot, idx) => (
//                 <div
//                   key={`${row}-time-${idx}`}
//                   className="d-flex justify-content-between align-items-center"
//                 >
//                   <span className="fw-semibold text-dark">
//                     {formatTime(timeSlot.start_time)} -{" "}
//                     {formatTime(timeSlot.end_time)}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <span className="text-warning fw-bold fst-italic">
//                 No Time Slots
//               </span>
//             )
//           ) : (
//             <span className="text-secondary fw-bold">Not Available</span>
//           )}
//         </div>
//       ),
//     },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <ButtonGroup className="gap-3">
//           <Button
//             color="warning"
//             className="rounded-circle btn-sm"
//             onClick={() => toggleModal(data.id, row)}
//           >
//             <i className="bx bx-edit"></i>
//           </Button>
//         </ButtonGroup>
//       ),
//       ignoreRowClick: true,
//       allowOverflow: true,
//       button: true,
//       width: "100px",
//     },
//   ];

//   // const columns = [
//   //   {
//   //     name: "Day",
//   //     selector: "day",
//   //     sortable: false,
//   //     cell: (row) => (
//   //       <div style={{ textTransform: "capitalize" }}>{row.day}</div>
//   //     ),
//   //   },
//   //   {
//   //     name: "Available Time",
//   //     selector: "times",
//   //     sortable: false,
//   //     cell: (row) => (
//   //       <div className="py-2 w-100">
//   //         {row.is_available ? (
//   //           row.times?.length ? (
//   //             row.times.map((timeSlot, idx) => (
//   //               <div
//   //                 key={`${row.day}-time-${idx}`}
//   //                 className="d-flex justify-content-between align-items-center"
//   //               >
//   //                 <span className="fw-semibold text-dark">
//   //                   {formatTime(timeSlot.start_time)} -{" "}
//   //                   {formatTime(timeSlot.end_time)}
//   //                 </span>
//   //               </div>
//   //             ))
//   //           ) : (
//   //             <span className="text-warning fw-bold fst-italic">
//   //               No Time Slots
//   //             </span>
//   //           )
//   //         ) : (
//   //           <span className="text-secondary fw-bold">Not Available</span>
//   //         )}
//   //       </div>
//   //     ),
//   //   },
//   //   {
//   //     name: "Actions",
//   //     cell: (row) => (
//   //       <ButtonGroup className="gap-3">
//   //         <Button
//   //           color="warning"
//   //           className="rounded-circle btn-sm"
//   //           onClick={() => toggleModal(row.id, row.day)}
//   //         >
//   //           <i className="bx bx-edit"></i>
//   //         </Button>
//   //       </ButtonGroup>
//   //     ),
//   //     ignoreRowClick: true,
//   //     allowOverflow: true,
//   //     button: true,
//   //     width: "100px",
//   //   },
//   // ];

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const response = await WeeklyService.get({ driver_id: "" });
//   //       if (response && Array.isArray(response.data)) {
//   //         setData(response.data);
//   //       } else {
//   //         console.error("Unexpected response format:", response);
//   //         setData([]);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Pass the selectedId to the WeeklyService.get method
//         const response = await WeeklyService.get({ id: driverId });
//         console.log("Id for weekly schedule", driverId);
//         if (response && Array.isArray(response)) {
//           setData(response);
//         } else {
//           console.error("Unexpected response format:", response);
//           setData([]);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []); // Add selectedId as a dependency

//   return (
//     <>
//       <div className="page-content">
//         <div className="container-fluid">
//           <BreadCrumb
//             title="Weekly schedule List"
//             pageTitle="Weekly schedule"
//           />
//         </div>
//         <CustomDataTable
//           responsive
//           // striped
//           // pagination
//           // fixedHeader
//           // persistTableHead
//           progressPending={loading}
//           data={data}
//           columns={columns}
//           progressComponent={
//             <div className="my-3">
//               <Triangle
//                 visible={true}
//                 height="80"
//                 width="80"
//                 color="#5B71B9"
//                 ariaLabel="triangle-loading"
//                 wrapperStyle={{}}
//                 wrapperClass=""
//               />
//               <h5 className="mt-1">Loading...</h5>
//             </div>
//           }
//           customStyles={{
//             headCells: {
//               style: {
//                 fontSize: "0.93rem",
//                 fontWeight: 610,
//               },
//             },
//             rows: {
//               style: {
//                 fontSize: "0.9rem",
//               },
//             },
//           }}
//         />

//         <EditTimeModal
//           isOpen={modal}
//           toggle={() => setModal(!modal)}
//           data={data}
//           setData={setData}
//           selectedId={selectedId}
//           selectedDay={selectedDay}
//         />
//       </div>
//     </>
//   );
// };

// export default WeeklySchedule;

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

import { useParams } from "react-router-dom";
// import DriverWeeklyService from "../../../services/DriverWeeklyService/DriverWeeklyService";
import WeeklyService from "../../services/Weekly Schedule Service/WeeklyService";
import EditTimeDriverModal from "./Component/EditTimeDriverModal";
import { getLoggedInUser } from "../../helpers/fakebackend_helper";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CustomDataTable from "../../Components/CustomTable/CustomTable";

const WeeklySchedule = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [modal, setModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const authUser = getLoggedInUser();
  //   console.log("authUserr", authUser);

  const driverId = authUser.user.id;

  console.log("diver id", driverId);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await WeeklyService.get({ id: driverId });
      console.log("🚀 ~ fetchData ~ response:", response);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: "Day",
      selector: "day",
      sortable: false,
      cell: (row) => <div style={{ textTransform: "capitalize" }}>{row}</div>,
    },
    {
      name: "Available Time",
      selector: "times",
      sortable: false,
      cell: (row) => (
        <div className="py-2 w-100">
          {
            data[row] === null ? ( // If the day's data is null
              <span className="">No Time Slots</span>
            ) : data[row]?.is_available ? ( // If the day is marked as available
              data[row]?.times?.some(
                (timeSlot) => timeSlot.start_time && timeSlot.end_time
              ) ? (
                data[row].times.map(
                  (timeSlot, idx) =>
                    timeSlot.start_time &&
                    timeSlot.end_time && ( // Ensure both start_time and end_time are valid
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
                )
              ) : (
                <span className="">No Time Slots</span>
              )
            ) : null /* Skip rendering for days that are not available */
          }
        </div>
      ),
    },

    // {
    //   name: "Actions",
    //   cell: (row) =>
    //     data[row] !== null &&
    //     data[row]?.is_available &&
    //     data[row]?.times?.some(
    //       (timeSlot) => timeSlot.start_time && timeSlot.end_time
    //     ) ? (
    //       <ButtonGroup className="gap-3">
    //         <Button
    //           color="warning"
    //           className="rounded-circle btn-sm"
    //           onClick={() => toggleModal(data.id, row)}
    //         >
    //           <i className="bx bx-edit"></i>
    //         </Button>
    //       </ButtonGroup>
    //     ) : null, // Do not show edit button for invalid or unavailable days
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,
    //   width: "100px",
    // }

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
        // data={days}
        data={days.filter(
          (day) => data[day] === null || data[day]?.is_available
        )}
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

      <EditTimeDriverModal
        isOpen={modal}
        fetchData={fetchData}
        toggle={() => setModal(!modal)}
        data={data}
        setData={setData}
        selectedId={selectedId}
        selectedDay={selectedDay}
      />
    </div>
  );
};

export default WeeklySchedule;
