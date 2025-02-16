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

import VechicleTypeService from "../../../services/Inventory Services/VehicleTypeServices";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const VehicleTypeEditor = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const [mainData, setMainData] = useState({
    id: "0",
    title: "",
    description: "",
  });
  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMainData({
      ...mainData,
      [name]: value,
    });
  };
  async function fetchDetail() {
    try {
      if (!id) {
        return;
      }
      const response = await VechicleTypeService.view(id);
      console.log(response);
      const Data = response.id;
      console.log("Data", "Data");
      setMainData(response);
      setMainData({
        ...mainData,
        id: response.id,
        title: response.title,
        description: response.description,
      });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchDetail();
  }, []);
  // Your component logic here
  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      if (mainData.id > 0) {
        // Update an existing item
        await VechicleTypeService.update(mainData.id, mainData);
        console.log("Data updated successfully", mainData);
      } else {
        // Create a new item
        await VechicleTypeService.create(mainData);
        console.log("Data after POST:", mainData);
      }
      navigate("/vehicletype-list");
    } catch (error) {
      console.error("Error creating/updating:", error);
    }
  };

  return (
    <React.Fragment>
    <div className="page-content">
      <BreadCrumb title="Vehicle Type Form" pageTitle="VehicleType" />
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Form onSubmit={handleCreatePost}>
                  
                <span className="placeholder col-12 mb-5 pt-5 bg-success"></span>
                  <FormGroup row>
                    <Label htmlFor="title" className="form-label" sm={3}>
                      Vehicle Type:
                    </Label>
                    <Col sm={3}>
                      <Input
                        type="string"
                        className="form-control"
                        id="title"
                        name="title"
                        value={mainData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                    <Label htmlFor="description" className="form-label" sm={3}>
                      Description:
                    </Label>
                    <Col sm={3}>
                      <Input
                        type="string"
                        className="form-control"
                        id="description"
                        name="description"
                        value={mainData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                  </FormGroup>

                  <div className="text-end">
                    <Button type="submit" className="btn btn-primary">
                      Save
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    </React.Fragment>
  );
};

export default VehicleTypeEditor;
