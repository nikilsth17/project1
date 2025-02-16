// import React, { useEffect, useState } from "react";
// import CustomDataTable from "../../Components/CustomTable/CustomTable";
// import { Button, ButtonGroup, Col, Input, InputGroup, Row } from "reactstrap";
// import { Link } from "react-router-dom";
// import { Triangle } from "react-loader-spinner";
// import BreadCrumb from "../../Components/Common/BreadCrumb";
// import { driverData } from "./data/data";
// import DriverModal from "./Component/DriverModal";
// import DriverServices from "../../services/DriverServices/DriverServices";
// import DeleteModal from "../../Components/Common/DeleteModal";
// import toast from "react-hot-toast";
// import SuburbService from "../../services/SuburbServices/SuburbService";
// import Select from "react-select";
// import avatar1 from "../../../src/assets/images/users/avatar-1.jpg";

// const customStyles = {
//   headCells: {
//     style: {
//       fontSize: "0.92rem", // Change the font size here
//       fontWeight: 610, // Optionally change other styles
//     },
//   },
//   rows: {
//     style: {
//       fontSize: "0.9rem", // Change the font size of rows here
//       // You can also optionally add other row styles here
//     },
//   },
// };
// const DriverList = () => {
//   const [loading, setLoading] = useState(false);
//   // Initialize filterText as an object with empty strings
//   const [filterText, setFilterText] = useState({
//     name: "",
//     phone_number: "",
//     work_suburbs: [],
//   });

//   const [data, setData] = useState([]);
//   console.log("🚀 ~ DriverList ~ data:", data);
//   const [selectedSurburb, setSelectedSurburbs] = useState([]);

//   const fetchData = async () => {
//     try {
//       const response = await DriverServices.get();
//       setData(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const filteredData = data?.filter((driver) => {
//     const name = driver.name || "";
//     const phone = driver.phone_number || "";
//     const driverSuburbs =
//       driver.work_suburbs?.map((suburb) => suburb?.id) || [];
//     console.log("driverSuburbs", driverSuburbs);

//     // Check if name and phone number match filters
//     const nameMatch = name
//       .toLowerCase()
//       .includes(filterText.name.toLowerCase());
//     const phoneMatch = phone
//       .toLowerCase()
//       .includes(filterText.phone_number.toLowerCase());

//     // Check if any selected suburbs match with driver's work suburbs
//     const suburbMatch =
//       filterText.work_suburbs.length === 0 ||
//       filterText.work_suburbs.some((selectedSuburb) =>
//         driverSuburbs.includes(parseInt(selectedSuburb))
//       );

