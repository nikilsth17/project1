// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Col,
//   Container,
//   FormGroup,
//   Label,
//   Row,
//   Form,
//   Card,
//   CardBody,
// } from "reactstrap";

// import { useNavigate, useParams } from "react-router-dom";

// import Select from "react-select";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import { Formik, Field } from "formik";
// import EmployeeService from "../../../services/HRService/EmployeeService";
// import EmployeeSalaryService from "../../../services/HRService/EmployeeSalaryService";

// const Validation = (props) => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [mainData, setMainData] = useState({
//     id: "0",
//     employeeID: null,
//     basic: "",
//     grade: "",
//     allowance: "",
//     deductions: "",
//   });

//   const [Employee, setEmployee] = useState([]);
//   const [selectedGroup2, setSelectedGroup2] = useState(null);
//   const [errors, setErrors] = useState({});

//   const handleSelectGroups2 = (selectedOption) => {
//     const { value } = selectedOption;
//     setMainData({
//       ...mainData,
//       employeeID: value !== null ? value : "",
//     });
//     setSelectedGroup2(selectedOption);
//   };

//   const handleFieldChange = (event) => {
//     return;
//     const { name, value } = event.target;
//     setMainData({
//       ...mainData,
//       [name]: value,
//     });
//   };

//   async function getEmployeeList() {
//     try {
//       const relatedData = await EmployeeService.getList();
//       setEmployee(relatedData);
//     } catch (error) {
//       console.error("Error fetching employee list:", error);
//     }
//   }

//   async function fetchDetail() {
//     try {
//       if (!id) {
//         return;
//       }
//       const response = await EmployeeSalaryService.view(id);
//       const selectedOption = {
//         value: response.employeeID, // Use the correct field for employee ID
//         label: response.employeeName,
//       };

//       setMainData({
//         ...response,
//         employeeID: selectedOption.value.toString(),
//         basic: response.basic.toString(),
//         grade: response.grade.toString(),
//         allowance: response.allowance.toString(),
//       });
//       setSelectedGroup2(selectedOption);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     fetchDetail();
//     getEmployeeList();
//   }, []);

//   //   const handleCreatePost = async (event) => {
//   //     event.preventDefault();
//   //     try {
//   //       if (mainData.id > 0) {
//   //         await EmployeeSalaryService.update(mainData.id, mainData);
//   //         console.log("Data updated successfully", mainData);
//   //       } else {
//   //         await EmployeeSalaryService.create(mainData);
//   //         console.log("Data after POST:", mainData);
//   //       }
//   //       toast.success("Employee  Salary Added Successfully", { autoClose: 3000 });
//   //       navigate("/employeesalary-list");
//   //     } catch (error) {
//   //       console.error("Error creating/updating:", error);
//   //     }
//   //   };

//   const validationSchema = Yup.object().shape({
//     employeeID: Yup.string().required("Employee is required"),
//     basic: Yup.number()
//       .transform((value, originalValue) => {
//         console.log(value, originalValue);
//         return isNaN(originalValue) ? undefined : Number(originalValue);
//       })
//       .min(1)
//       .max(50000)
//       //   .typeError("Please enter a valid number")
//       //.positive("Basic must be a positive number")
//       .required("Please Enter Number Only"),
//     grade: Yup.number()
//       .min(1)
//       .max(50000)
//       //   .transform((value, originalValue) => {
//       //     return isNaN(originalValue) ? undefined : Number(originalValue);
//       //   })
//       //   .typeError("Please enter a valid number")
//       //.positive("Grade must be a positive number")
//       .required("Please Enter Number Only"),
//     allowance: Yup.number()
//       .min(1)
//       .max(50000)
//       //   .transform((value, originalValue) => {
//       //     return isNaN(originalValue) ? undefined : Number(originalValue);
//       //   })

