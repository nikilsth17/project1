import React, { useContext } from "react";
import { CustomerContext } from "../../../DibyaAdminPages/CustomerDetail/CustomerDetail";
import { Card, CardBody, Col, Row } from "reactstrap";
import { NameInitialsAvatar } from "react-name-initials-avatar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Amount Spent",
    },
  },
};

const labels = [
  "Baisakh",
  "Jeth",
  "Asar",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

const data = {
  labels,
  datasets: [
    {
      label: "Spendings in 2024",
      data: [200, 2300, 90, 150, 106, 280, 800, 900, 110, 120, 230, 120],
      borderColor: "#124076",
      // backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const Detail = ({ customerDetail }) => {
  // const customerDetail = useContext(CustomerContext);
  console.log("customerDetail", customerDetail);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card
        className=" p-4 shadow-sm border-0 w-100"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        <Row className="mb-4">
          <Col
            lg={4}
            xs={12}
            className="d-flex justify-content-center align-items-center text-center mb-3"
          >
            {customerDetail?.avatar?.path ? (
              <img
                data-dz-thumbnail=""
                height="200"
                className="avatar-xxl rounded bg-light"
                src={customerDetail?.avatar?.path}
                alt="Customer Avatar"
              />
            ) : (
              <img
                data-dz-thumbnail=""
                height="200"
                className="avatar-xxl rounded bg-light"
                src={customerDetail?.avatar?.path || "/avatar.jpg"}
                alt="Customer Avatar"
              />
            )}
          </Col>
          <Col lg={1} className="d-none d-lg-block">
            <div
              className="vr"
              style={{ height: "100%", backgroundColor: "#ccc" }}
            />
          </Col>

          <Col lg={7} xs={12}>
            <h6 className="fs-4 fw-bold mb-2" style={{ color: "#333" }}>
              {customerDetail?.name} {customerDetail?.surname}
            </h6>
            <hr />

            <h6 className="fs-6 fw-bold mb-1">
              <i className="fas fa-envelope me-2"></i>
              Email: {customerDetail?.email}
            </h6>
            <hr />

            <h6 className="fs-6 fw-bold mb-1">
              <i className="fas fa-phone me-2"></i>
              Phone Number:{" "}
              {customerDetail?.phone_number
                ? customerDetail.phone_number.toString().length === 9
                  ? `0${customerDetail.phone_number}`
                  : customerDetail.phone_number
                : "Invalid number"}
            </h6>
            <hr />

            <h6 className="fs-6 fw-bold mb-1">
              <i className="fas fa-id-card me-2"></i>
              Driving License Number: {customerDetail?.driving_license_no}
            </h6>
            <hr />

            <h6 className="fs-6 fw-bold mb-1">
              <i className="fas fa-map-marker-alt me-2"></i>
              Pick Up Address: {customerDetail?.address}
            </h6>
            <hr />

            <h6 className="fs-6 fw-bold mb-1">
              <i className="fas fa-globe me-2"></i>
              Issuing State: {customerDetail?.issuing_state}
            </h6>
            <hr />

            <h6 className="fs-6 fw-bold mb-1">
              <i className="fas fa-globe me-2"></i>
              Instructor:{" "}
              {customerDetail?.drivers
                .map((driver) => `${driver.name} ${driver.surname}`)
                .join(", ")}
            </h6>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Detail;