//     return nameMatch && phoneMatch && suburbMatch;
//   });

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilterText((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const [selectedDriver, setSelectedDriver] = useState();
//   const handleEdit = (driver) => {
//     setSelectedDriver(driver);
//     setIsAddOpen(true);
//   };
//   const columns = [
//     {
//       name: "S.N",
//       selector: (row, index) => index + 1,
//       sortable: true,
//       width: "75px",
//     },
//     {
//       name: "Driver Name",
//       selector: (row) => (
//         <Link to={`/driver/detail/${row.id}`}>
//           {row.name} {row.surname}
//         </Link>
//       ),
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Image",
//       selector: (row) => (
//         <img
//           src={row.user.avatar ? row.user.avatar.path : avatar1} // Replace with a default image URL if needed
//           alt={`${row.name} ${row.surname}`}
//           style={{ width: '50px', height: '50px', borderRadius: '50%' }} // Adjust styles as needed
//         />
//       ),
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Email",
//       selector: (row) => row.email,
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: (
//         <div
//           style={{
//             whiteSpace: "normal",
//             wordWrap: "break-word",
//             overflowWrap: "break-word",
//           }}
//         >
//           Driving License
//         </div>
//       ),
//       selector: (row) => row.driving_license_no,
//       sortable: true,
//     },

//     {
//       name: (
//         <div
//           style={{
//             whiteSpace: "normal",
//             wordWrap: "break-word",
//             overflowWrap: "break-word",
//           }}
//         >
//           Phone Number
//         </div>
//       ),
//       selector: (row) => row.phone_number,
//       sortable: true,
//     },
//     {
//       name: "Work Suburbs",
//       selector: (row) =>
//         Array.isArray(row.work_suburbs)
//           ? row.work_suburbs.map((suburb) => suburb.name).join(", ")
//           : "No Suburbs",
//       sortable: true,
//       wrap: true,
//     },

//     {
//       name: "Action",
//       selector: (row) => (
//         <ButtonGroup className="gap-2">
//           <Button
//             color="warning"
//             className="rounded-circle btn-sm"
//             onClick={() => handleEdit(row)}
//           >
//             <i className="bx bx-edit"></i>
//           </Button>
//           {row.is_admin_driver === 0 ? ( // Check if is_admin_driver is 0
//             <Button
//               color="danger" // Correct color class
//               className="rounded-circle btn-sm gap-1"
//               onClick={() => handleDeleteClick(row)}
//             >
//               <i className="bx bx-trash"></i>
//             </Button>
//           ) : null}
//         </ButtonGroup>
//       ),
//       center: true,
//     },
//   ];

//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const toggleAddModal = () => {
//     setIsAddOpen(!isAddOpen);
//   };

//   const [deleteModal, setDeleteModal] = useState(false);
//   const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);

//   const toggleDeleteModal = () => setDeleteModal(!deleteModal);
//   const handleDeleteClick = (item) => {
//     setSelectedDeleteItem(item);
//     toggleDeleteModal();
//   };
//   const handleDelete = async () => {
//     if (selectedDeleteItem) {
//       try {
//         await DriverServices.delete(selectedDeleteItem.id);
//         setData((prevList) =>
//           prevList.filter((pkg) => pkg.id !== selectedDeleteItem.id)
//         );
//         toast.success("Selected driver deleted successfully");
//       } catch (error) {
//         toast.error("Failed to delete the record");
//       } finally {
//         toggleDeleteModal();
//         setSelectedDeleteItem(null);
//       }
//     }
//   };

//   const [suburbData, setSuburbData] = useState([]);
//   console.log("🚀 ~ suburbData:", suburbData);
//   const fetchSuburb = async () => {
//     try {
//       const response = await SuburbService.get();
//       setSuburbData(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     fetchSuburb();
//   }, []);
//   const options = suburbData.map((suburb) => ({
//     value: suburb.id.toString(), // Convert to string for react-select compatibility
//     label: suburb.name,
//   }));

//   const handleSuburbChange = (selectedOptions) => {
//     console.log("🚀 ~ handleSuburbChange ~ selectedOptions:", selectedOptions);
//     setSelectedSurburbs(selectedOptions);
//     setFilterText((prev) => ({
//       ...prev,
//       work_suburbs: selectedOptions
//         ? selectedOptions.map((option) => option.value) // Use `value` instead of `label`
//         : [],
//     }));
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <BreadCrumb title="Drivers List" pageTitle="Drivers" />
//       </div>
//       <Row className="">
//         <Col md={9} className="">
//           <Row className="">
//             <Col xs={12} md={4} className="mb-2">
//               <Input
//                 name="name" // Added name attribute
//                 placeholder="Search by driver name"
//                 value={filterText.name}
//                 onChange={handleFilterChange}
//               />
//             </Col>
//             <Col xs={6} md={4}>
//               <Input
//                 name="phone_number" // Added name attribute
//                 placeholder="Search by phone number"
//                 value={filterText.phone_number}
//                 onChange={handleFilterChange}
//               />
//             </Col>
//             <Col xs={6} md={4} className="mb-2">
//               <div style={{ position: "relative" }}>
//                 {/* <i
//                     className="bx bx-map"
//                     style={{
//                       position: "absolute",
//                       left: "10px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       pointerEvents: "none",
//                       color: "#6c757d",
//                       fontSize: "16px",
//                       zIndex: 1,
//                     }}
//                   ></i> */}
//                 <Select
//                   options={options}
//                   isMulti
//                   value={selectedSurburb}
//                   onChange={handleSuburbChange}
//                   placeholder="Search by work suburbs"
//                   isClearable
//                   styles={{
//                     control: (base, state) => ({
//                       ...base,
//                       // paddingLeft: "25px",
//                     }),
//                     menu: (base) => ({
//                       ...base,
//                       zIndex: 1050, // Adjust as needed
//                     }),
//                     menuPortal: (base) => ({
//                       ...base,
//                       zIndex: 9999, // Ensure it’s above everything
//                     }),
//                     placeholder: (base) => ({
//                       ...base,
//                       color: "#6c757d",
//                     }),
//                     singleValue: (base) => ({
//                       ...base,
//                       marginLeft: "10px",
//                     }),
//                   }}
//                 />
//               </div>
//             </Col>
//           </Row>
//         </Col>

//         <Col
//           md={3}
//           className="justify-content-end align-items-end alignn-content-end d-flex flex-column mb-2"
//         >
//           <Button
//             className=""
//             onClick={() => {
//               setSelectedDriver(null);
//               setIsAddOpen(true);
//             }}
//           >
//             + Add Drivers
//           </Button>
//         </Col>
//       </Row>
//       {loading ? (
//         <div className="d-flex justify-content-center my-3">
//           <Triangle
//             visible={true}
//             height="80"
//             width="80"
//             color="#5B71B9"
//             ariaLabel="triangle-loading"
//           />
//         </div>
//       ) : (
//         <CustomDataTable
//           responsive
//           striped
//           pagination
//           fixedHeader
//           persistTableHead
//           progressPending={loading}
//           customStyles={customStyles}
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
//           columns={columns}
//           data={filteredData}
//         />
//       )}
//       <DriverModal
//         isOpen={isAddOpen}
//         toggle={() => {
//           setIsAddOpen(false);
//           setSelectedDriver(null);
//         }}
//         initialData={selectedDriver}
//         setData={setData}
//         data={data}
//         fetchData={fetchData}
//       />

//       <DeleteModal
//         show={deleteModal}
//         onDeleteClick={handleDelete}
//         onCloseClick={toggleDeleteModal}
//         selectedItem={selectedDeleteItem} // Pass the selected item
//       />
//     </div>
//   );
// };

// export default DriverList;

import React, { useEffect, useState } from "react";
import CustomDataTable from "../../Components/CustomTable/CustomTable";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { driverData } from "./data/data";
import DriverModal from "./Component/DriverModal";
import DriverServices from "../../services/DriverServices/DriverServices";
import DeleteModal from "../../Components/Common/DeleteModal";
import toast from "react-hot-toast";
import SuburbService from "../../services/SuburbServices/SuburbService";
import Select from "react-select";
import avatar1 from "../../../src/assets/images/users/avatar-1.jpg";
import UpdatedPagination from "../../Components/Common/UpdatedPagination"; // Import the UpdatedPagination component

const customStyles = {
  headCells: {
    style: {
      fontSize: "0.92rem",
      fontWeight: 610,
    },
  },
  rows: {
    style: {
      fontSize: "0.9rem",
    },
  },
};

const DriverList = () => {
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState({
    name: "",
    phone_number: "",
    work_suburbs: [],
  });
  const [data, setData] = useState([]);
  const [selectedSurburb, setSelectedSurburbs] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [perPageData, setPerPageData] = useState(20); // Items per page

  const fetchData = async () => {
    try {
      const response = await DriverServices.get();
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data?.filter((driver) => {
    const name = driver.name || "";
    const phone = driver.phone_number || "";
    const driverSuburbs =
      driver.work_suburbs?.map((suburb) => suburb?.id) || [];

    const nameMatch = name
      .toLowerCase()
      .includes(filterText.name.toLowerCase());
    const phoneMatch = phone
      .toLowerCase()
      .includes(filterText.phone_number.toLowerCase());
    const suburbMatch =
      filterText.work_suburbs.length === 0 ||
      filterText.work_suburbs.some((selectedSuburb) =>
        driverSuburbs.includes(parseInt(selectedSuburb))
      );

    return nameMatch && phoneMatch && suburbMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * perPageData;
  const indexOfFirstItem = indexOfLastItem - perPageData;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterText((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [selectedDriver, setSelectedDriver] = useState();
  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setIsAddOpen(true);
  };

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Instructor
        </div>
      ),
      selector: (row) => (
        <div className="d-flex align-items-center">
          <img
            src={row?.user?.avatar?.path || "/avatar.jpg"}
            alt={`${row.name} ${row.surname}`}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          <Link to={`/driver/detail/${row.id}`}>
            {row.name || ""} {row.surname || ""}
          </Link>
        </div>
      ),
      sortable: true,
      wrap: true,
    },

    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Driving License
        </div>
      ),
      selector: (row) => row.driving_license_no,
      sortable: true,
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Phone Number
        </div>
      ),
      // selector: (row) => row.phone_number,
      selector: (row) => {
        let phoneNumber = row.phone_number; // Ensure it's a string and remove extra spaces
        // console.log("🚀 ~ CustomerList ~ phoneNumber:", phoneNumber);

        if (/^[1-9]\d{8}$/.test(phoneNumber)) {
          return `0${phoneNumber}`; // If it's 9 digits (not starting with 0), add a leading 0
        } else if (/^0\d{9}$/.test(phoneNumber)) {
          return phoneNumber; // If it's already valid (10 digits starting with 0), return as is
        } else {
          return "Invalid Number"; // If it doesn't match either format, show an error message
        }
      },
      sortable: true,
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Work Suburbs
        </div>
      ),
      selector: (row) =>
        Array.isArray(row.work_suburbs)
          ? row.work_suburbs.map((suburb) => suburb.name).join(", ")
          : "No Suburbs",
      sortable: true,
      wrap: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <ButtonGroup className="gap-2">
          <Button
            color="warning"
            className="rounded-circle btn-sm"
            onClick={() => handleEdit(row)}
          >
            <i className="bx bx-edit"></i>
          </Button>
          {row.is_admin_driver === 0 && (
            <Button
              color="danger"
              className="rounded-circle btn-sm"
              onClick={() => handleDeleteClick(row)}
            >
              <i className="bx bx-trash"></i>
            </Button>
          )}
        </ButtonGroup>
      ),
      center: true,
    },
  ];

  const [isAddOpen, setIsAddOpen] = useState(false);
  const toggleAddModal = () => {
    setIsAddOpen(!isAddOpen);
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const handleDeleteClick = (item) => {
    setSelectedDeleteItem(item);
    toggleDeleteModal();
  };
  const handleDelete = async () => {
    if (selectedDeleteItem) {
      try {
        await DriverServices.delete(selectedDeleteItem.id);
        setData((prevList) =>
          prevList.filter((pkg) => pkg.id !== selectedDeleteItem.id)
        );
        toast.success("Selected driver deleted successfully");
      } catch (error) {
        toast.error("Failed to delete the record");
      } finally {
        toggleDeleteModal();
        setSelectedDeleteItem(null);
      }
    }
  };

  const [suburbData, setSuburbData] = useState([]);
  const fetchSuburb = async () => {
    try {
      const response = await SuburbService.get();
      setSuburbData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSuburb();
  }, []);
  const options = suburbData.map((suburb) => ({
    value: suburb.id.toString(),
    label: suburb.name,
  }));

  const handleSuburbChange = (selectedOptions) => {
    setSelectedSurburbs(selectedOptions);
    setFilterText((prev) => ({
      ...prev,
      work_suburbs: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Instructor List" pageTitle="Instructors" />
      </div>

      {/* Search Filters, Toggle Buttons, and Add Button in the Same Row */}
      <Row className="mb-3">
        {/* Search by Name */}
        <Col xs={12} md={4} lg={3} className="mb-2">
          <Input
            name="name"
            placeholder="Search by instructor name"
            value={filterText.name}
            onChange={handleFilterChange}
          />
        </Col>

        {/* Search by Phone Number */}
        <Col xs={12} md={4} lg={3} className="mb-2">
          <Input
            name="phone_number"
            placeholder="Search by phone number"
            value={filterText.phone_number}
            onChange={handleFilterChange}
          />
        </Col>

        {/* Search by Work Suburbs */}
        <Col xs={12} md={4} lg={3} className="mb-2">
          <Select
            options={options}
            isMulti
            value={selectedSurburb}
            onChange={handleSuburbChange}
            placeholder="Search by work suburbs"
            isClearable
            styles={{
              control: (base, state) => ({
                ...base,
              }),
              menu: (base) => ({
                ...base,
                zIndex: 1050,
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
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
        </Col>

        <Col
          xs={12}
          md={12}
          lg={3}
          className="d-flex justify-content-end align-items-center gap-3"
        >
          {/* View Mode Toggle Buttons */}
          <ButtonGroup size="sm">
            {" "}
            {/* Add size="sm" here */}
            <Button
              color={viewMode === "table" ? "primary" : "secondary"}
              onClick={() => setViewMode("table")}
            >
              <i className="bx bx-table"></i> Table
            </Button>
            <Button
              color={viewMode === "grid" ? "primary" : "secondary"}
              onClick={() => setViewMode("grid")}
            >
              <i className="bx bx-grid-alt"></i> Grid
            </Button>
          </ButtonGroup>

          {/* Add Drivers Button */}
          <Button
            onClick={() => {
              setSelectedDriver(null);
              setIsAddOpen(true);
            }}
          >
            + Add Instructor
          </Button>
        </Col>
      </Row>

      {/* Data Display */}
      {loading ? (
        <div className="d-flex justify-content-center my-3">
          <Triangle
            visible={true}
            height="80"
            width="80"
            color="#5B71B9"
            ariaLabel="triangle-loading"
          />
        </div>
      ) : viewMode === "table" ? (
        <CustomDataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
          progressPending={loading}
          customStyles={customStyles}
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
          columns={columns}
          data={filteredData}
        />
      ) : (
        <>
          <Row className="g-4">
            {currentItems.map((driver, index) => (
              <Col lg={4} md={12} xs={12} key={driver.id}>
                <Card>
                  <CardBody>
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="avatar-lg rounded">
                          <img
                            src={driver?.user?.avatar?.path || avatar1}
                            alt={`${driver.name} ${driver.surname}`}
                            className="member-img img-fluid d-block rounded"
                            style={{
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex-grow-1 ms-3">
                        <Link to={`/driver/detail/${driver.id}`}>
                          <p className="fs-16 mb-1">
                            {driver.name} {driver.surname}
                          </p>
                        </Link>
                        <p className="text-muted mb-2 text-break">
                          <i className="ri-mail-line text-primary me-1 align-bottom"></i>{" "}
                          {driver.email}
                        </p>

                        <p className="text-muted mb-2">
                          <i className="ri-phone-line text-primary me-1 align-bottom"></i>{" "}
                          {driver.phone_number}
                        </p>
                        <div className="d-flex gap-4 mt-2 text-muted">
                          <div className="text-break">
                            <i className="ri-map-pin-2-line text-primary me-1 align-bottom"></i>{" "}
                            {driver.work_suburbs
                              ?.map((suburb) => suburb.name)
                              .join(", ") || "No Location"}
                          </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                          <Button
                            color="warning"
                            className="btn-sm"
                            onClick={() => handleEdit(driver)}
                          >
                            <i className="bx bx-edit"></i>
                          </Button>
                          {driver.is_admin_driver === 0 && (
                            <Button
                              color="danger"
                              className="btn-sm"
                              onClick={() => handleDeleteClick(driver)}
                            >
                              <i className="bx bx-trash"></i>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
          <UpdatedPagination
            data={filteredData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            perPageData={perPageData}
            className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0"
          />
        </>
      )}

      {/* Modals */}
      <DriverModal
        isOpen={isAddOpen}
        toggle={() => {
          setIsAddOpen(false);
          setSelectedDriver(null);
        }}
        initialData={selectedDriver}
        setData={setData}
        data={data}
        fetchData={fetchData}
      />

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
        selectedItem={selectedDeleteItem}
      />
    </div>
  );
};

export default DriverList;
