import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonToggle,
} from "reactstrap";
import ConfigureSetingServices from "../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";

const ConfigureSettingUpdate = () => {
    const { name } = useParams(); // Get the id parameter from the URL
    const navigate = useNavigate();
    //console.log(id);
    const initialFormData = {
      id: 0,
      name: "",
      value: "",
      description: "",
   };
  
    const [customer, setCustomer] = useState(initialFormData);
    const [isEditing, setIsEditing] = useState(false);
 
  

  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCustomer({
        ...customer,
        [name]: value,
      });
      // Validate the phone number
      if (name === "telePhone_No") {
        // Update the name to match the input field
        setIsValidTelNo(isValidPhoneNumber(value));
      }
    };
  

  
    // to  ount the id from a service to show exist data when we update data
    useEffect(() => {
      if (name) {
        setIsEditing(true);
       ConfigureSetingServices.view(name)
          .then((customers) => {
            setCustomer(customers);
            setCustomer({ ...customers });
          })
          .catch((error) => console.error("Error fetching item:", error));
      } else {
        setIsEditing(false);
        setCustomer(customer);
      }
    }, [name]);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        if (isEditing) {
          const payload = {
            configDto: [
              {
                Name: customer.name,
                Value: customer.value,
                Description: customer.description,
                // Add other required fields if needed
              },
            ],
          };
    
          // Send the payload to the server
          await ConfigureSetingServices.update(name, payload.configDto);
    
          console.log("Good Category updated successfully");
    
          navigate("/Configure Setting");
        }
      } catch (error) {
        console.error("Error updating Good Category:", error);
        // Handle error scenarios
      }
    };
    
    
    
      
  return (
    <React.Fragment>
    <div className="page-content">
      <BreadCrumb title="Good Category Field" pageTitle="Good Category" />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup row>
                  <Label for="title" sm={2}>
                    Name:
                  </Label>

                  <Col sm={4}>
                    <Input
                      type="text"
                      id="name"
                      value={customer.name}
                      name="name"
                      onChange={handleInputChange}
                      className="form-control"
                      // className={`form-control ${
                      //   errors.title ? "is-invalid" : "is-valid"
                      // }`}
                     // onBlur={validateData}
                    />
                    {/* {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )} */}
                  </Col>
                  <Label for="value" sm={2}>
                Value:
                  </Label>

                  <Col sm={4}>
                    <Input
                      type="text"
                      id="value"
                      value={customer.value}
                      name="value"
                      onChange={handleInputChange}
                      className="form-control"
                      // className={`form-control ${
                      //   errors.title ? "is-invalid" : "is-valid"
                      // }`}
                     // onBlur={validateData}
                    />
                    {/* {errors.value && (
                      <div className="invalid-feedback">{errors.value}</div>
                    )} */}
                  </Col> 

                 
                 
                </FormGroup>
                <FormGroup row>
                <Label for="description" sm={2}>
                  Description:
                  </Label>

                  <Col sm={4}>
                    <Input
                      type="text"
                      id="description"
                      value={customer.description}
                      name="description"
                      onChange={handleInputChange}
                      className="form-control"
                      // className={`form-control ${
                      //   errors.title ? "is-invalid" : "is-valid"
                      // }`}
                      //onBlur={validateData}
                    />
                    {/* {errors.description && (
                      <div className="invalid-feedback">{errors.description}</div>
                    )} */}
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
    </div>
  </React.Fragment>
  )
}

export default ConfigureSettingUpdate