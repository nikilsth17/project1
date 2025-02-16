import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useState, useEffect } from "react";
import VehicleServices from "../../../services/Inventory Services/VehicleServices";
import Select from "react-select";
import VechicleTypeService from "../../../services/Inventory Services/VehicleTypeServices";
import { useNavigate, useParams } from "react-router-dom";
import FuelTokenServices from "../../../services/HRService/FuelTokenServices";
import SelectOption from "../../Pages/Starter/Selectoption";
import * as Yup from "yup";

import toast from "react-hot-toast";
const VehicleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mainData, setMainData] = useState({
    id: "0",
    vehicleTypeId: "",
    fuelType: 1,
    vehicle_No: "",
    vehicle_Model: "",
  });

  const [vehicleTypedId, setVehicleTypedId] = useState([]);
  const [isFuelTypeId, setIsFuelTypeId] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    vehicleTypeId: Yup.number().typeError("Please choose vehicleTypeId ")
    .positive("Grade must be a positive number")
    .required("Please Enter Number Only"),
    fuelType: Yup.number().required("Please Choose fuelType "),
    vehicle_No: Yup.string().required("Please Enter Valid     vehicle_No "),
    vehicle_Model: Yup.string().required("Please Enter Valid vehicle_Model "),
  });

  const validateData = async () => {
    try {
      await validationSchema.validate(mainData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = `${error.message} `;
      });
      setErrors(newErrors);
      return false;
    }
  };

  
  // const handleBlur = () => {
  //   validationSchema
  //     .validate(mainData, { abortEarly: false })
  //     .then(() => setErrors({}))
  //     .catch((validationErrors) => {
  //       const newErrors = {};
  //       validationErrors.inner.forEach((error) => {
  //         newErrors[error.path] = `${error.message}`;
  //       });
  //       setErrors(newErrors);
  //     });
  // };

  function handleSelect(selectedSingle) {
    setMainData({
      ...mainData,
      fuelType: selectedSingle.value,
    });
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "fuelType") {
      // Handle changes for fuelType field
      setMainData({
        ...mainData,
        [name]: parseInt(value, 10),
      });
    } else {
      // Handle changes for other fields
      setMainData({
        ...mainData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchvehicle = await VechicleTypeService.getList();
        setVehicleTypedId(fetchvehicle);

        const fetchFuelTypeId = await FuelTokenServices.FueltypegetList();
        setIsFuelTypeId(fetchFuelTypeId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      VehicleServices.view(id)
        .then((item) => {
          setMainData({
            ...mainData,
            vehicleTypeId: item.vehicleTypeId,
            fuelType: item.fuelTypeId,
            vehicle_No: item.vehicle_No,
            vehicle_Model: item.vehicle_Model,
          });
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateData();
    if (isValid) {
      try {
        if (isEditing) {
          await VehicleServices.update(id, mainData);
          toast.success("Vehicle Updated Successfully", { autoClose: 3000 });
     
          console.log("Category updated successfully");
        } else {
          const response = await VehicleServices.create(mainData);
          toast.success("Vehicle Added Successfully", { autoClose: 3000 });
     
          console.log("Category created:", response);
        }
       navigate("/vehicle-list");
      } catch (error) {
        console.error("Error creating/updating category:", error);
      }
    }
  };

  return (
    <div className="page-content">
      <BreadCrumb title="Vehicle Form" pageTitle="Vehicle" />
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup row>
                    <Label htmlFor="vehicleTypeId" className="form-label" sm={3}>
                      Vehicle Type:
                    </Label>
                    <Col sm={3}>
                      <select
                        type="number"
                        id="vehicleTypeId"
                        placeholder="Select vehicleTypeId"
                        value={mainData.vehicleTypeId}
                        name="vehicleTypeId"
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.vehicleTypeId ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      
                      >
                        <option value="">Select vehicleType</option>
                        {vehicleTypedId.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      {errors.vehicleTypeId && (
                          <div className="invalid-feedback">{errors.vehicleTypeId}</div>
                        )}
                    </Col>
                    <Label htmlFor="fuelType" className="form-label" sm={3}>
                      Fuel Type:
                    </Label>
                    <Col sm={3}>
                      <select
                        type="number"
                        name="fuelType"
                        value={mainData.fuelType}
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
                  </FormGroup>
                  <FormGroup row>
                    <Label htmlFor="vehicle_No" className="form-label" sm={3}>
                      Vehicle No:
                    </Label>
                    <Col sm={3}>
                      <Input
                        type="text"
                       
                        id="vehicle_No"
                        name="vehicle_No"
                        placeholder="Enter vehicle No"
                        value={mainData.vehicle_No}
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.vehicle_No ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      />
                        {errors.vehicle_No&& (
                          <div className="invalid-feedback">{errors.vehicle_No}</div>
                        )}
                    </Col>
                    <Label htmlFor="vehicle_Model" className="form-label" sm={3}>
                      Vehicle Model:
                    </Label>
                    <Col sm={3}>
                      <Input
                        type="text"
                        
                        id="vehicle_Model"
                        name="vehicle_Model"
                        placeholder="Enter vehicle Model"
                        value={mainData.vehicle_Model}
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.vehicle_Model ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      />
                       {errors.vehicle_Model && (
                          <div className="invalid-feedback">{errors.vehicle_Model}</div>
                        )}
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
  );
};

export default VehicleEditor;