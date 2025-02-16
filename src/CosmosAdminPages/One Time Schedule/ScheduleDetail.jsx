import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Row,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import OneTimeService from "../../services/OnetimeScheduleService/OneTimeService";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const ScheduleDetail = ({ data }) => {
  const { id } = useParams(); // Assuming you're using React Router to get the schedule ID
  const [dataList, setDataList] = useState([]);
  console.log("dataList", dataList);

  useEffect(() => {
    (async () => {
      try {
        const response = await OneTimeService.detail(id);
        console.log("🚀 ~ response:", response);
        setDataList(response.data);
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
  }, [id]);

  return (
      <div className="page-content ">
        <div className="container-fluid">
          <BreadCrumb
            pageTitle="One time schedule"
            title="One time schedule Detail"
            breadcrumbItems={[
              { title: "Back To List ", link: "/one-time-schedule" },
            ]}
          />
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <Card className="col-xs-12 col-lg-6 p-4">
            <ListGroup>
              <h6 className="fs-16">Title: {dataList.title}</h6>
  
              <h6 className="fs-16">
                From Date: {dataList.from_date}
              </h6>
              <h6 className="fs-16">
                To Date: {dataList.to_date}
              </h6>
              <hr />

              <h6 className="fs-16">Unavailable Date:</h6>
              {dataList?.dates?.map((date, index) => (
                <ListGroupItem
                  key={index}
                  className="d-flex justify-content-between"
                >
                  {date?.date}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Card>
        </div>
      </div>
  );
};

export default ScheduleDetail;