//       //.positive("Allowance must be a positive number")
//       .required("Please Enter Number Only"),
//     deductions: Yup.number()
//       .min(1)
//       .max(50000)
//       //   .transform((value, originalValue) => {
//       //     return isNaN(originalValue) ? undefined : Number(originalValue);
//       //   })
//       //   .typeError("Please enter a valid number")
//       //.positive("Deductions must be a positive number")
//       .required("Please Enter Number Only"),
//   });

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <BreadCrumb title="Employee Salary Form" pageTitle="Employee" />
//         <Container fluid>
//           <Row>
//             <Col lg={12}>
//               <Card>
//                 <CardBody>
//                   <Formik
//                     initialValues={{
//                       id: "0",
//                       employeeID: null,
//                       basic: "",
//                       grade: "",
//                       allowance: "",
//                       deductions: "",
//                     }}
//                     validationSchema={validationSchema}
//                     onSubmit={async (values, { setSubmitting }) => {
//                       console.log("asdfg", values);
//                       try {
//                         console.log("asdfg", values);
//                         if (values.id > 0) {
//                           await EmployeeSalaryService.update(values.id, values);
//                           console.log("Data updated successfully", values);
//                         } else {
//                           await EmployeeSalaryService.create(values);
//                           console.log("Data after POST:", values);
//                         }
//                         toast.success("Employee Salary Added Successfully", {
//                           autoClose: 3000,
//                         });
//                         navigate("/employeesalary-list");
//                       } catch (error) {
//                         console.error("Error creating/updating:", error);
//                       } finally {
//                         setSubmitting(false);
//                       }
//                     }}
//                   >
//                     {({ errors, touched, handleSubmit }) => (
//                       <Form onSubmit={handleSubmit}>
//                         <FormGroup row className="mt-10">
//                           <Label
//                             htmlFor="employeeID"
//                             className="form-label"
//                             sm={3}
//                           >
//                             Employee
//                           </Label>
//                           <Col sm={3}>
//                             <Select
//                               isClearable={true}
//                               value={selectedGroup2}
//                               onChange={handleSelectGroups2}
//                               options={[
//                                 { value: "id", label: "Select EmployeeID" },
//                                 ...Employee.map((item) => ({
//                                   value: item.id,
//                                   label: item.name,
//                                 })),
//                               ]}
//                             />
//                           </Col>
//                           <Label htmlFor="basic" className="form-label" sm={3}>
//                             Basic:
//                           </Label>
//                           <Col sm={3}>
//                             <Field
//                               //type="string"
//                               className={`form-control ${
//                                 errors.basic && !errors.basic.includes("number")
//                                   ? "is-invalid"
//                                   : ""
//                               }`}
//                               name="basic"
//                               //value={mainData.basic}
//                               id="basic"
//                               //onChange={handleFieldChange}
//                             />
//                             {errors.basic && touched.basic ? (
//                               <div>{errors.basic}</div>
//                             ) : null}
//                           </Col>
//                         </FormGroup>
//                         <FormGroup row>
//                           <Label htmlFor="grade" className="form-label" sm={3}>
//                             Grade:
//                           </Label>
//                           <Col sm={3}>
//                             <Field
//                               // type="string"
//                               className={`form-control ${
//                                 errors.grade && !errors.grade.includes("number")
//                                   ? "is-invalid"
//                                   : ""
//                               }`}
//                               id="grade"
//                               name="grade"
//                               // value={mainData.grade}
//                               //onChange={handleFieldChange}
//                             />
//                             {errors.grade && touched.grade ? (
//                               <div>{errors.grade}</div>
//                             ) : null}
//                           </Col>
//                           <Label
//                             htmlFor="allowance"
//                             className="form-label"
//                             sm={3}
//                           >
//                             Allowance:
//                           </Label>
//                           <Col sm={3}>
//                             <Field
//                               // type="string"
//                               className={`form-control ${
//                                 errors.allowance &&
//                                 !errors.allowance.includes("number")
//                                   ? "is-invalid"
//                                   : ""
//                               }`}
//                               id="allowance"
//                               name="allowance"
//                               // value={mainData.allowance}
//                               // onChange={handleFieldChange}
//                             />
//                             {errors.allowance && touched.allowance ? (
//                               <div>{errors.allowance}</div>
//                             ) : null}
//                           </Col>
//                         </FormGroup>
//                         <FormGroup row>
//                           <Label
//                             htmlFor="deductions"
//                             className="form-label"
//                             sm={3}
//                           >
//                             Deductions:
//                           </Label>
//                           <Col sm={3}>
//                             <Field
//                               // type="string"
//                               id="deductions"
//                               name="deductions"
//                               className={`form-control ${
//                                 errors.deductions &&
//                                 !errors.deductions.includes("number")
//                                   ? "is-invalid"
//                                   : ""
//                               }`}
//                               // value={mainData.deductions}
//                               // onChange={handleFieldChange}
//                             />
//                             {errors.deductions && touched.deductions ? (
//                               <div>{errors.deductions}</div>
//                             ) : null}
//                           </Col>
//                         </FormGroup>
//                         <div className="text-end">
//                           <Button type="submit" className="btn btn-primary">
//                             Save
//                           </Button>
//                         </div>
//                       </Form>
//                     )}
//                   </Formik>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Validation;

import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Label,
  Row,
  Form,
  Card,
  CardBody,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Formik, Field, Form as FormikForm } from "formik";

import EmployeeService from "../../../services/HRService/EmployeeService";
import EmployeeSalaryService from "../../../services/HRService/EmployeeSalaryService";

