// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Col,
//   Container,
//   FormGroup,
//   Input,
//   Label,
//   Row,
//   Card,
//   Form,
//   CardBody,
// } from "reactstrap";
// import { useNavigate, useParams } from "react-router-dom";
// import EmployeeService from "../../../services/HRService/EmployeeService";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import { isValidPhoneNumber } from "../Starter/PhonenumberValidation";
// const EmployeeEditor = (props) => {
//   const navigate = useNavigate();
//   const [isValid, setIsValid] = useState(true);
//   const { id } = useParams();

//   // Initialize state for mainData with default values
//   const [mainData, setMainData] = useState({
//     id: "0",
//     name: "",
//     dob: "",
//     gender: 0, // Initialize with 0 for Male
//     email: "",
//     phoneNumber: "",
//     address: "",
//     nationality: "",
//     ledger_code: "",
//   });
//   const [isValidTelNo, setIsValidTelNo] = useState(true);
//   // Handle input changes
//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setMainData({
//       ...mainData,
//       [name]: value,
//     });
//     // Validate the phone number
//     if (name === "phoneNumber") {
//       // Update the name to match the input field
//       setIsValidTelNo(isValidPhoneNumber(value));
//     }
//   };

//   // Handle radio button change
//   const onOptionChange = (e) => {
//     const { name, value } = e.target;
//     setMainData({ ...mainData, [name]: parseInt(value) });
//   };

//   // const handleChange = (e) => {
//   //   const inputPhoneNumber = e.target.value;
//   //   setMainData({
//   //     ...mainData,
//   //     phoneNumber: inputPhoneNumber,
//   //   });

//   // Define a regex pattern to match a 10-digit phone number
//   //   const phoneNumberPattern = /^\d{10}$/;
//   //   const isInputValid = phoneNumberPattern.test(inputPhoneNumber);
//   //   setIsValid(isInputValid);
//   // };

//   async function fetchDetail() {
//     try {
//       if (!id) {
//         return;
//       }
//       const response = await EmployeeService.view(id);
//       setMainData(response);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     fetchDetail();
//   }, []);

//   const handleCreatePost = async (event) => {
//     event.preventDefault();
//     if (mainData.phoneNumber && mainData.phoneNumber.match(/^[0-9]{10}$/)) {
//       try {
//         if (mainData.id > 0) {
//           // Update an existing item
//           await EmployeeService.update(mainData.id, mainData);
//           console.log("Data updated successfully", mainData);
//         } else {
//           // Create a new item
//           await EmployeeService.create(mainData);
//           console.log("Data after POST:", mainData);
//         }

//         navigate("/employee-list");
//       } catch (error) {
//         console.error("Error creating/updating:", error);
//       }
//       console.error("Please filled 10 digit number ");
//     }
//   };

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <BreadCrumb title="Employee Form" pageTitle="Employee" />
//         <Container fluid>
//           <Row>
//             <Col lg={12}>
//               <Card>
//                 <CardBody>
//                   <span className="placeholder col-12  mb-5 pt-5  bg-success rounded-3"></span>
//                   <Form onSubmit={handleCreatePost}>
//                     <FormGroup row className="mt-10 pt-10">
//                       <Label htmlFor="name" className="form-label" sm={3}>
//                         Name:
//                       </Label>
//                       <Col sm={3}>
//                         <Input
//                           type="text"
//                           className="form-control"
//                           id="name"
//                           name="name"
//                           value={mainData.name}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </Col>
//                       <Label htmlFor="dob" className="form-label" sm={3}>
//                         Date Of Birth:
//                       </Label>
//                       <Col sm={3}>
//                         <Input
//                           type="date"
//                           className="form-control"
//                           id="dob"
//                           name="dob"
//                           value={mainData.dob?.split("T")[0]}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </Col>
//                     </FormGroup>
//                     <FormGroup row>
//                       <Label for="gender" sm={3}>
//                         Gender:
//                       </Label>
//                       <Col sm={3}>
//                         <Row>
//                           <Col sm={12} md={4}>
//                             <Label htmlFor="male">Male</Label>
//                             <Input
//                               type="radio"
//                               name="gender"
//                               value="0"
//                               id="male"
//                               checked={mainData.gender === 0}
//                               onChange={onOptionChange}
//                             />
//                           </Col>
//                           <Col sm={12} md={4}>
//                             <Label htmlFor="female">Female</Label>
//                             <Input
//                               type="radio"
//                               name="gender"
//                               value="1"
//                               id="female"
//                               checked={mainData.gender === 1}
//                               onChange={onOptionChange}
//                             />
//                           </Col>
//                           <Col sm={12} md={4}>
//                             <Label htmlFor="others">Others</Label>
//                             <Input
//                               type="radio"
//                               name="gender"
//                               value="2"
//                               id="others"
//                               checked={mainData.gender === 2}
//                               onChange={onOptionChange}
//                             />
//                           </Col>
//                         </Row>
//                       </Col>

