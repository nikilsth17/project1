import React, { useRef, useState, useEffect } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Card, CardBody, Col, Row } from "reactstrap";
import PackageService from "../../services/PackageServices/PackageService";
import { useParams } from "react-router-dom";
import PackageCard from "./Component/PackageCard";

const PackageDetail = () => {
  const printRef = useRef(null);
  const [dataList, setDataList] = useState({});
  console.log("packageDatalist", dataList);
  const { id } = useParams(); // id is a string from URL parameters

  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const paymentStatusColors = {
    PAID: "bg-success",
    PENDING: "bg-warning",
  };


  useEffect(() => {
    (async () => {
      try {
        const response = await PackageService.detail(id);
        console.log("🚀 ~ response:", response);
        setDataList(response.data);
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
  }, [id]);

  const paymentButtonClass =
    paymentStatusColors[selectedPaymentStatus] || "bg-secondary";

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };


  const statusOptions = [
    { label: "TRUE", value: 1 },
    { label: "FALSE", value: 2 },
  ];

  return (
    <div className="print-container">
      <div className="page-content" ref={printRef}>
        <div className="container-fluid">
          <BreadCrumb
            pageTitle="Packages"
            title="Package Detail"
            breadcrumbItems={[{ title: "Back To List ", link: "/packages" }]}
          />
        </div>

        <Row className="d-flex justify-content-center">
          <Col lg={5}>
            {dataList ? (
              <PackageCard
                rate={dataList.price}
                type={dataList.name}
                CarType={
                  Array.isArray(dataList.details)
                    ? dataList.details.find(
                      (detail) => detail.title === "Car Type"
                    )?.value || ""
                    : ""
                }
                FreePickup={dataList.pickup_drop_text}
                Time={
                  Array.isArray(dataList.details)
                    ? dataList.details.find((detail) =>
                      detail.title.includes("Days")
                    )?.value || ""
                    : ""
                }
                per={dataList.package_type}
                id={dataList.id} // Passing the package id to PackageCard
                planButtonClassname={
                  dataList.planButtonClassname || ""
                }
                is_popular={dataList.is_popular === 1}
                promotion_text={dataList.promotion_text || ""}
                showButton={false}
                show_promotion={dataList.show_promotion === 1}
                details={dataList.details}
                show={dataList.package_type !== "DRIVING-TEST"} // Conditional rendering based on 'per' value
              />
            ) : (
              <p>Package not found.</p>
            )}
          </Col>
          {/* <Col lg={8}>
            <div className="mb-4 m-1 d-print-none">
              <Card className="p-4">
                <Row>
                  {dataList ? (
                    <>
                      <Col xs={12} md={5} lg={12} className="d-print-none mb-2">
                        <Row>
                          <Col lg={6} xs={12}>
                            <h6 className="fs-16 mb-3">
                              Package Name: <br />
                              <span className="fw-bold">{dataList?.name}</span>
                            </h6>
                          </Col>
                          <Col lg={6} xs={12}>
                            <h6 className="fs-16 mb-3">
                              Course Duration: <br />
                              <span className="fw-bold">{dataList?.course_duration}</span>
                            </h6>
                          </Col>
                          <Col lg={6} xs={12}>
                            <h6 className="fs-16 mb-3">
                              Session Duration: <br />
                              <span className="fw-bold">{dataList?.session_duration}</span>
                            </h6>
                          </Col>

                        </Row>
                      </Col>
                    </>
                  ) : (
                    <div>No data found.</div>
                  )}
                </Row>
              </Card>
            </div>
          </Col> */}
        </Row>
      </div>
    </div>
  );
};

export default PackageDetail;