const Validation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [Employee, setEmployee] = useState([]);
  const [selectedGroup2, setSelectedGroup2] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const handleSelectGroups2 = (selectedOption, setFieldValue) => {
    const { value } = selectedOption;
    setFieldValue("employeeID", value !== null ? value : "");
    setSelectedGroup2(selectedOption);
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
        value: response.employeeID,
        label: response.employeeName,
      };

      setSelectedGroup2(selectedOption);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (id) {
      fetchDetail();
      setIsEdit(true);
    }
    getEmployeeList();
  }, [id]);

  const validationSchema = Yup.object().shape({
    employeeID: Yup.string().required("Employee is required"),
    basic: Yup.number().min(1).max(50000).required("Please Enter Number Only"),
    grade: Yup.number().min(1).max(50000).required("Please Enter Number Only"),
    allowance: Yup.number()
      .min(1)
      .max(50000)
      .required("Please Enter Number Only"),
    deductions: Yup.number()
      .min(1)
      .max(50000)
      .required("Please Enter Number Only"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (values.id > 0) {
        await EmployeeSalaryService.update(values.id, values);
        console.log("Data updated successfully", values);
      } else {
        await EmployeeSalaryService.create(values);
        console.log("Data after POST:", values);
      }
      toast.success("Employee Salary Added Successfully", { autoClose: 3000 });
      navigate("/employeesalary-list");
    } catch (error) {
      console.error("Error creating/updating:", error);
    } finally {
      setSubmitting(false);
    }
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
                  <Formik
                    initialValues={{
                      id: "0",
                      employeeID: null,
                      basic: "2",
                      grade: "2",
                      allowance: "2",
                      deductions: "2",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        // Handle add or update employee salary logic here
                        if (isEdit) {
                          await EmployeeSalaryService.update(values.id, values);
                          console.log("Data updated successfully", values);
                        } else {
                          await EmployeeSalaryService.create(values);
                          console.log("Data after POST:", values);

                          toast.success("Employee Salary Added Successfully", {
                            autoClose: 3000,
                          });

                          // Navigate to the desired page after successful submission
                          navigate("/employeesalary-list");
                        }
                      } catch (error) {
                        console.error("Error creating/updating:", error);
                      } finally {
                        // Make sure to setSubmitting(false) in the finally block
                        setSubmitting(false);
                      }
                    }}
                  >
                    {({ errors, touched, handleSubmit, setFieldValue }) => (
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault(); // Prevent the default form submission
                          handleSubmit(); // Manually call Formik's handleSubmit
                        }}
                      >
                        <FormGroup row className="mt-10">
                          <Label
                            htmlFor="employeeID"
                            className="form-label"
                            sm={3}
                          >
                            Employee
                          </Label>
                          <Col sm={3}>
                            <Select
                              isClearable={true}
                              value={selectedGroup2}
                              onChange={(selectedOption) => {
                                handleSelectGroups2(
                                  selectedOption,
                                  setFieldValue
                                );
                              }}
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
                            <Field
                              className={`form-control ${
                                errors.basic && !errors.basic.includes("number")
                                  ? "is-invalid"
                                  : ""
                              }`}
                              name="basic"
                            />
                            {errors.basic && touched.basic ? (
                              <div>{errors.basic}</div>
                            ) : null}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label htmlFor="grade" className="form-label" sm={3}>
                            Grade:
                          </Label>
                          <Col sm={3}>
                            <Field
                              className={`form-control ${
                                errors.grade && !errors.grade.includes("number")
                                  ? "is-invalid"
                                  : ""
                              }`}
                              name="grade"
                            />
                            {errors.grade && touched.grade ? (
                              <div>{errors.grade}</div>
                            ) : null}
                          </Col>
                          <Label
                            htmlFor="allowance"
                            className="form-label"
                            sm={3}
                          >
                            Allowance:
                          </Label>
                          <Col sm={3}>
                            <Field
                              className={`form-control ${
                                errors.allowance &&
                                !errors.allowance.includes("number")
                                  ? "is-invalid"
                                  : ""
                              }`}
                              name="allowance"
                            />
                            {errors.allowance && touched.allowance ? (
                              <div>{errors.allowance}</div>
                            ) : null}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label
                            htmlFor="deductions"
                            className="form-label"
                            sm={3}
                          >
                            Deductions:
                          </Label>
                          <Col sm={3}>
                            <Field
                              id="deductions"
                              name="deductions"
                              className={`form-control ${
                                errors.deductions &&
                                !errors.deductions.includes("number")
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            {errors.deductions && touched.deductions ? (
                              <div>{errors.deductions}</div>
                            ) : null}
                          </Col>
                        </FormGroup>
                        <div className="text-end">
                          <Button
                            type="submit"
                            className="btn btn-primary"
                            onClick={() => console.log("Save button clicked")}
                          >
                            Save
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Validation;
