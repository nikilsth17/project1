import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Card,
  Form,
  CardBody,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import JournalApproveService from "../../../services/AccountingServices/JournalApproveService";

const JournalApprove = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);

  const [mainData, setMainData] = useState({
    id: id,
    remarks: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMainData({
      ...mainData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      // Use the values from the state to update the system
      const updatedData = {
        id: mainData.id,

        remarks: mainData.remarks,
      };

      await JournalApproveService.updateJournalApprove(
        updatedData.id,
        updatedData
      );
      console.log("Done", updatedData);
      navigate("/approved");
    } catch (error) {
      console.error("Error creating/updating:", error);
    }
  };
  const handleReject = async () => {
    try {
      // Use the values from the state to update the system
      const updatedData = {
        id: mainData.id,

        remarks: mainData.remarks,
      };

      await JournalApproveService.updateJournalReject(
        updatedData.id,
        updatedData
      );
      console.log("Done", updatedData);
      navigate("/unapproved");
    } catch (error) {
      console.error("Error creating/updating:", error);
    }
  };

  return (
    <div className="page-content">
      <BreadCrumb title="Approve/Reject Form" pageTitle="Approve/Reject" />
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <Form>
                <FormGroup row>
                  <Label htmlFor="remarks" className="form-label" sm={3}>
                    Remarks
                  </Label>
                  <Col sm={3}>
                    <Input
                      type="string"
                      className="form-control"
                      id="remarks"
                      name="remarks"
                      value={mainData.remarks}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col sm={2}>
                    <div className="text-end">
                      <Button onClick={handleSave} className="btn btn-primary">
                        Approve
                      </Button>
                    </div>
                  </Col>
                  <Col sm={2}>
                    <div className="text-end">
                      <Button
                        onClick={handleReject}
                        className="btn btn-primary"
                      >
                        Reject
                      </Button>
                    </div>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JournalApprove;
