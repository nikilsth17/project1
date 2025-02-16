import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoggerService from "../../services/LoggerServices/LoggerServices";
import { Card, Col, Container, Row } from "reactstrap";
import { Triangle } from "react-loader-spinner";
import toast from "react-hot-toast";
import BreadCrumb from "../../Components/Common/BreadCrumb";
const LogDetail = () => {
  const { id } = useParams();
  const [logDetail, setLogDetail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await LoggerService.getLogDetail(id);
      setLogDetail(response);
    } catch (error) {
      console.log("🚀 ~ fetchDetail ~ error:", error);
      toast.error("An error occurred", {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const breadcrumbItems = [{ title: "< Logger File", link: "/logger" }];

  return (
    <React.Fragment>
      <Container fluid>
        <div className="page-content">
          <BreadCrumb
            title={id}
            breadcrumbItems={breadcrumbItems}
            pageTitle="Logger "
          />
          <Container fluid>
            {loading ? (
              <Row className="justify-content-center align-items-center">
                <Col xs={2}>
                  <Triangle
                    visible={true}
                    height="80"
                    width="80"
                    color="#5B71B9"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                  <h6 className="mt-2">Loading...</h6>
                </Col>
              </Row>
            ) : logDetail ? (
              <Card className="m-4 p-4">{logDetail}</Card>
            ) : (
              <Row className="justify-content-center align-items-center">
                <p className="p-2 pt-5 justify-content-center align-item-center">
                  <Col xs={12} className="text-center">
                    <img
                      src="blankdata.png"
                      alt="No data available"
                      style={{ width: "400", height: "300px" }}
                    />
                  </Col>
                </p>
              </Row>
            )}
          </Container>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default LogDetail;
