import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Row,
  Col,
  InputGroup,
  ButtonGroup,
} from "reactstrap";
import { Triangle } from "react-loader-spinner";
import CustomDataTable from "../../../Components/CustomTable/CustomTable";
import bookingData from "../Data/BookingData";
import DeleteModal from "../../../Components/Common/DeleteModal";

// Global filter component for search functionality
const GlobalFilter = ({ filterText, onFilter }) => (
  <Input
    type="text"
    placeholder="Search by name, email, package, or date"
    value={filterText}
    onChange={onFilter}
    className="search-input"
  />
);

const Bookings = () => {
  const [data, setData] = useState(bookingData);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [newBooking, setNewBooking] = useState({
    name: "",
    email: "",
    package: "",
    date: "",
  });
  const [detailBooking, setDetailBooking] = useState(null);

  const toggleModal = () => setModal(!modal);
  const toggleDetailModal = () => setDetailModal(!detailModal);

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setNewBooking({ ...booking });
    toggleModal();
  };

  const handleDeleteModal = (bookingId) => {
    setIsDeleteOpen(!isDeleteOpen);
  };

  const handleSave = () => {
    if (editingBooking) {
      setData(
        data.map((booking) =>
          booking.id === editingBooking.id
            ? { ...editingBooking, ...newBooking }
            : booking
        )
      );
    } else {
      setData([...data, { id: data.length + 1, ...newBooking }]);
    }
    toggleModal();
  };

  const handleDelete = () => {
    if (bookingToDelete !== null) {
      setData(data.filter((booking) => booking.id !== bookingToDelete));
      setIsDeleteOpen(false);
      setBookingToDelete(null);
    }
  };

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

  const statusColors = {
    Ongoing: "bg-primary",
    Received: "bg-warning",
    Processing: "bg-success",
    Processed: "bg-danger",
    Delivered: "bg-info",
    Cancelled: "bg-danger",
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.id,
      sortable: true,
      width: "75px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Package",
      selector: (row) => row.package,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Booking Status",
      selector: (row) => (
        <span
          className={`badge ${
            statusColors[row.bookingStatus] || ""
          }-subtle text-uppercase text-dark`}
        >
          {row.orderStatus ? row.orderStatus : "No data available"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <ButtonGroup className="gap-2">
          <Button
            color="rounded-circle btn btn-success"
            className="rounded-circle btn-sm gap-1"
          >
            <i className="bx bx-check"></i>
          </Button>
          <Button
            color="rounded-circle btn btn-danger"
            className="rounded-circle btn-sm gap-1"
            onClick={() => handleDeleteModal(row.id)}
          >
            <i className="bx bx-x"></i>
          </Button>
          <Button
            color="rounded-circle btn btn-warning"
            className="rounded-circle btn-sm gap-1"
            onClick={() => handleEdit(row)}
          >
            <i className="ri-edit-line"></i>
          </Button>
        </ButtonGroup>
      ),
      center: true,
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.email.toLowerCase().includes(filterText.toLowerCase()) ||
      item.package.toLowerCase().includes(filterText.toLowerCase()) ||
      item.date.includes(filterText)
  );

  useEffect(() => {
    setLoading(false);
  }, [data]);

  const handleFilter = (event) => {
    setFilterText(event.target.value);
  };

  return (
    <div className="page-content">
      <Row className="mb-2">
        <Col lg={5}>
          <InputGroup>
            <Input
              placeholder="Search by name, email, address, and phone number"
              value={filterText}
              onChange={handleFilter}
            />
          </InputGroup>
        </Col>
      </Row>

      <CustomDataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        progressPending={loading}
        customStyles={customStyles}
        onRowClicked={(row) => {
          // navigate(`/manifest-detail/${row.id}`);
        }}
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

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editingBooking ? "Edit Booking" : "Add New Booking"}
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            placeholder="Name"
            value={newBooking.name}
            onChange={(e) =>
              setNewBooking({ ...newBooking, name: e.target.value })
            }
            className="modal-input"
          />
          <Input
            type="email"
            placeholder="Email"
            value={newBooking.email}
            onChange={(e) =>
              setNewBooking({ ...newBooking, email: e.target.value })
            }
            className="modal-input"
          />
          <Input
            type="text"
            placeholder="Package"
            value={newBooking.package}
            onChange={(e) =>
              setNewBooking({ ...newBooking, package: e.target.value })
            }
            className="modal-input"
          />
          <Input
            type="date"
            placeholder="Date"
            value={newBooking.date}
            onChange={(e) =>
              setNewBooking({ ...newBooking, date: e.target.value })
            }
            className="modal-input"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={detailModal} toggle={toggleDetailModal}>
        <ModalHeader toggle={toggleDetailModal}>Booking Details</ModalHeader>
        <ModalBody>
          {detailBooking && (
            <>
              <p>
                <strong>Name:</strong> {detailBooking.name}
              </p>
              <p>
                <strong>Email:</strong> {detailBooking.email}
              </p>
              <p>
                <strong>Package:</strong> {detailBooking.package}
              </p>
              <p>
                <strong>Date:</strong> {detailBooking.date}
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDetailModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <DeleteModal
        deleteTerm={"booking"}
        handleDelete={handleDelete}
        isOpen={isDeleteOpen}
        toggle={handleDeleteModal}
      />
    </div>
  );
};

export default Bookings;
