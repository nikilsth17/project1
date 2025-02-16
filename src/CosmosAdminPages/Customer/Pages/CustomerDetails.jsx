import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Row, Input, Button } from "reactstrap";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import customerData from "../Component/Data"; // Adjust the path as needed
import Detail from "../Component/Detail";
import AppointmentService from "../../../services/AppointmentServices/AppointmentService";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import CustomerServices from "../../../services/CustomerServices/CustomerServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CustomerDetailDriver from "../Component/CustomerDetailDriver";

const CustomerDetails = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const userType = user?.user?.user_type;
  const [loading, setLoading] = useState(false);
  const [customerDetail, setCustomerDetail] = useState();
  const [bookingDetail, setBookingDetail] = useState();
  const [orderDetail, setOrderDetail] = useState([]);
  const [activeTab, setActiveTab] = useState("1"); // Set the initial active tab to "1"
  const navigate = useNavigate();
  async function bookings() {
    setLoading(true);
    try {
      console.log("Hello");
      const response = await CustomerServices.detail(id);
      console.log(response.data, "Booking details");
      setCustomerDetail(response.data);
    } catch (error) {
      console.log("🚀 ~ error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bookings();
  }, [id]);

  const breadcrumbItems = [{ title: "Back To List ", link: "/customer" }];

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleDeleteClick = (item) => {
    toggleDeleteModal();
  };

  const handleDelete = async () => {
    try {
      await CustomerServices.delete(id);

      toast.success("Customer deleted successfully");
      navigate("/customer");
    } catch (error) {
      toast.error("Failed to delete the customer");
    } finally {
      toggleDeleteModal();
    }
  };
  return (
    <div>
      {loading ? (
        <div
          style={{ height: "100vh" }}
          className="d-flex justify-content-center align-items-center "
        >
          <Triangle
            visible={true}
            height="80"
            width="80"
            color="#5B71B9"
            ariaLabel="triangle-loading"
          />
        </div>
      ) : (
        <Row>
          <Col
            md={12}
            className="mb-2 align-content-end align-items-end d-flex flex-column"
          >
            <button
              className="btn btn-danger "
              onClick={() => handleDeleteClick()}
            >
              Delete Customer
            </button>
          </Col>
          <Col md={12}>
            <Detail customerDetail={customerDetail} />
          </Col>
        </Row>
      )}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
      />
    </div>
  );
};

export default CustomerDetails;
