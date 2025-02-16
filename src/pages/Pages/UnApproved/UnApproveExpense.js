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
// import LayoutForCRUDListingPage from "../Starter/LayoutForCRUDListingPage";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import JournaUnApproveService from "../../../services/AccountingServices/JournalUnApproveService";

// const ExpenseUnApprove = (props) => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   console.log(id);

//   const [mainData, setMainData] = useState({
//     id: id,
//     remarks: "",
//   });

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setMainData({
//       ...mainData,
//       [name]: value,
//     });
//   };

//   const handleSave = async () => {
//     try {
//       // Use the values from the state to update the system
//       const updatedData = {
//         id: mainData.id,

//         remarks: mainData.remarks,
//       };

//       await JournaUnApproveService.updateExpensesUnApprove(
//         updatedData.id,
//         updatedData
//       );
//       console.log("Done", updatedData);
//       navigate("/unapproved");
//     } catch (error) {
//       console.error("Error creating/updating:", error);
//     }
//   };

//   return (
//     <div className="page-content">
//       <BreadCrumb title="UnApprove Form" pageTitle="UnApprove" />
//       <Row>
//         <Col lg={12}>
//           <Card>
//             <CardBody>
//               <Form>
//                 <FormGroup row>
//                   <Label htmlFor="remarks" className="form-label" sm={3}>
//                     Remarks
//                   </Label>
//                   <Col sm={3}>
//                     <Input
//                       type="string"
//                       className="form-control"
//                       id="remarks"
//                       name="remarks"
//                       value={mainData.remarks}
//                       onChange={handleInputChange}
//                     />
//                   </Col>
//                   <Col sm={2}>
//                     <div className="text-end">
//                       <Button onClick={handleSave} className="btn btn-primary">
//                         UnApprove
//                       </Button>
//                     </div>
//                   </Col>
//                 </FormGroup>
//               </Form>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default ExpenseUnApprove;
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  ButtonGroup,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, addUsers } from "../../../slices/thunks";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import JournaUnApproveService from "../../../services/AccountingServices/JournalUnApproveService";
import { useNavigate, useParams } from "react-router-dom";

import JournalApproveService from "../../../services/AccountingServices/JournalApproveService";
import UnApprovedVoucherListService from "../../../services/AccountingServices/UnApprovedVoucherList";

const ExpenseUnApprove = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState("initialValue");

  const [newUserData, setNewUserData] = useState({
    remarks: "",
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setNewUserData({
      remarks: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUserData({
      ...newUserData,
      [name]: value,
    });
  };

  const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks is required"),
  });

  const [voucherLog, setVoucherLog] = useState([]);

  // Define the fetchDetails function within the component
  const fetchDetails = async (id) => {
    try {
      const response = await UnApprovedVoucherListService.getVoucherLog(id);
      console.log(response);
      setVoucherLog(response); // Assuming this is how you get the data
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  // Function to handle submitting the form
  const handleSubmit = async (values) => {
    try {
      let updateFunction;
      let destinationRoute;

      switch (actionType) {
        case "approve":
          updateFunction = JournalApproveService.updateExpensesApprove; // Replace with your actual approve API function
          destinationRoute = "/approved";
          break;
        case "reject":
          updateFunction = JournalApproveService.updateExpensesReject; // Replace with your actual approve API function
          destinationRoute = "/unapproved";
          break;
        case "unapprove":
          updateFunction = JournaUnApproveService.updateExpensesUnApprove; // or unapproveApiFunction, based on your requirement
          destinationRoute = "/unapproved";
          break;
        default:
          return;
      }

      await updateFunction(id, values);
      console.log("Done", values);
      navigate(destinationRoute);
      toggleModal();
    } catch (error) {
      console.error("Error creating/updating:", error);
    }
  };

  useEffect(() => {
    // Fetch users when the component mounts
    fetchDetails(id);
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <React.Fragment>
      <Col lg={12}>
        <CardHeader>
          <Row>
            <ButtonGroup>
              <Col lg={6}></Col>
              <div className="d-flex gap-0">
                <Button
                  className="btn btn-outline-primary btn-md gap-1"
                  color="btn btn-soft-success"
                  onClick={() => {
                    setActionType("approve");
                    toggleModal();
                  }}
                >
                  Approve <i className="ri-task-fill " />
                </Button>

                <Button
                  className="btn btn-outline-primary btn-md gap-1"
                  color="btn btn-soft-warning"
                  onClick={() => {
                    setActionType("unapprove");
                    toggleModal();
                  }}
                >
                  UnApprove <i className="ri-file-edit-line " />
                </Button>
                <Button
                  className="btn btn-outline-primary btn-md gap-1"
                  color="btn btn-soft-danger"
                  onClick={() => {
                    setActionType("reject");
                    toggleModal();
                  }}
                >
                  Reject <i className="ri-delete-back-2-fill" />
                </Button>
                <Button
                  className="btn btn-outline-primary btn-md"
                  color="btn btn-soft-primary"
                  onClick={() => {
                    fetchDetails(id);
                    setActionType("getVoucherLog");

                    toggleModal();
                  }}
                >
                  Voucher Log
                  <i className="ri-file-copy-2-fill" />
                </Button>
              </div>
            </ButtonGroup>
          </Row>
        </CardHeader>

        {/* Add User Modal */}
        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalBody>
            {/* Form for adding a new user */}
            {actionType !== "getVoucherLog" ? (
              <Formik
                initialValues={newUserData}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {(formik) => (
                  <Form>
                    <FormGroup>
                      <Label for="remarks">Remarks</Label>
                      <Field
                        type="text"
                        name="remarks"
                        id="remarks"
                        placeholder="Enter remarks"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleInputChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.remarks && formik.errors.remarks
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="remarks"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                    <ModalFooter>
                      <Button color="light" onClick={toggleModal}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit">
                        Submit
                      </Button>
                    </ModalFooter>
                  </Form>
                )}
              </Formik>
            ) : (
              <table className="table table-bordered table-stripped">
                <thead>
                  <tr>
                    <th className="table-primary">SN</th>
                    <th className="table-primary">Voucher</th>
                    <th className="table-primary">Status</th>
                    <th className="table-primary">Date</th>
                    <th className="table-primary">Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {voucherLog.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.voucherId}</td>
                      <td>{item.status}</td>
                      <td>{item._createdDate}</td>
                      <td>{item.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <ModalFooter>
                    <Button color="light" onClick={toggleModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </tfoot>
              </table>
            )}
          </ModalBody>
        </Modal>
      </Col>
    </React.Fragment>
  );
};

export default ExpenseUnApprove;
