import React from "react";
import { useState, useEffect } from "react";
import {
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Button,
  Card,
  Row,
  CardBody,
  CardHeader,
  Label,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import VendorsServices from "../../../services/Inventory Services/VendorServices";
import DatePicker from "react-flatpickr";
import { isValidPhoneNumber } from "../../Pages/Starter/PhonenumberValidation";
import * as Yup from "yup";
import toast from "react-hot-toast";

const VendorsEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendorForm, setVendorForm] = useState({
    name: "",
    address: "",
    registration_No: "",
    tel_No: "",
    opening_Balance: "",
    registered_Date: "",
    ledger_code: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isValidTelNo, setIsValidTelNo] = useState(true);
 

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter a valid name"),
    address: Yup.string().required("Please enter your address"),
    registration_No: Yup.string().required("Please enter the registration number"),
  
    tel_No: Yup.string()
      .matches(/^\+?\d{10}$/, {
        message: "Please enter a valid 10-digit phone number",
        excludeEmptyString: true,
      })
      .required("Please enter a valid phone number"),
      opening_Balance: Yup.number().typeError("Please enter the opening balance").required("Please enter the opening balance"),
      registered_Date: Yup.date().typeError("Please enter the registered date").required("Please enter the registered date"),
    ledger_code: isEditing ? Yup.string() : Yup.string().required("Please enter the ledger code"),
  });

  const [errors, setErrors] = useState({}); // State to hold validation errors

  const validateData = async () => {
    try {
      await validationSchema.validate(vendorForm, { abortEarly: false });
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
    setVendorForm({
      ...vendorForm,
      [name]: value,
    });
      // Validate the phone number
      if (name === 'tel_No') {
        setIsValidTelNo(isValidPhoneNumber(value));
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateData();
  
    if (!isValid) {
      return; // If data is invalid, stop further execution
    }
  
    try {
      if (isEditing) {
        // If there's an id, it's an update operation
        await VendorsServices.update(id, vendorForm);
        toast.success("Vendor Updated Successfully", { autoClose: 3000 });
        console.log("Vendor updated successfully");
      } else {
        // If there's no id, it's a create operation
        const response = await VendorsServices.create(vendorForm);
        toast.success("Vendor Added Successfully", { autoClose: 3000 });
  
        console.log("Vendor created:", response);
        // Redirect to the item list after create/update
      }
      navigate("/vendor");
    } catch (error) {
      console.error("Error creating/updating Vendor:", error);
    }
  };


  useEffect(() => {
    if (id) {
      setIsEditing(true);
      VendorsServices.view(id)
        .then((vendor) => {
          setVendorForm(vendor);
        })
        .catch((error) => console.error("Error fetching vendor:", error));
    } else {
      setIsEditing(false);
      setVendorForm(vendorForm);
    }
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Vendors Form" pageTitle="Vendor" />
          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                       <FormGroup row>
                      <Label htmlFor="name" sm={2}>
                        Name:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                     
                          id="name"
                          name="name"
                          value={vendorForm.name}
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
                      <Label htmlFor="address" sm={2}>
                        Address:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                       
                          id="address"
                          name="address"
                          value={vendorForm.address}
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
                      <Label htmlFor="registration_No" sm={2}>
                        Registration No:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                      
                          id="registration_No"
                          name="registration_No"
                          value={vendorForm.registration_No}
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
                      <Label htmlFor="tel_No" sm={2}>
                        Phone Number:
                      </Label>
                      <Col sm={4}>
                      <Input
            type="text"
           
            id="tel_No"
            name="tel_No"
            value={vendorForm.tel_No}
            onChange={handleInputChange}
            className={`form-control ${
              errors.tel_No ? "is-invalid" : "is-valid"
            }`}
            onBlur={validateData}
          />
            {errors.tel_No && (
                          <div className="invalid-feedback">{errors.tel_No}</div>
                        )}  
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label htmlFor="opening_Balance" sm={2}>
                        Opening Balance:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="number"
                         
                          id="opening_Balance"
                          name="opening_Balance"
                          value={vendorForm.opening_Balance}
                          onChange={handleInputChange}
                          className={`form-control ${
                            errors.opening_Balance ? "is-invalid" : "is-valid"
                          }`}
                          onBlur={validateData}
                        />
                        {errors.opening_Balance && (
                          <div className="invalid-feedback">{errors.opening_Balance}</div>
                        )}
                      </Col>
                      <Label htmlFor="registered_Date" sm={2}>
                        Registered Date:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="date"
                        
                          id="registered_Date"
                          name="registered_Date"
                          value={vendorForm.registered_Date
                            .split("T")[0]
                            .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")}
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
                    {!isEditing || !vendorForm.id ? (
                      <>
                      <Label htmlFor="ledger_code" sm={2}>
                        Ledger Code:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                          id="ledger_code"
                          name="ledger_code"
                          value={vendorForm.ledger_code}
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

export default VendorsEditor;
