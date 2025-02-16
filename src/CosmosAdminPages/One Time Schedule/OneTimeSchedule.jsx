import React, { useEffect, useState } from "react";
import CustomDataTable from "../../Components/CustomTable/CustomTable";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Button, ButtonGroup, Col, Input, InputGroup, Row } from "reactstrap";
import AddModal from "./Component/AddModal";
import { Link } from "react-router-dom";
import OneTimeService from "../../services/OnetimeScheduleService/OneTimeService";
import EditModal from "./Component/EditModal";
import DeleteModal from "../../Components/Common/DeleteModal";
import toast from "react-hot-toast";
import { formatDateTime } from "../../Components/Common/FormatDate";
import DriverServices from "../../services/DriverServices/DriverServices";
import Select from "react-select";
import { wrap } from "lodash";

const OneTimeSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  console.log("🚀 ~ OneTimeSchedule ~ data:", data);
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [driverData, setDriverData] = useState([]);

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
        setData((prevData) =>
          prevData.filter((item) => item.id !== selectedDeleteItem.id)
        );
      } catch (error) {
        toast.error("Failed to delete the record");
      } finally {
        toggleDeleteModal();
        setSelectedDeleteItem(null);
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
      wrap:true,
    },

    {
      name: "Instructor",
      selector: (row) =>
        `${row?.driver?.user?.name || ""} ${row?.driver?.user?.surname || ""}`,
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
          Unavailable Date
        </div>
      ),
      selector: "dates",
      wrap: true,
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await OneTimeService.get();
        setData(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handleDriverChange = (selectedOption) => {
    setSelectedDriver(
      selectedOption || driverOptions.find((option) => option.value === "all")
    );
    console.log("Selected Driver:", selectedOption);
  };

  const [selectedDriver, setSelectedDriver] = useState(
    driverOptions.find((option) => option.value === "all") // Default to "All"
  );
  // Filter data based on both title and selected driver
  const filteredData = data.filter((item) => {
    const matchesTitle = item.title
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const matchesDriver =
      selectedDriver?.value === "all"
        ? true // Show all events when "All" is selected
        : item?.driver_id === selectedDriver?.value;
    console.log("🚀 ~ filteredData ~ matchesDriver:", matchesDriver);
    return matchesTitle && matchesDriver;
  });

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
          <Col md={5} xs={12} className="px-xs-1 mb-2">
            <InputGroup>
              <Input
                placeholder="Search by title"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={5} xs={12}>
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
                className="mb-2"
                value={selectedDriver}
                onChange={handleDriverChange}
                placeholder="Select a driver"
                isClearable={selectedDriver?.value !== "all"}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    paddingLeft: "50px",
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
                    marginLeft: "10px",
                  }),
                }}
              />
            </div>
          </Col>
          <Col
            md={2}
            xs={12}
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
          data={filteredData}
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
      <AddModal
        isOpen={modal}
        toggle={toggleModal}
        selectedTimeSlot={selectedTimeSlot}
        setData={setData}
        driverOptions={driverOptions}
        setDriverData={setDriverData}
        driverData={driverData}
      />
      <EditModal
        isOpen={editModal}
        toggle={editToggleModal}
        selectedTimeSlot={selectedTimeSlot}
        setData={setData}
        data={data}
        driverOptions={driverOptions}
        setDriverData={setDriverData}
        driverData={driverData}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
        selectedItem={selectedDeleteItem}
      />
    </>
  );
};

export default OneTimeSchedule;
