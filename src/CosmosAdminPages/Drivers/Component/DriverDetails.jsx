import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Row,
  TabContent,
  Table,
  TabPane,
  UncontrolledCollapse,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import { useParams } from "react-router-dom";
import DriverServices from "../../../services/DriverServices/DriverServices";

//Images
// import profileBg from '../../../../assets/images/profile-bg.jpg';
import avatar1 from "../../../../src/assets/images/users/avatar-1.jpg";
import BookingListDriver from "./BookingListDriver";
import PaymentReportDriver from "./PaymentReportDriver";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Triangle } from "react-loader-spinner";
import DriverResetPassword from "./DriverResetPassword";
// import avatar2 from '../../../../assets/images/users/avatar-2.jpg';
// import avatar3 from '../../../../assets/images/users/avatar-3.jpg';
// import avatar4 from '../../../../assets/images/users/avatar-4.jpg';
// import avatar5 from '../../../../assets/images/users/avatar-5.jpg';
// import avatar6 from '../../../../assets/images/users/avatar-6.jpg';
// import avatar7 from '../../../../assets/images/users/avatar-7.jpg';
// import avatar8 from '../../../../assets/images/users/avatar-8.jpg';

// import smallImage2 from '../../../../assets/images/small/img-2.jpg';
// import smallImage3 from '../../../../assets/images/small/img-3.jpg';
// import smallImage4 from '../../../../assets/images/small/img-4.jpg';
// import smallImage5 from '../../../../assets/images/small/img-5.jpg';
// import smallImage6 from '../../../../assets/images/small/img-6.jpg';
// import smallImage7 from '../../../../assets/images/small/img-7.jpg';
// import smallImage9 from '../../../../assets/images/small/img-9.jpg';

// import { projects, document } from '../../../../common/data';

const DriverDetails = () => {
  SwiperCore.use([Autoplay]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("1");
  const [activityTab, setActivityTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const toggleActivityTab = (tab) => {
    if (activityTab !== tab) {
      setActivityTab(tab);
    }
  };
  const [data, setData] = useState();
  console.log("🚀 ~ DriverDetail ~ data:", data);

  const { id } = useParams();
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await DriverServices.getById(id);
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [isOpenReset, setIsOpenReset] = useState(false);
  const toggleReset = () => {
    setIsOpenReset(!isOpenReset);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb
            pageTitle="Instructor"
            title="Instructor Detail"
            breadcrumbItems={[{ title: "Back To List ", link: "/drivers" }]}
          />
        </div>

        {loading ? (
          <div
            className="d-flex justify-content-center align-content-center align-items-center"
            style={{ height: "100vh" }}
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
          <Container fluid>
            <div className="d-flex align-content-end justify-content-end align-items-end mb-2">
              <button className="btn btn-danger" onClick={toggleReset}>
                Reset Password
              </button>
            </div>
            <Card className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper p-3">
              <Row className="">
                <Col
                  md={3}
                  className="justify-content-center align-content-center align-items-center"
                >
                  <div className="avatar-xxl">
                    <img
                      src={data?.user?.avatar?.path || "/avatar.jpg"}
                      alt="user-img"
                      className="img-thumbnail "
                    />
                  </div>
                </Col>
                <Col lg={1} className="d-none d-lg-block">
                  <div
                    className="vr"
                    style={{ height: "100%", backgroundColor: "#ccc" }}
                  />
                </Col>
                <Col md={8} className="">
                  <h6 className="fs-5 fw-bold mb-2" style={{ color: "#333" }}>
                    {data?.name} {data?.surname}
                  </h6>
                  <hr />

                  <h6 className="fs-6 fw-bold mb-1">Email: {data?.email}</h6>
                  <hr />

                  <h6 className="fs-6 fw-bold mb-1">
                    Phone Number: +61{" "}
                    {data?.phone_number
                      ? data?.phone_number.toString().length === 9
                        ? `0${data?.phone_number}`
                        : data?.phone_number
                      : "Invalid number"}
                  </h6>
                  <hr />

                  <h6 className="fs-6 fw-bold mb-1">
                    Driving License Number: {data?.driving_license_no}
                  </h6>
                  <hr />

                  <h6 className="fs-6 fw-bold mb-1">
                    Residential Address: {data?.address || data?.street_address}
                  </h6>
                  <hr />

                  <h6 className="fs-6 fw-bold mb-1">
                    Issuing State: {data?.issuing_state}
                  </h6>
                  <hr />

                  <h6 className="fs-6 fw-bold mb-1">
                    Work Suburbs:{" "}
                    {data?.work_suburbs?.map((item) => item?.name).join(", ")}
                  </h6>
                </Col>
              </Row>
            </Card>

            <Row>
              <Col lg={12}>
                <div>
                  <div className="d-flex ">
                    <Nav
                      pills
                      className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                      role="tablist"
                    >
                      <NavItem>
                        <NavLink
                          href="#booking"
                          className={classnames({ active: activeTab === "1" })}
                          onClick={() => {
                            toggleTab("1");
                          }}
                        >
                          <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                          <span className="d-block text-black">Booking</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          href="#payment"
                          className={classnames({ active: activeTab === "2" })}
                          onClick={() => {
                            toggleTab("2");
                          }}
                        >
                          <i className="ri-list-unordered d-inline-block d-md-none"></i>{" "}
                          <span className="d-block  text-black">Payment</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>

                  <TabContent activeTab={activeTab} className="pt-4 text-muted">
                    <TabPane tabId="1">
                      <BookingListDriver />
                    </TabPane>
                    <TabPane tabId="2">
                      <PaymentReportDriver />
                    </TabPane>
                  </TabContent>
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </div>
      <DriverResetPassword isOpen={isOpenReset} toggle={toggleReset} id={id} />
    </React.Fragment>
  );
};

export default DriverDetails;
