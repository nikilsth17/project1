import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "reactstrap";
import CardComponent from "./components/CardComponent/CardComponent";
import { Doughnut, Bar } from "react-chartjs-2";
import DashboardServices from "../../services/DibyaServices/DashboardServices/DashboardServices";
import { Chart, ArcElement, registerables } from "chart.js";
import OrderServices from "../../services/DibyaServices/OrderServices/OrderServices";
import UpcomingEvents from "./UpcomingEvents";
import LatestCustomer from "./LatestCustomer";
import DashboardService from "../../services/DashboardService/DashboardService";
import NewBookingList from "./NewBookingList";

Chart.register(ArcElement);
Chart.register(...registerables);

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Amount",
    },
  },
  cutoutPercentage: 50,
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Amount",
    },
  },
  elements: {
    bar: {
      borderRadius: 10,
    },
  },
  maintainAspectRatio: false,
};

export default function Dashboard() {
  // const [data, setData] = useState({});
  // const [cardData, setCardData] = useState([]);
  // const [donutData, setDonutData] = useState([]);
  // const [barData, setBarData] = useState([]);
  // const [flashMessage, setFlashMessage] = useState("");
  // const [pendingOrder, setPendingOrder] = useState();
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("🚀 ~ Calender ~ user:", user);
  const driverId = user?.user?.id;
  console.log("🚀 ~ Calender ~ driverId:", driverId);
  const userType = user?.user?.user_type;

  const [data, setData] = useState({
    barData: [],
    cash_total: 0,
    card_total: 0,
  }); // Initialize state
  const [loading, setLoading] = useState(true); // To indicate loading state
  const [error, setError] = useState(); // To hold any error
  useEffect(() => {
    const fetchCosmosData = async () => {
      try {
        let result; // Declare a variable to store the API response
        if (userType === "DRIVER") {
          result = await DashboardService.getData(driverId);
        } else {
          result = await DashboardService.getData(); // Fetch general data for other user types
        }
        setData(result); // Set the result to state
      } catch (err) {
        setError(err); // Capture any error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCosmosData(); // Execute the fetch function
  }, [userType, driverId]); // Add dependencies if `userType` or `driverId` might change

  // Prepare data for the Doughnut chart
  const doughnutChartData = {
    labels: ["Cash Total", "Card Total"],
    datasets: [
      {
        data: [data.cash_total, data.card_total], // Use the totals for doughnut
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  // Prepare data for the Bar chart
  const barData = data.barData || []; // Make sure to handle undefined
  const barChartData = {
    // labels: barData.map((item) => item.label),
    labels: ["Cash Total", "Card Total"],

    datasets: [
      {
        // label: "Income",
        data: [data.cash_total, data.card_total], // Use the totals for doughnut
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  // const handleDateRangeClick = (dateRange) => {
  //   fetchData(dateRange);
  // };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await OrderServices.getPendingOrder();
  //       console.log("🚀 ~ response:", response);
  //       if (response) {
  //         // Check if there is a pending order
  //         setPendingOrder(response);
  //         setFlashMessage(response); // Set flash message
  //         setTimeout(() => {
  //           setFlashMessage(""); // Clear flash message after 5 seconds
  //         }, 50000);
  //       }
  //     } catch (error) {
  //       console.log("🚀 ~ error:", error);
  //     }
  //   })();
  // }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            {/* <Col lg={6}>
              {flashMessage && (
                <Row className="mb-3">
                  <Col lg={12}>
                    <div className="alert alert-info" role="alert">
                      {flashMessage}
                    </div>
                  </Col>
                </Row>
              )}
            </Col> */}
            <Col lg={12} className="text-md-end">
              <Button
                color="primary"
                className="me-2 mb-2"
                onClick={() => handleDateRangeClick("all")}
              >
                All
              </Button>
              <Button
                color="info"
                className="me-2 mb-2"
                onClick={() => handleDateRangeClick("last7days")}
              >
                Last 7 Days
              </Button>
              <Button
                color="warning"
                className="me-2 mb-2"
                onClick={() => handleDateRangeClick("last1months")}
              >
                Last 1 Month
              </Button>
              <Button
                color="danger mb-2"
                onClick={() => handleDateRangeClick("last1year")}
              >
                Last 1 Year
              </Button>
            </Col>
          </Row>

          {/* <Row>
              {cardData.map((item) => (
                <CardComponent item={item} key={item.id} />
              ))}
            </Row> */}
          <Row className="mt-3">
            <Col lg={6}>
              <p className="mt-2 mb-0 fs-5 fw-semibold">Upcoming Events</p>
              {/* <Card className="p-2 rounded-3 mb-2">
                  <Row className="align-items-center">
                    <Col xs={12} sm={4}>
                      <img
                        src={`data:image/jpeg;base64, ${data?.bestSellingItem?.image}`}
                        alt="Image"
                        className="img-fluid"
                      />
                    </Col>
                    <Col xs={12} sm={8} className="mb-3 mb-sm-0">
                      <span className="fs-6 fw-semibold text-muted text-uppercase">
                        {data?.bestSellingItem?.name}
                      </span>

                      <div>
                        <p className="fs-6 fw-semibold mb-2">
                          Total Order: {data.bestSellingItemIncludedOrders}
                        </p>
                        <p className="fs-6 fw-semibold mb-0">
                          Total Earning: {data.earnings}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Card> */}
              <Card
                className="p-2 rounded-3 mb-2"
                style={{ height: "450px", overflowY: "auto" }}
              >
                <UpcomingEvents data={data} />
              </Card>
            </Col>
            <Col lg={6}>
              <p className="mt-2 mb-0 fs-5 fw-semibold">New Customer</p>
              {/* <Card className="p-2 rounded-3 mb-2">
                  <Row className="align-items-center">
                    <Col xs={12} md={4}>
                     
                      <img
                        src={`data:image/jpeg;base64, ${data?.trendingItem?.image}`}
                        alt="Image"
                        className="img-fluid" // Make the image responsive
                      />
                    </Col>
                    <Col xs={12} md={8} className="mb-3 mb-sm-0">
                 
                      <span className="fs-6 fw-semibold text-muted text-uppercase">
                        {data?.trendingItem?.name}
                      </span>
             
                      <div>
                        <p className="fs-6 fw-semibold mb-2">
                          Trending Item: {data.trendingItemIncludedCart}
                        </p>
                        <p className="fs-6 fw-semibold mb-0">
                          Total Earning: {data.earnings}
                        </p>
                      </div>

                    </Col>
                  </Row>
                </Card> */}

              <Card
                className="p-2 rounded-3 mb-2"
                style={{ height: "450px", overflowY: "auto" }}
              >
                <LatestCustomer data={data} />
              </Card>
            </Col>
            {/* <Col lg={4}>
                <p className="mt-2 mb-0 fs-5 fw-semibold">Top Customer</p>
                <Card className="p-2 rounded-3 mb-2">
                  <Row className="align-items-center">
                    <Col xs={12} md={4} sm={3} lg={4} className="mb-2 mb-sm-0">
                      
                      <img
                        src="./avatar-1.jpg"
                        width="83%%"
                        alt="Avatar"
                        className="img-fluid"
                      />
                    </Col>
                    <Col xs={12} sm={8}  className="mb-2 mb-sm-0">
                      
                        <span className="fs-6 fw-semibold text-muted text-uppercase">
                          {data?.topCustomer?.fullName}
                        </span>
                      <div>
                        <p className="fs-6 fw-semibold mb-2">
                          Total Spending: Rs 11,558
                        </p>
                        <p className="fs-6 fw-semibold mb-0">
                          Top Choice: {data?.bestSellingItem?.name}
                        </p>
                      </div>
                    
                     
                    </Col>
                  </Row>
                </Card>
              </Col> */}
          </Row>

          <Row className="mt-3">
            <Col lg={6}>
              <p className="fw-semibold fs-5">New Booking List</p>
              <Card
                className="p-2"
                style={{ width: "100%", height: "500px", overflowY: "auto" }}
              >
                {/* <Bar
                  data={barChartData} // Use the bar chart data
                  options={barOptions}
                /> */}
                <NewBookingList data={data} />
              </Card>
            </Col>
            <Col lg={6}>
              <p className="fw-semibold fs-5">Total Income</p>
              <Card className="p-2" style={{ width: "100%", height: "500px" }}>
                <Doughnut
                  data={doughnutChartData} // Use the doughnut chart data
                  options={doughnutOptions}
                />
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
