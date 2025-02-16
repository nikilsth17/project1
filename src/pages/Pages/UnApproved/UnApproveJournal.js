// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Card,
//   CardBody,
//   CardHeader,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   Button,
//   FormGroup,
//   Label,
//   Input,
//   Row,
//   Col,
// } from "reactstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { getUsers, addUsers } from "../../../slices/thunks";
// import * as Yup from "yup";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import JournaUnApproveService from "../../../services/AccountingServices/JournalUnApproveService";
// import { useNavigate, useParams } from "react-router-dom";
// import JournalVouchersDisplay from "../JournalVouchers/JournalVoucherDisplay";

// const JournalUnApprove = () => {
//   document.title = "Ants Quality - User Management";

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const users = useSelector((state) => state.users);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newUserData, setNewUserData] = useState({
//     remarks: "",
//   });

//   const toggleModal = () => {
//     setIsModalOpen(!isModalOpen);
//     setNewUserData({
//       remarks: "",
//     });
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setNewUserData({
//       ...newUserData,
//       [name]: value,
//     });
//   };

//   const validationSchema = Yup.object().shape({
//     remarks: Yup.string().required("Remarks is required"),
//   });

//   // Function to handle submitting the form
//   const handleSubmit = async (values) => {
//     try {
//       // Use the values from the state to update the system
//       await JournaUnApproveService.updateJournalUnApprove(id, values);
//       console.log("Done", values);
//       navigate("/unapproved");
//       toggleModal();
//     } catch (error) {
//       console.error("Error creating/updating:", error);
//     }
//   };
//   const handleSave = async () => {
//     try {
//       // Use the values from the state to update the system
//       const updatedData = {
//         id: mainData.id,

//         remarks: mainData.remarks,
//       };

//       await JournalApproveService.updateJournalApprove(
//         updatedData.id,
//         updatedData
//       );
//       console.log("Done", updatedData);
//       navigate("/approved");
//     } catch (error) {
//       console.error("Error creating/updating:", error);
//     }
//   };
//   const handleReject = async () => {
//     try {
//       // Use the values from the state to update the system
//       const updatedData = {
//         id: mainData.id,

//         remarks: mainData.remarks,
//       };

//       await JournalApproveService.updateJournalReject(
//         updatedData.id,
//         updatedData
//       );
//       console.log("Done", updatedData);
//       navigate("/unapproved");
//     } catch (error) {
//       console.error("Error creating/updating:", error);
//     }
//   };

//   useEffect(() => {
//     // Fetch users when the component mounts
//     dispatch(getUsers());
//   }, [dispatch]);

//   return (
//     <React.Fragment>
//       {/* <div className="page-content"> */}
//       {/* <BreadCrumb title="UnApprove Journal" pageTitle="Journal" /> */}
//       <Col lg={12}>
//         {/* <Card> */}
//         <CardHeader>
//           <Row>
//             <Col lg={7}></Col>
//             <Col lg={1}>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h5 className="card-title mb-0"></h5>
//                 <div
//                   className="btn btn-outline-primary gap-4"
//                   onClick={toggleModal}
//                 >
//                   Approve
//                 </div>
//               </div>
//             </Col>
//             <Col lg={2}>
//               <div className="d-flex justify-content-between align-items-center mb-3 ms-0">
//                 <h5 className="card-title mb-0"></h5>
//                 <div
//                   className="btn btn-outline-primary gap-4"
//                   onClick={toggleModal}
//                 >
//                   Reject
//                 </div>
//               </div>
//             </Col>
//             <Col lg={2}>
//               <div className="d-flex justify-content-between align-items-center mb-3 ms-0">
//                 <h5 className="card-title mb-0"></h5>
//                 <div
//                   className="btn btn-outline-primary gap-4"
//                   onClick={toggleModal}
//                 >
//                   UnApprove
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </CardHeader>
//         <CardBody></CardBody>
//         {/* </Card> */}
//       </Col>
//       {/* </div> */}

//       {/* Add User Modal */}
//       <Modal isOpen={isModalOpen} toggle={toggleModal}>
//         <ModalBody>
//           {/* Form for adding a new user */}
//           <Formik
//             initialValues={newUserData}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {(formik) => (
//               <Form>
//                 <FormGroup>
//                   <Label for="remarks">Remarks</Label>
//                   <Field
//                     type="text"
//                     name="remarks"
//                     id="remarks"
//                     placeholder="Enter remarks"
//                     onChange={(e) => {
//                       formik.handleChange(e);
//                       handleInputChange(e);
//                     }}
//                     onBlur={formik.handleBlur}
//                     className={`form-control ${
//                       formik.touched.remarks && formik.errors.remarks
//                         ? "is-invalid"
//                         : ""
//                     }`}
//                   />
//                   <ErrorMessage
//                     name="remarks"
//                     component="div"
//                     className="invalid-feedback"
//                   />
//                 </FormGroup>
//                 <ModalFooter>
//                   <Button color="light" onClick={toggleModal}>
//                     Cancel
//                   </Button>
//                   <Button color="primary" type="submit">
//                     Submit
//                   </Button>
//                 </ModalFooter>
//               </Form>
//             )}
//           </Formik>
//         </ModalBody>
//       </Modal>
//     </React.Fragment>
//   );
// };

// export default JournalUnApprove;

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
import JournalVouchersDisplay from "../JournalVouchers/JournalVoucherDisplay";
import JournalApproveService from "../../../services/AccountingServices/JournalApproveService";
import UnApprovedVoucherListService from "../../../services/AccountingServices/UnApprovedVoucherList";

const JournalUnApprove = () => {
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
          updateFunction = JournalApproveService.updateJournalApprove; // Replace with your actual approve API function
          destinationRoute = "/approved";
          break;
        case "reject":
          updateFunction = JournalApproveService.updateJournalReject; // Replace with your actual approve API function
          destinationRoute = "/unapproved";
          break;
        case "unapprove":
          updateFunction = JournaUnApproveService.updateJournalUnApprove; // or unapproveApiFunction, based on your requirement
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
        {/* <CardHeader>
          <Row>
            <Col lg={7}></Col>
            <Col lg={2}>
              <h5 className="card-title mb-0"></h5>
              <div
                type="button"
                className="btn btn-outline-primary btn-md"
                onClick={() => {
                  setActionType("approve");
                  toggleModal();
                }}
              >
                Voucher Log
              </div>
            </Col>
            <Col lg={6}>
              <div style={{ paddingLeft: "475px" }}>
                <h5 className="card-title mb-0"></h5>
                <div
                  className="btn btn-outline-success"
                  onClick={() => {
                    setActionType("approve");
                    toggleModal();
                  }}
                >
                  Approve
                </div>
              </div>
            </Col>
            <Col lg={1}>
              <div style={{ paddingLeft: "105px" }}>
                <h5 className="card-title mb-0"></h5>
                <div
                  className="btn btn-outline-warning"
                  onClick={() => {
                    setActionType("unapprove");
                    toggleModal();
                  }}
                >
                  UnApprove
                </div>
              </div>
            </Col>
            <Col lg={1}>
              <div style={{ paddingLeft: "140px" }}>
                <h5 className="card-title mb-0"></h5>
                <div
                  className="btn btn-outline-danger"
                  onClick={() => {
                    setActionType("reject");
                    toggleModal();
                  }}
                >
                  Reject
                </div>
              </div>
            </Col>
          </Row>
        </CardHeader> */}
        <CardHeader>
          <Row>
            <ButtonGroup>
              <Col lg={6}></Col>
              <div className="d-flex gap-0">
                <Button
                  className="btn btn-outline-primary btn-md gap-1"
                  color="btn btn-soft-success"
                  title="Approve"
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

                    {/* <th>Status</th>
                <th>UpdatedName</th> */}
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

export default JournalUnApprove;