//                       <Label htmlFor="email" className="form-label" sm={3}>
//                         E-mail:
//                       </Label>
//                       <Col sm={3}>
//                         <Input
//                           type="email"
//                           className="form-control"
//                           id="email"
//                           name="email"
//                           value={mainData.email}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </Col>
//                     </FormGroup>
//                     <FormGroup row>
//                       <Label
//                         htmlFor="phoneNumber"
//                         className="form-label"
//                         sm={3}
//                       >
//                         Phone Number:
//                       </Label>
//                       <Col sm={3}>
//                         <Input
//                           type="text"
//                           className="form-control"
//                           id="phoneNumber"
//                           name="phoneNumber"
//                           value={mainData.phoneNumber}
//                           onChange={handleInputChange}
//                           required
//                         />
//                         {!isValidTelNo && (
//                           <p style={{ color: "red" }}>
//                             Invalid phone number. Please enter a 10-digit
//                             number.
//                           </p>
//                         )}
//                       </Col>
//                       <Label htmlFor="address" className="form-label" sm={3}>
//                         Address:
//                       </Label>
//                       <Col sm={3}>
//                         <Input
//                           type="text"
//                           className="form-control"
//                           id="address"
//                           name="address"
//                           value={mainData.address}
//                           required
//                           onChange={handleInputChange}
//                         />
//                       </Col>
//                     </FormGroup>
//                     <FormGroup row>
//                       <Label
//                         htmlFor="nationality"
//                         className="form-label"
//                         sm={3}
//                       >
//                         Nationality:
//                       </Label>
//                       <Col sm={3}>
//                         <Input
//                           type="text"
//                           className="form-control"
//                           id="nationality"
//                           name="nationality"
//                           value={mainData.nationality}
//                           required
//                           onChange={handleInputChange}
//                         />
//                       </Col>
//                       <Label
//                         htmlFor="ledger_code"
//                         className="form-label"
//                         sm={3}
//                       >
//                         Ledger Code:
//                       </Label>
//                       <Col sm={3}>
//                         <Input
//                           type="string"
//                           className="form-control"
//                           id="ledger_code"
//                           name="ledger_code"
//                           required={mainData.id === "0"}
//                           value={mainData.ledger_code}
//                           onChange={handleInputChange}
//                         />
//                       </Col>
//                     </FormGroup>
//                     <div className="text-end">
//                       <Button type="submit" className="btn btn-primary">
//                         Save
//                       </Button>
//                     </div>
//                   </Form>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default EmployeeEditor;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
import EmployeeService from "../../../services/HRService/EmployeeService";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { isValidPhoneNumber } from "../Starter/PhonenumberValidation";
import * as Yup from "yup";

const EmployeeEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mainData, setMainData] = useState({
    id: "0",
    name: "",
    dob: "",
    gender: 0,
    email: "",
    phoneNumber: "",
    address: "",
    nationality: "",
    ledger_code: "",
  });

  const [errors, setErrors] = useState({});
  const isCreationMode = true;
  const [isValidTelNo, setIsValidTelNo] = useState(true);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please Enter Valid Name"),
    dob: Yup.string().required("Select Date of birth"),
    gender: Yup.string().required("Please Select Gender"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Please Enter Valid Email Address"),
    phoneNumber: Yup.string()
      .required("Please Enter Valid Phone number")
      .test(
        "is-valid-phone",
        "Invalid phone number. Please enter a 10-digit number.",
        (value) => isValidPhoneNumber(value)
      ),
    address: Yup.string().required("Please Enter Valid Address"),
    nationality: Yup.string().required("Please Enter Valid Nationality"),
    ledger_code: isCreationMode
      ? Yup.string().required("Please Enter Valid Ledger Code")
      : Yup.string(),
  });

  useEffect(() => {
    async function fetchDetail() {
      try {
        if (!id) {
          return;
        }
        const response = await EmployeeService.view(id);
        setMainData(response);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDetail();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMainData({
      ...mainData,
      [name]: value,
    });
  };

  const onOptionChange = (e) => {
    const { name, value } = e.target;
    setMainData({ ...mainData, [name]: parseInt(value) });
  };

  const handleBlur = () => {
    validationSchema
      .validate(mainData, { abortEarly: false })
      .then(() => setErrors({}))
      .catch((validationErrors) => {
        const newErrors = {};
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      });
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      if (mainData.phoneNumber && mainData.phoneNumber.match(/^[0-9]{10}$/)) {
        if (mainData.id > 0) {
          await EmployeeService.update(mainData.id, mainData);
          console.log("Data updated successfully", mainData);
        } else {
          await EmployeeService.create(mainData);
          console.log("Data after POST:", mainData);
        }
        toast.success("Employee Added Successfully", { autoClose: 3000 });
        navigate("/employee-list");
      } else {
        console.error("Please enter a valid 10-digit phone number");
      }
    } catch (error) {
      console.error("Error creating/updating:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Employee Form" pageTitle="Employee" />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form onSubmit={handleCreatePost}>
                    <FormGroup row className="mt-10 pt-10">
                      <Label htmlFor="name" className="form-label" sm={3}>
                        Name:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="text"
                          className={`form-control ${
                            errors.name && !errors.name.includes("string")
                              ? "is-invalid"
                              : ""
                          }`}
                          id="name"
                          name="name"
                          value={mainData.name}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </Col>

                      <Label htmlFor="dob" className="form-label" sm={3}>
                        Date Of Birth:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="date"
                          className={`form-control ${
                            errors.dob && !errors.dob.includes("string")
                              ? "is-invalid"
                              : ""
                          }`}
                          id="dob"
                          name="dob"
                          value={mainData.dob?.split("T")[0]}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                        />
                        {errors.dob && (
                          <div className="invalid-feedback">{errors.dob}</div>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="gender" sm={3}>
                        Gender:
                      </Label>
                      <Col sm={3}>
                        <Row>
                          <Col sm={12} md={4}>
                            <Label htmlFor="male">Male</Label>
                            <Input
                              className={`form-control ${
                                errors.gender &&
                                !errors.gender.includes("string")
                                  ? "is-invalid"
                                  : ""
                              }`}
                              type="radio"
                              name="gender"
                              value="0"
                              id="male"
                              checked={mainData.gender === 0}
                              onChange={onOptionChange}
                              onBlur={handleBlur}
                            />
                            {errors.gender && (
                              <div className="invalid-feedback">
                                {errors.gender}
                              </div>
                            )}
                          </Col>
                          <Col sm={12} md={4}>
                            <Label htmlFor="female">Female</Label>
                            <Input
                              className={`form-control ${
                                errors.gender &&
                                !errors.gender.includes("string")
                                  ? "is-invalid"
                                  : ""
                              }`}
                              type="radio"
                              name="gender"
                              value="1"
                              id="female"
                              checked={mainData.gender === 1}
                              onChange={onOptionChange}
                              onBlur={handleBlur}
                            />
                            {errors.gender && (
                              <div className="invalid-feedback">
                                {errors.gender}
                              </div>
                            )}
                          </Col>
                          <Col sm={12} md={4}>
                            <Label htmlFor="others">Others</Label>
                            <Input
                              className={`form-control ${
                                errors.gender &&
                                !errors.gender.includes("string")
                                  ? "is-invalid"
                                  : ""
                              }`}
                              type="radio"
                              name="gender"
                              value="2"
                              id="others"
                              checked={mainData.gender === 2}
                              onChange={onOptionChange}
                              onBlur={handleBlur}
                            />
                            {errors.gender && (
                              <div className="invalid-feedback">
                                {errors.gender}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Col>

                      <Label htmlFor="email" className="form-label" sm={3}>
                        E-mail:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="email"
                          className={`form-control ${
                            errors.email && !errors.email.includes("string")
                              ? "is-invalid"
                              : ""
                          }`}
                          id="email"
                          name="email"
                          value={mainData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        htmlFor="phoneNumber"
                        className="form-label"
                        sm={3}
                      >
                        Phone Number:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="number"
                          className={`form-control ${
                            errors.phoneNumber &&
                            !errors.phoneNumber.includes("string")
                              ? "is-invalid"
                              : ""
                          }`}
                          id="phoneNumber"
                          name="phoneNumber"
                          value={mainData.phoneNumber}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required
                        />
                        {!isValidTelNo && (
                          <p style={{ color: "red" }}>
                            Invalid phone number. Please enter a 10-digit
                            number.
                          </p>
                        )}
                        {errors.phoneNumber && (
                          <div className="invalid-feedback">
                            {errors.phoneNumber}
                          </div>
                        )}
                      </Col>

                      <Label htmlFor="address" className="form-label" sm={3}>
                        Address:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="text"
                          className={`form-control ${
                            errors.address && !errors.address.includes("string")
                              ? "is-invalid"
                              : ""
                          }`}
                          id="address"
                          name="address"
                          value={mainData.address}
                          onBlur={handleBlur}
                          required
                          onChange={handleInputChange}
                        />
                        {errors.address && (
                          <div className="invalid-feedback">
                            {errors.address}
                          </div>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        htmlFor="nationality"
                        className="form-label"
                        sm={3}
                      >
                        Nationality:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="text"
                          className={`form-control ${
                            errors.nationality &&
                            !errors.nationality.includes("string")
                              ? "is-invalid"
                              : ""
                          }`}
                          id="nationality"
                          name="nationality"
                          value={mainData.nationality}
                          required
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                        />
                        {errors.nationality && (
                          <div className="invalid-feedback">
                            {errors.nationality}
                          </div>
                        )}
                      </Col>

                      <Label
                        htmlFor="ledger_code"
                        className="form-label"
                        sm={3}
                      >
                        Ledger Code:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="string"
                          className={`form-control ${
                            errors.ledger_code &&
                            !errors.ledger_code.includes("string")
                              ? "is-invalid"
                              : ""
                          }`}
                          id="ledger_code"
                          name="ledger_code"
                          required={mainData.id === "0"}
                          value={mainData.ledger_code}
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                        />
                        {isCreationMode && errors.ledger_code && (
                          <div className="invalid-feedback">
                            {errors.ledger_code}
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

export default EmployeeEditor;
