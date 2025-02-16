// GLEEditor.js
import React, { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Input,
  Label,
  Col,
  Row,
  ButtonToggle,
  Form,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UnitsService from "../../../services/Inventory Services/UnitsService";
import { Link, useParams, useNavigate } from "react-router-dom";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";

const PUEditor = (props) => {
  const { id } = useParams(); // Get the id parameter from the URL
  const navigate = useNavigate();
  console.log(id);
  const [data, setData] = useState({
    name: "",
    ratio: "",
    status: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [draw, setDraw] = useState(0);

  const handleToggleStatus = () => {
    setData({
      ...data,
      status: !data.status,
    });
  };

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  //  to  ount the id from a service to show exist data when we update data
  useEffect(() => {
    if (id) {
      // If there's an id, it means we are editing an existing category
      setIsEditing(true);
      UnitsService.view(id)
        .then((item) => {
          setData(item);
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
      setData(data);
    }
  }, [id]);

  // fetch data from api to create and update
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // If there's an id, it's an update operation
        await UnitsService.update(id, data);
        console.log("Category updated successfully");
      } else {
        // If there's no id, it's a create operation
        const response = await UnitsService.create(data);
        console.log("Category created:", response);
      }
      navigate("/product-unit"); // Redirect to the item list after create/update
    } catch (error) {
      console.error("Error creating/updating category:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Product Unit Form" pageTitle="Product_Unit " />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <span className="placeholder col-12 mb-5 pt-5 bg-success"></span>
                    <form onSubmit={handleSave}>
                      <FormGroup row>
                        <Label for="name" sm={3}>
                          Unit:
                        </Label>

                        <Col sm={3}>
                          <Input
                            type="text"
                            id="name"
                            // placeholder="Enter name"
                            value={data.name}
                            name="name"
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </Col>

                        <Label for="ratio" sm={3}>
                          Ratio:
                        </Label>

                        <Col sm={3}>
                          <Input
                            type="number"
                            id="ratio"
                            // placeholder="Enter ratio"
                            value={data.ratio}
                            name="ratio"
                            onChange={handleInputChange}
                            className="form-control"
                            required
                            title="Please type a number only"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row></FormGroup>
                      <FormGroup row>
                        <Label for="Status" sm={3}>
                          Status:
                        </Label>

                        <Col sm={3}>
                          <ButtonToggle
                            onClick={handleToggleStatus}
                            color={data.status ? "success" : "danger"}
                            className="ml-3"
                          >
                            {data.status ? "Active" : "Inactive"}
                          </ButtonToggle>
                        </Col>
                      </FormGroup>

                      <div className="text-end">
                        <Button type="submit" className="btn btn-primary">
                          Save
                        </Button>
                      </div>
                    </form>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default PUEditor;
