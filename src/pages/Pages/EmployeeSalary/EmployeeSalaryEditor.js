import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Form,
  Card,
  CardBody,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeSalaryService from "../../../services/HRService/EmployeeSalaryService";
import EmployeeService from "../../../services/HRService/EmployeeService";
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import * as Yup from "yup";
import toast from "react-hot-toast";

const EmployeeSalaryEditor = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mainData, setMainData] = useState({
    id: "0",
    employeeID: null,
    basic: "",
    grade: "",
    allowance: "",
    deductions: "",
  });

  const [Employee, setEmployee] = useState([]);
  const [selectedGroup2, setSelectedGroup2] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSelectGroups2 = (selectedOption) => {
    const { value } = selectedOption;
    setMainData({
      ...mainData,
      employeeID: value !== null ? value : "",
    });
    setSelectedGroup2(selectedOption);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMainData({
      ...mainData,
      [name]: value,
    });
  };

  async function getEmployeeList() {
    try {
      const relatedData = await EmployeeService.getList();
      setEmployee(relatedData);
    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  }

  async function fetchDetail() {
    try {
      if (!id) {
        return;
      }
      const response = await EmployeeSalaryService.view(id);
      const selectedOption = {
        value: response.employeeID, // Use the correct field for employee ID
        label: response.employeeName,
      };

      setMainData({
        ...response,
        employeeID: selectedOption.value.toString(),
        basic: response.basic.toString(),
        grade: response.grade.toString(),
        allowance: response.allowance.toString(),
      });
      setSelectedGroup2(selectedOption);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDetail();
    getEmployeeList();
  }, []);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      if (mainData.id > 0) {
        await EmployeeSalaryService.update(mainData.id, mainData);
        console.log("Data updated successfully", mainData);
      } else {
        await EmployeeSalaryService.create(mainData);
        console.log("Data after POST:", mainData);
      }
      toast.success("Employee  Salary Added Successfully", { autoClose: 3000 });
      navigate("/employeesalary-list");
    } catch (error) {
      console.error("Error creating/updating:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    employeeID: Yup.string().required("Employee is required"),
    basic: Yup.number()
      .transform((value, originalValue) => {
        return isNaN(originalValue) ? undefined : Number(originalValue);
      })
      .typeError("Please enter a valid number")
      .positive("Basic must be a positive number")
      .required("Please Enter Number Only"),
    grade: Yup.number()
      .transform((value, originalValue) => {
        return isNaN(originalValue) ? undefined : Number(originalValue);
      })
      .typeError("Please enter a valid number")
      .positive("Grade must be a positive number")
      .required("Please Enter Number Only"),
    allowance: Yup.number()
      .transform((value, originalValue) => {
        return isNaN(originalValue) ? undefined : Number(originalValue);
      })
      .typeError("Please enter a valid number")
      .positive("Allowance must be a positive number")
      .required("Please Enter Number Only"),
    deductions: Yup.number()
      .transform((value, originalValue) => {
        return isNaN(originalValue) ? undefined : Number(originalValue);
      })
      .typeError("Please enter a valid number")
      .positive("Deductions must be a positive number")
      .required("Please Enter Number Only"),
  });

  const handleBlur = () => {
    validationSchema
      .validate(mainData, { abortEarly: false })
      .then(() => {})
      .catch((validationErrors) => {
        const newErrors = {};
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Employee Salary Form" pageTitle="Employee" />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form onSubmit={handleCreatePost}>
                    <FormGroup row className="mt-10">
                      <Label htmlFor="employeeID" className="form-label" sm={3}>
                        Employee
                      </Label>
                      <Col sm={3}>
                        <Select
                          isClearable={true}
                          value={selectedGroup2}
                          onChange={handleSelectGroups2}
                          options={[
                            { value: "id", label: "Select EmployeeID" },
                            ...Employee.map((item) => ({
                              value: item.id,
                              label: item.name,
                            })),
                          ]}
                        />
                      </Col>
                      <Label htmlFor="basic" className="form-label" sm={3}>
                        Basic:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="string"
                          name="basic"
                          value={mainData.basic}
                          id="basic"
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                          className={`form-control ${
                            errors.basic && !errors.basic.includes("number")
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {errors.basic && (
                          <div className="invalid-feedback">{errors.basic}</div>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label htmlFor="grade" className="form-label" sm={3}>
                        Grade:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="string"
                          className={`form-control ${
                            errors.grade && !errors.grade.includes("number")
                              ? "is-invalid"
                              : ""
                          }`}
                          id="grade"
                          name="grade"
                          value={mainData.grade}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                        />
                        {errors.grade && (
                          <div className="invalid-feedback">{errors.grade}</div>
                        )}
                      </Col>
                      <Label htmlFor="allowance" className="form-label" sm={3}>
                        Allowance:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="string"
                          className={`form-control ${
                            errors.allowance &&
                            !errors.allowance.includes("number")
                              ? "is-invalid"
                              : ""
                          }`}
                          id="allowance"
                          name="allowance"
                          value={mainData.allowance}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                        />
                        {errors.allowance && (
                          <div className="invalid-feedback">
                            {errors.allowance}
                          </div>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label htmlFor="deductions" className="form-label" sm={3}>
                        Deductions:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="string"
                          className={`form-control ${
                            errors.deductions &&
                            !errors.deductions.includes("number")
                              ? "is-invalid"
                              : ""
                          }`}
                          id="deductions"
                          name="deductions"
                          value={mainData.deductions}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                        />
                        {errors.deductions && (
                          <div className="invalid-feedback">
                            {errors.deductions}
                          </div>
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
    </React.Fragment>
  );
};

export default EmployeeSalaryEditor;
