// import React from "react";
// import { Row, Col, Label, Input } from "reactstrap";
// import Flatpickr from "react-flatpickr";
// import BreadCrumb from "../../Components/Common/BreadCrumb";
// const UnavailbleTimeSlot = () => {
//   return (
//     <>
//       <div className="page-content">
//         <div className="container-fluid">
//           <BreadCrumb title="Form" pageTitle="Unavailable Time Slot" />
//         </div>
       
//           <Row className="mb-3 ">
//             <Col lg={1}>
//               <Label htmlFor="titleInput" className="form-label">
//                 Title
//               </Label>
//             </Col>
//             <Col lg={5}>
//               <Input
//                 type="text"
//                 className="form-control"
//                 id="titleInput"
//                 placeholder="Enter the title"
//               />
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col lg={1}>
//               <Label htmlFor="startTime" className="form-label">
//                 StartTime
//               </Label>
//             </Col>
//             <Col lg={5}>
//               <Flatpickr
//                 className="form-control"
//                 options={{
//                   enableTime: true,
//                   dateFormat: "Y-m-d H:i",
//                 }}
//               />
//             </Col>
//           </Row>
//           <Row className="mb-3">
//             <Col lg={1}>
//               <Label htmlFor="endTime" className="form-label">
//                 EndTime
//               </Label>
//             </Col>
//             <Col lg={5}>
//               <Flatpickr
//                 className="form-control"
//                 options={{
//                   enableTime: true,
//                   dateFormat: "Y-m-d H:i",
//                 }}
//               />
//             </Col>
//           </Row>
       
//         <Row className="text-end ">
//             <Col lg={6}>
//           <button type="submit" className="btn btn-primary">
//             Add
//           </button>
//           </Col>
//         </Row>
//       </div>
//     </>
//   );
// };

// export default UnavailbleTimeSlot;


import React, { useState } from "react";
import { Row, Col, Label, Input } from "reactstrap";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const UnavailableTimeSlot = () => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Save data in sessionStorage
//     const formData = {
//       title,
//       startTime,
//       endTime,
//     };

//     sessionStorage.setItem("unavailableTimeSlot", JSON.stringify(formData));

//     console.log("Form data stored in sessionStorage:", formData);
//   };


const handleSubmit = (e) => {
    e.preventDefault();
  
    const newTimeSlot = {
      title,
      startTime,
      endTime,
    };
  
    // Get existing data from sessionStorage or initialize an empty array
    const storedData = JSON.parse(sessionStorage.getItem("unavailableTimeSlots")) || [];
  
    // Add the new entry to the array
    const updatedData = [...storedData, newTimeSlot];
  
    // Save the updated array in sessionStorage
    sessionStorage.setItem("unavailableTimeSlots", JSON.stringify(updatedData));
  
    console.log("Form data stored in sessionStorage:", updatedData);
  
    // Clear the form
    setTitle("");
    setStartTime(null);
    setEndTime(null);
  };
  
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Form" pageTitle="Unavailable Time Slot" />
        </div>

        <form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col lg={1}>
              <Label htmlFor="titleInput" className="form-label">
                Title
              </Label>
            </Col>
            <Col lg={5}>
              <Input
                type="text"
                className="form-control"
                id="titleInput"
                placeholder="Enter the title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={1}>
              <Label htmlFor="startTime" className="form-label">
                Start Time
              </Label>
            </Col>
            <Col lg={5}>
              <Flatpickr
                id="startTime"
                className="form-control"
                value={startTime}
                onChange={(date) => setStartTime(date)}
                options={{
                  enableTime: true,
                  dateFormat: "Y-m-d H:i",
                }}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={1}>
              <Label htmlFor="endTime" className="form-label">
                End Time
              </Label>
            </Col>
            <Col lg={5}>
              <Flatpickr
                id="endTime"
                className="form-control"
                value={endTime}
                onChange={(date) => setEndTime(date)}
                options={{
                  enableTime: true,
                  dateFormat: "Y-m-d H:i",
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col lg={{ size: 6, className: "text-end" }}>
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </Col>
          </Row>
        </form>
      </div>
    </>
  );
};

export default UnavailableTimeSlot;

