import React from "react";
import { useState, useEffect } from "react";
import {
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonToggle,
  Card,
  Row,
  CardBody,
  CardHeader,
} from "reactstrap";
import CustomerServices from "../../../services/Inventory Services/CustomerServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import { isValidPhoneNumber } from "../../Pages/Starter/PhonenumberValidation";
import * as Yup from "yup";
import toast from "react-hot-toast";

const SaleCustomersEditor = () => {
  const { id } = useParams(); // Get the id parameter from the URL
  const navigate = useNavigate();
  console.log(id);
  const initialFormData = {
    id: 0,
    name: "",
    address: "",
    telePhone_No: "",
    openingBalance: "",
    registration_No: "",
    registered_Date: "",
    ledger_code: "",
    status: true,
  };

  const [customer, setCustomer] = useState(initialFormData);
  const [isValidTelNo, setIsValidTelNo] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter a valid name"),
    address: Yup.string().required("Please enter your address"),
    telePhone_No: Yup.string()
      .matches(/^\+?\d{10}$/, {
        message: "Please enter a valid 10-digit phone number",
        excludeEmptyString: true,
      })
      .required("Please enter a valid phone number"),
    openingBalance: Yup.number().typeError("Please enter the opening balance").required("Please enter the opening balance"),
    registration_No: Yup.string().required("Please enter the registration number"),
    registered_Date: Yup.date().typeError("Please choose the registered date").required("Please choose the registered date"),
    ledger_code: isEditing ? Yup.string() : Yup.string().required("Please enter the ledger code"),
  });
  

    const validateData = async () => {
      try {
        await validationSchema.validate(customer, { abortEarly: false });
        setErrors({});
        return true;
      } catch (validationErrors) {
        if (validationErrors.inner) {
          const newErrors = {};
          validationErrors.inner.forEach((error) => {
            newErrors[error.path] = `${error.message} `;
          });
          setErrors(newErrors);
        } else {
          // Handle scenario when validationErrors.inner is undefined or null
          console.error("Validation errors not found or in unexpected format:", validationErrors);
        }
        return false;
      }
    };
    



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
     // Validate the phone number
     if (name === 'telePhone_No') { // Update the name to match the input field
      setIsValidTelNo(isValidPhoneNumber(value));
    }
  };

  const handleToggleStatus = () => {
    setCustomer({
      ...customer,
      status: !customer.status,
    });
    
  };

  // to  ount the id from a service to show exist data when we update data
  useEffect(() => {
    if (id) {
      // If there's an id, it means we are editing an existing category
      setIsEditing(true);
      CustomerServices.view(id)
        .then((customers) => {
          setCustomer(customers);
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
      setCustomer(customer);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateData();
  
    if (!isValid) {
      return; // If data is invalid, stop further execution
    }
  
    try {
      if (isEditing) {
        // If there's an id, it's an update operation
        await CustomerServices.update(id, customer);
        toast.success("Customer Updated Successfully", { autoClose: 3000 });
        console.log("Category updated successfully");
      } else {
        // If there's no id, it's a create operation
        const response = await CustomerServices.create(customer);
        toast.success("Customer Added Successfully", { autoClose: 3000 });
  
        console.log("Category created:", response);
        // Redirect to the item list after create/update
      }
      navigate("/customers");
    } catch (error) {
      console.error("Error creating/updating category:", error);
    }
  };
  

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Customer Form" pageTitle="Customer" />
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  
                    <FormGroup row>
                    
                        <Label for="name" sm={2}>Name:</Label>
                      
                      <Col sm={4}>
                        <Input
                          type="text"
                          id="name"
                          value={customer.name}
                          name="name"
                          onChange={handleInputChange}
                          className={`form-control ${
                            errors.name ? "is-invalid" : "is-valid"
                          }`}
                          onBlur={validateData}
                        />
                         {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </Col>
                     
                        <Label for="address" sm={2}>Address:</Label>
                     
                      <Col sm={4}>
                        <Input
                          type="text"
                          id="address"
                          value={customer.address}
                          name="address"
                          onChange={handleInputChange}
                          className={`form-control ${
                            errors.address ? "is-invalid" : "is-valid"
                          }`}
                          onBlur={validateData}
                        />
                         {errors.address && (
                          <div className="invalid-feedback">{errors.address}</div>
                        )}
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                     
                        <Label for="telePhone_No" sm={2}>Phone Number:</Label>
                     
                      <Col sm={4}>
                        <Input
                   type="text"
                  
                   id="telePhone_No"
                   name="telePhone_No"
                   value={customer.telePhone_No}
                   onChange={handleInputChange}
                   className={`form-control ${
                    errors.telePhone_No ? "is-invalid" : "is-valid"
                  }`}
                  onBlur={validateData}
                 />
                  {errors.telePhone_No && (
                          <div className="invalid-feedback">{errors.telePhone_No}</div>
                        )}
                
                      </Col>
                    
                        <Label for="openingBalance" sm={2}>Opening Balance:</Label>
                  
                      <Col sm={4}>
                        <Input
                          type="number"
                          id="openingBalance"
                          value={customer.openingBalance}
                          name="openingBalance"
                          onChange={handleInputChange}
                          className={`form-control ${
                            errors.openingBalance ? "is-invalid" : "is-valid"
                          }`}
                          onBlur={validateData}
                        />
                          {errors.openingBalance && (
                          <div className="invalid-feedback">{errors.openingBalance}</div>
                        )}
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                   
                        <Label for="registration_No" sm={2}>Registration No:</Label>
                      
                      <Col sm={4}>
                        <Input
                          type="string"
                          id="registration_No"
                          value={customer.registration_No}
                          name="registration_No"
                          onChange={handleInputChange}
                         
                          className={`form-control ${
                            errors.registration_No ? "is-invalid" : "is-valid"
                          }`}
                          onBlur={validateData}
                        />
                        {errors.registration_No && (
                          <div className="invalid-feedback">{errors.registration_No}</div>
                        )}
                      </Col>
                  
                        <Label for="registered_Date" sm={2}>Registered Date:</Label>
                  
                      <Col sm={4}>
                        <Input
                          type="date"
                          id="registered_Date"
                          value={customer.registered_Date
                            .split("T")[0]
                            .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                            .substring(0, 10)}
                          name="registered_Date"
                          onChange={handleInputChange}
                          className={`form-control ${
                            errors.registered_Date ? "is-invalid" : "is-valid"
                          }`}
                          onBlur={validateData}
                        />
                          {errors.registered_Date&& (
                          <div className="invalid-feedback">{errors.registered_Date}</div>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                    {!isEditing || !customer.id ? (
 <>
                  
                        <Label for="ledger_code" sm={2}>Ledger Code:</Label>
                     
                      <Col sm={4}>
                        <Input
                          type="string"
                          id="ledger_code"
                          value={customer.ledger_code}
                          name="ledger_code"
                          onChange={handleInputChange}
                          className={`form-control ${
                            errors.ledger_code ? "is-invalid" : "is-valid"
                          }`}
                          onBlur={validateData}
                          
                        />
                          {errors.ledger_code && (
                          <div className="invalid-feedback">{errors.ledger_code}</div>
                        )}
                      </Col>
                      </>
                      ) : null}
                      
                        <Label for="status" sm={2}>Status:</Label>
                      
                      <Col sm={3}>
                        <ButtonToggle
                          onClick={handleToggleStatus}
                          color={customer.status ? "success" : "danger"}
                          className="ml-3"
                        >
                          {customer.status ? "Active" : "Inactive"}
                        </ButtonToggle>
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
  
  );
};

export default SaleCustomersEditor;
