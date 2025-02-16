import React, { useContext } from "react";
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
import { CustomerContext } from "./GuestUserDetail";

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
  "Jestha",
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

const Detail = () => {
  const customerDetail = useContext(CustomerContext);
  console.log("🚀 ~ Detail ~ customerDetail:", customerDetail);

  return (
    <Row className="mb-4">
      <Col lg={2} className="text-center">
        <div>
          <NameInitialsAvatar
            name={`${customerDetail?.fullName} ${customerDetail?.lastName}`}
            textSize="40px"
            size={"150px"}
            bgColor="#D6DAC8"
            borderColor="#D6DAC8"
          />
        </div>
      </Col>
      <Col lg={4} className="">
        <Row>
          <Row>
            <Col lg={8} className="col-6 pb-2 mt-4">
              <h6 className="fs-18  fw-bold">
                {customerDetail?.fullName} {customerDetail?.lastName}
              </h6>
              <h6 className="fs-15  fw-bold">{customerDetail?.email}</h6>
              <h6 className="fs-15  fw-bold">
                {customerDetail?.address} || {customerDetail?.phoneNo}
              </h6>
            </Col>
          </Row>
        </Row>
      </Col>
      <Col lg={6}>
        <Card className="p-2">
          <Line data={data} />
        </Card>
        {/* <Line
          data={{
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [
              {
                label: "# of Votes",
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1,
              },
            ],
          }}
        /> */}
      </Col>
    </Row>
  );
};

export default Detail;
