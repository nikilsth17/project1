import React, { useEffect, useState } from "react";
import CustomDataTable from "../../Components/CustomTable/CustomTable";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Button, ButtonGroup, Col, Input, InputGroup, Row } from "reactstrap";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import OneTimeService from "../../services/OnetimeScheduleService/OneTimeService";
import AddModal from "../One Time Schedule/Component/AddModal";
import EditModal from "../One Time Schedule/Component/EditModal";
import DeleteModal from "../../Components/Common/DeleteModal";
import { formatDateTime } from "../../Components/Common/FormatDate";
import DriverAddOneTime from "./Component/DriverAddOneTime";
import DriverEditOneTime from "./Component/DriverEditOneTime";

const DriverOneTimeSchedule = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("🚀 ~ Calender ~ user:", user);
  const driverId = user?.user?.id;
  console.log("🚀 ~ Calender ~ driverId:", driverId);
  const userType = user?.user?.user_type;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]); // Initialize with an empty array
  const [filterText, setFilterText] = useState(""); // Track the search input
  const [modal, setModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Track selected time slot
  const [editModal, setEditModal] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // Toggle modal for adding/updating time slots
  const toggleModal = (timeSlot = null) => {
    setSelectedTimeSlot(timeSlot);
    setModal((prev) => !prev);
  };

  const editToggleModal = (timeSlot = null) => {
    setSelectedTimeSlot(timeSlot);
    setEditModal((prev) => !prev);
  };

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleDeleteClick = (item) => {
    setSelectedDeleteItem(item);
    toggleDeleteModal();
  };

  const handleDelete = async () => {
    if (selectedDeleteItem) {
      try {
        await OneTimeService.delete(selectedDeleteItem.id);
        toast.success("Selected data deleted successfully");

        // Remove the deleted item from the data array
        setData((prevData) =>
          prevData.filter((item) => item.id !== selectedDeleteItem.id)
        );
      } catch (error) {
        toast.error("Failed to delete the record");
      } finally {
        toggleDeleteModal();
        setSelectedDeleteItem(null); // Clear selected item after deletion
      }
    }
  };

  const columns = [
    {
      name: "S.N",
      selector: (_, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: "Title",
      selector: (row) => (
        <Link to={`/one-time-schedule/detail/${row?.id}`}>{row?.title}</Link>
      ),
    },
    {
      name: "Unavailable Date",
      selector: "dates",
      sortable: true,
      cell: (row) =>
        `${formatDateTime(row.from_date)} - ${formatDateTime(row.to_date)}`,
    },

    {
      name: "Action",
      cell: (row) => (
        <ButtonGroup className="gap-3">
          <Button
            color="warning"
            className="rounded-circle btn-sm"
            onClick={() => editToggleModal(row)}
          >
            <i className="bx bx-edit"></i>
          </Button>
          <Button
            color="danger"
            className="rounded-circle btn-sm"
            onClick={() => handleDeleteClick(row)}
          >
            <i className="bx bx-trash"></i>
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await OneTimeService.get(driverId);
        setData(response.data || []); // Ensure response.data is set properly
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on the filterText input
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb
            title="One Time Schedule List"
            pageTitle="One Time Schedule"
          />
        </div>
        <Row className="">
          <Col md={5} xs={6} className="px-xs-1">
            <InputGroup>
              <Input
                placeholder="Search by title"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)} // Update filterText on input change
              />
            </InputGroup>
          </Col>
          <Col
            md={7}
            xs={6}
            className="d-flex justify-content-end align-items-end mb-3"
          >
            <Button
              className="d-flex justify-content-end align-items-end px-1 px-sm-2"
              onClick={() => toggleModal()}
              style={{ border: "none" }}
            >
              Add Schedule
            </Button>
          </Col>
        </Row>

        <CustomDataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
          progressPending={loading}
          data={filteredData} // Pass the filtered data here
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
          columns={columns}
        />
      </div>
      <DriverAddOneTime
        isOpen={modal}
        toggle={toggleModal}
        selectedTimeSlot={selectedTimeSlot}
        setData={setData} // This should be set to handle updates to the data list
      />
      <DriverEditOneTime
        isOpen={editModal}
        toggle={editToggleModal}
        selectedTimeSlot={selectedTimeSlot}
        setData={setData}
        data={data}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
        selectedItem={selectedDeleteItem} // Pass the selected item
      />
    </>
  );
};

export default DriverOneTimeSchedule;
