import React, { useEffect, useState } from "react";
import LayoutWithBreadCrumb from "../Starter/LayoutWithBreadCrumb";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Button,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Input,
} from "reactstrap";
import EmployeeService from "../../../services/HRService/EmployeeService";
import VehicleServices from "../../../services/Inventory Services/VehicleServices";
import VendorsServices from "../../../services/Inventory Services/VendorServices";
import FuelTokenServices from "../../../services/HRService/FuelTokenServices";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import toast from "react-hot-toast";
import DatePicker from "react-flatpickr";

function TokenEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fuelForm, setFuelForm] = useState({
 
    ref_No: "",
    driverId: 0,
    vehicleId: 0,
    fuelType: 1, // Initialize as an empty string
    pumpId: 0, // Initialize as an empty string
    issued_Date: "",
    quantity: "",
    remarks: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    ref_No: Yup.string().required("Please enter a ref_No:"),
    driverId: Yup.number().required("Please choose driver"),
    vehicleId: Yup.number().required("Please choose  vehicle"),
    fuelType: Yup.number().required("Please choose   fuelType"),
    pumpId: Yup.number().typeError("Please choose  pump").required("Please choose  pump"),
    issued_Date: Yup.date().typeError("Please choose  issued_Date").required("Please choose issued_Date"),
    quantity: Yup.number().typeError("Please enter quantity").required("Please  enter quantity"),
    remarks:  Yup.string().required("Please enter  remarks"),
  });
  

    const validateData = async () => {
      try {
        await validationSchema.validate(fuelForm, { abortEarly: false });
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

  const GLTypes = [
    { value: 1, label: "Petrol" },
    { value: 2, label: "Diesel" },
  ];

  function handleSelect(selectedSingle) {
    if (fuelForm.fuelType)
    fuelForm.fuelType = parseInt(fuelForm.fuelType.toString());

    setFuelForm({
      ...fuelForm,
      fuelType: selectedSingle.value,
    });
  }

  const [employId, setEmployId] = useState([]);
  const [isvehicledId, setIsvehicledId] = useState([]);
  const [pumpedId, setPumpedId] = useState([]);
  const [isFuelTypeId, setIsFuelTypeId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedemploy = await EmployeeService.getList();
        setEmployId(fetchedemploy);

        const fetchedvehicle = await VehicleServices.getList();
        setIsvehicledId(fetchedvehicle);

        const fetchedpumped = await VendorsServices.getList();
        setPumpedId(fetchedpumped);

        const fetchFuelTypeId = await FuelTokenServices.FueltypegetList();
        setIsFuelTypeId(fetchFuelTypeId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    if (name === "fuelType") {
      // Convert the selected value to an integer
      setFuelForm({
        ...fuelForm,
        [name]: parseInt(value, 10),
      });
    } else {
      // Handle changes for other fields
      setFuelForm({
        ...fuelForm,
        [name]: value,
      });
    }
  };
  

  

  useEffect(() => {
    if (id) {
      // If there's an id, it means we are editing an existing category
      setIsEditing(true);
      FuelTokenServices.view(id)
        .then((fuelForm) => {
          
          
          setFuelForm({
            ref_No:fuelForm.ref_No,
            driverId:fuelForm.driverId,
            vehicleId:fuelForm.vehicleId,
            fuelType:fuelForm.fuelTypeId,
            pumpId:fuelForm.pumpID,
            issued_Date:fuelForm._Issued_Date ? fuelForm._Issued_Date.split("T")[0] : "",
            quantity:fuelForm.quantity,
            remarks:fuelForm.remarks,
        });
       
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
      setFuelForm(fuelForm);
    }
  }, [id]);
  const handleSave = async (e) => {
    e.preventDefault();
    const isValid = await validateData();
  
    if (!isValid) {
      return; // If data is invalid, stop further execution
    }
    try {
      if (isEditing) {
        await FuelTokenServices.update(id, fuelForm);
        toast.success("Fuel Token Updated Successfully", { autoClose: 3000 });
      
        console.log("Fuel Token updated successfully");
      } else {
        const response = await FuelTokenServices.create(fuelForm);
        toast.success("Fuel Token Added Successfully", { autoClose: 3000 });
  
        console.log("Fuel Token created:", response);
      }
      navigate("/Fuel_Token-list");
    } catch (error) {
      console.error("Error creating/updating Fuel Token:", error);
    }
  };

  return (
    
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb title="Fuel Token Form" pageTitle="Fuel Token" />
          <Container fluid>
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <Form onSubmit={handleSave}>
                       <FormGroup row>
                        <Row>
                          <Label htmlFor="ref_No" sm={2}>
                            Reference No:
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="text"
                              id="ref_No"
                              name="ref_No"
                              value={fuelForm.ref_No}
                              onChange={handleInputChange}
                              className={`form-control ${
                                errors.ref_No ? "is-invalid" : "is-valid"
                              }`}
                              onBlur={validateData}
                            />
                             {errors.ref_No && (
                          <div className="invalid-feedback">{errors.ref_No}</div>
                        )}
                          </Col>
                          <Label htmlFor="driverId" sm={2}>
                            Driver:
                          </Label>
                          <Col sm={4}>
                            <select
                              type="number"
                              id="driverId"
                              value={fuelForm.driverId}
                              name="driverId"
                              onChange={handleInputChange}
                              className={`form-control ${
                                errors.driverId ? "is-invalid" : "is-valid"
                              }`}
                              onBlur={validateData}
                            >
                              <option value="">Select driver</option>
                              {employId.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                            {errors.driverId && (
                          <div className="invalid-feedback">{errors.driverId}</div>
                        )}
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup row>
                        <Row>
                          <Label htmlFor="vehicleId" sm={2}>
                            Vehicle No:
                          </Label>
                          <Col sm={4}>
                            <select
                              type="number"
                              id="vehicleId"
                              value={fuelForm.vehicleId}
                              name="vehicleId"
                              onChange={handleInputChange}
                              className={`form-control ${
                                errors.vehicleId ? "is-invalid" : "is-valid"
                              }`}
                              onBlur={validateData}
                            >
                              <option value="">Select vehicle</option>
                              {isvehicledId.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.vehicle_No}
                                </option>
                              ))}
                            </select>
                            {errors.vehicleId && (
                          <div className="invalid-feedback">{errors.vehicleId}</div>
                        )}
                          </Col>
                          <Label htmlFor="fuelType" sm={2}>
                            Fuel Type:
                          </Label>
                          <Col sm={4}>
                          <select
                        type="number"
                        name="fuelType"
                        value={fuelForm.fuelType}
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.fuelType ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      >
                        <option value="">Select Fueltype</option>
                        {isFuelTypeId.map((item) => (
                          <option key={item.fue01uin} value={item.fue01uin}>
                          {item.fue01title}
                          </option>
                        ))}
                      </select>
                      {errors.fuelType && (
                          <div className="invalid-feedback">{errors.fuelType}</div>
                        )}
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup row>
                        <Row>
                          <Label htmlFor="pumpId" sm={2}>
                            Pump:
                          </Label>
                          <Col sm={4}>
                            <select
                              type="number"
                              id="pumpId"
                              value={fuelForm.pumpId}
                              name="pumpId"
                              onChange={handleInputChange}
                              className={`form-control ${
                                errors.pumpId ? "is-invalid" : "is-valid"
                              }`}
                              onBlur={validateData}
                            >
                              <option value="">Select pump</option>
                              {pumpedId.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                                
                              ))}
                              
                            </select>
                            {errors.pumpId && (
                          <div className="invalid-feedback">{errors.pumpId}</div>
                        )}
                          </Col>
                          <Label htmlFor="issued_Date" sm={2}>
                            Issued Date:
                          </Label>
                          <Col sm={4}>
                            <DatePicker
                              type="date"
                           
                              id="issued_Date"
                              name="issued_Date"
                              value={fuelForm.issued_Date
                                }
                                onChange={(date) => setFuelForm({...fuelForm, issued_Date: date[0]})}
               
                              className={`form-control ${
                                errors.issued_Date ? "is-invalid" : "is-valid"
                              }`}
                              onBlur={validateData}
                            />
                             {errors.issued_Date && (
                          <div className="invalid-feedback">{errors.issued_Date}</div>
                        )}
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup row>
                        <Row>
                          <Label htmlFor="quantity" sm={2}>
                            Quantity:
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                             
                              id="quantity"
                              name="quantity"
                              value={fuelForm.quantity}
                              onChange={handleInputChange}
                              className={`form-control ${
                                errors.quantity ? "is-invalid" : "is-valid"
                              }`}
                              onBlur={validateData}
                            />
                             {errors.quantity && (
                          <div className="invalid-feedback">{errors.quantity}</div>
                        )}
                          </Col>
                          <Label htmlFor="remarks" sm={2}>
                            Remarks:
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="text"
                            
                              id="remarks"
                              name="remarks"
                              value={fuelForm.remarks}
                              onChange={handleInputChange}
                              className={`form-control ${
                                errors.remarks ? "is-invalid" : "is-valid"
                              }`}
                              onBlur={validateData}
                            />
                             {errors.remarks && (
                          <div className="invalid-feedback">{errors.remarks}</div>
                        )}
                          </Col>
                        </Row>
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
}

export default TokenEditor;
