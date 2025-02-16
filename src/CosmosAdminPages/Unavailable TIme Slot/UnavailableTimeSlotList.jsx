// import React from "react";
// import { Row, Col, Label, Input, Card, CardHeader, CardBody, Button } from "reactstrap";
// import { Link } from 'react-router-dom';
// import BreadCrumb from "../../Components/Common/BreadCrumb";
// const UnavailbleTimeSlotList = () => {
//   return (
//     <>
//       <div className="page-content">
//         <div className="container-fluid">
//           <BreadCrumb title="List" pageTitle="Unavailable Time Slot" />
//         </div>

//         <Row>
//                         <Col lg={12}>
//                             <Card>

//                                 <CardBody>
//                                     <div id="customerList">
//                                         <Row className="g-4 mb-3">
//                                             <Col className="col-sm">
//                                                 <div className="d-flex justify-content-sm-start">
//                                                     <div className="search-box ms-2">
//                                                         <input type="text" className="form-control search" placeholder="Search..." />
//                                                         <i className="ri-search-line search-icon"></i>
//                                                     </div>
//                                                 </div>
//                                             </Col>
//                                         </Row>

//                                         <div className="table-responsive table-card mt-3 mb-1">
//                                             <table className="table align-middle table-nowrap" id="customerTable">
//                                                 <thead className="table-light">
//                                                     <tr>

//                                                         <th className="sort" data-sort="customer_name">Title</th>

//                                                         <th className="sort" data-sort="date">Start DateTime</th>
//                                                         <th className="sort" data-sort="date">End DateTime</th>

//                                                         <th >Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="list form-check-all">
//                                                     <tr>

//                                                         <td className="id" style={{ display: "none" }}><Link to="#" className="fw-medium link-primary">#VZ2101</Link></td>
//                                                         <td className="customer_name">Mary Cousar</td>

//                                                         <td className="date">06 Apr, 2021</td>
//                                                         <td className="date">06 Apr, 2021</td>

//                                                         <td>
//                                                             <div className="d-flex gap-2">
//                                                                 <div className="edit">
//                                                                     <button className="btn btn-sm btn-success edit-item-btn"
//                                                                         data-bs-toggle="modal" data-bs-target="#showModal">Edit</button>
//                                                                 </div>
//                                                                 <div className="remove">
//                                                                     <button className="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal">Remove</button>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                     </tr>

//                                                 </tbody>
//                                             </table>
//                                             <div className="noresult" style={{ display: "none" }}>
//                                                 <div className="text-center">
//                                                     <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop"
//                                                         colors="primary:#121331,secondary:#08a88a" style={{ width: "75px", height: "75px" }}>
//                                                     </lord-icon>
//                                                     <h5 className="mt-2">Sorry! No Result Found</h5>
//                                                     <p className="text-muted mb-0">We've searched more than 150+ Orders We did not find any
//                                                         orders for you search.</p>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="d-flex justify-content-end">
//                                             <div className="pagination-wrap hstack gap-2">
//                                                 <Link className="page-item pagination-prev disabled" to="#">
//                                                     Previous
//                                                 </Link>
//                                                 <ul className="pagination listjs-pagination mb-0"></ul>
//                                                 <Link className="page-item pagination-next" to="#">
//                                                     Next
//                                                 </Link>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </CardBody>
//                             </Card>
//                         </Col>
//                     </Row>
//       </div>
//     </>
//   );
// };

// export default UnavailbleTimeSlotList;

// import React, { useEffect, useState } from "react";
// import { Row, Col, Card, CardBody, Button } from "reactstrap";
// import { Link } from "react-router-dom";
// import BreadCrumb from "../../Components/Common/BreadCrumb";

// const UnavailbleTimeSlotList = () => {
//   const [timeSlots, setTimeSlots] = useState([]);

//   // Fetch stored data from sessionStorage when the component mounts
//   useEffect(() => {
//     const storedData =
//       JSON.parse(sessionStorage.getItem("unavailableTimeSlots")) || [];
//     setTimeSlots(storedData);
//   }, []);

//   return (
//     <>
//       <div className="page-content">
//         <div className="container-fluid">
//           <BreadCrumb title="List" pageTitle="Unavailable Time Slot" />
//         </div>

//         <Row>
//           <Col lg={12}>
//             <Card>
//               <CardBody>
//                 <div id="customerList">
//                   <div className="table-responsive table-card mt-3 mb-1">
//                     <table
//                       className="table align-middle table-nowrap"
//                       id="customerTable"
//                     >
//                       <thead className="table-light">
//                         <tr>
//                           <th>S.N</th>
//                           <th className="sort" data-sort="customer_name">
//                             Title
//                           </th>
//                           <th className="sort" data-sort="date">
//                             Start DateTime
//                           </th>
//                           <th className="sort" data-sort="date">
//                             End DateTime
//                           </th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody className="list form-check-all">
//                         {timeSlots.length > 0 ? (
//                           timeSlots.map((slot, index) => (
//                             <tr key={index}>
//                               <td>{index + 1}</td>
//                               <td>{slot.title}</td>
//                               <td>{slot.startTime}</td>
//                               <td>{slot.endTime}</td>
//                               <td>
//                                 <div className="d-flex gap-2">
//                                   <div className="edit">
//                                     <Button className="btn-sm btn-success">
//                                       Edit
//                                     </Button>
//                                   </div>
//                                   <div className="remove">
//                                     <Button className="btn-sm btn-danger">
//                                       Remove
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="4" className="text-center">
//                               No Time Slots Available
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     </>
//   );
// };

// export default UnavailbleTimeSlotList;





import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, Button, ButtonGroup } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CustomDataTable from '../../Components/CustomTable/CustomTable'; // Assuming this is the path to CustomDataTable
import { Triangle } from "react-loader-spinner"; // Assuming you are using the Triangle spinner component

const UnavailbleTimeSlotList = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch stored data from sessionStorage when the component mounts
  useEffect(() => {
    setLoading(true);
    const storedData =
      JSON.parse(sessionStorage.getItem("unavailableTimeSlots")) || [];
    setTimeSlots(storedData);
    setLoading(false);
  }, []);

  // Define the columns for the CustomDataTable
  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Start DateTime",
      selector: (row) => row.startTime,
      sortable: true,
    },
    {
      name: "End DateTime",
      selector: (row) => row.endTime,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <ButtonGroup className="gap-2">
          <Button className="btn-sm btn-success">
            Edit
          </Button>
          <Button className="btn-sm btn-danger">
            Remove
          </Button>
        </ButtonGroup>
      ),
      center: true,
    },
  ];

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Unavailable Time Slot" pageTitle="List" />
        </div>

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <CustomDataTable
                  responsive
                  striped
                  pagination
                  fixedHeader
                  persistTableHead
                  progressPending={loading}
                  columns={columns}
                  data={timeSlots}
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
                  progressComponent={
                    <div className="my-3">
                      <Triangle
                        visible={true}
                        height="80"
                        width="80"
                        color="#5B71B9"
                        ariaLabel="triangle-loading"
                      />
                      <h5 className="mt-1">Loading...</h5>
                    </div>
                  }
                  noDataComponent={
                    <div className="text-center my-3">
                      No Time Slots Available
                    </div>
                  }
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default UnavailbleTimeSlotList;

