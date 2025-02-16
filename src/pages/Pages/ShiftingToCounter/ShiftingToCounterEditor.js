import React, { useState, useEffect } from "react";

import {
  Button,
  ButtonGroup,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Table,
} from "reactstrap";
import * as Yup from "yup";
import DatePicker from "react-flatpickr";

//Import Flatepicker

import { useNavigate, useParams } from "react-router-dom";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import EmployeeService from "../../../services/HRService/EmployeeService";
import ShiftingToCounterService from "../../../services/HRService/ShiftingToCounterService";

const ShiftingToCounterEditor = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const idValue = id || 0;
  //console.log("Normal Catch", id, idValue);
  // State for the main data
  const [shiftingEditPageData, setShiftingEditPageData] = useState({
    editRecordID: idValue,
    isInEditMode: !!id,
    isChildRecordInEditMode: false,
    activeChildRecord: {
      key: "k_0",
      id: 0,
      employeeID: 0,
      ref_No: "",
      quantity: "",
      remarks: "",
    },
    // Yo greater than 1 vayexi yeskoindex change hunxa ra editMode on hunxa
    editChildRecordArrayIndex: 0,
    advanceSummary: {
      id: idValue,
      transaction_Date: "",
      remarks: "",
      vmShiftingDetails: [],
    },
  });
  const [Employee, setEmployee] = useState([]);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const defaultDate = "2023-01-01"; // Example default date
  if (isNaN(Date.parse(shiftingEditPageData.advanceSummary.transaction_Date))) {
    shiftingEditPageData.advanceSummary.transaction_Date = defaultDate;
  }
  const validationSchema = Yup.object().shape({
    transaction_Date: Yup.date().nullable().required("Please Select Date"),

    remarks: Yup.string().required("Remarks is required"),
  });
  const validateData = async () => {
    try {
      await validationSchema.validate(shiftingEditPageData.advanceSummary, {
        abortEarly: false,
      });
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
        console.error(
          "Validation errors not found or in unexpected format:",
          validationErrors
        );
      }
      return false;
    }
  };

  const [modalErrors, setModalErrors] = useState({});

  const validateModalData = () => {
    const newModalErrors = {};
    const { activeChildRecord } = shiftingEditPageData;

    // Validate individual fields within the modal
    if (!activeChildRecord.employeeID) {
      newModalErrors.employeeID = " Please Select Employeename";
    }

    if (!activeChildRecord.ref_No) {
      newModalErrors.ref_No = "Reference is required";
    }

    if (!activeChildRecord.quantity) {
      newModalErrors.quantity = "Quantity is required";
    } else if (isNaN(activeChildRecord.quantity)) {
      newModalErrors.quantity = "Quantity must be a number";
    } else if (activeChildRecord.quantity <= 0) {
      newModalErrors.quantity = "Quantity must be greater than 0";
    } else if (activeChildRecord.quantity > 1000) {
      newModalErrors.quantity = "Quantity must be less than or equal to 1000";
    }

    if (!activeChildRecord.remarks) {
      newModalErrors.remarks = "Remarks is required";
    } else if (activeChildRecord.remarks.length < 5) {
      newModalErrors.remarks =
        "Description should be at least 5 characters long";
    }

    // Implement validations for other fields within the modal
    setModalErrors(newModalErrors);

    // Return true if no errors found, false otherwise
    return Object.keys(newModalErrors).length === 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const relatedData = await EmployeeService.getList();
        //console.log("Fetched Posts:", relatedData); // Debugging line
        setEmployee(relatedData);
        if (shiftingEditPageData.isInEditMode) {
          await getRelatedDataFromAPI();
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [shiftingEditPageData.isInEditMode, shiftingEditPageData.editRecordID]);

  async function getRelatedDataFromAPI() {
    try {
      //console.log(advanceEditPageData.editRecordID, ' id values is null');
      if (shiftingEditPageData.editRecordID <= 0) {
        return;
      }

      const apiResponse = await ShiftingToCounterService.view(
        shiftingEditPageData.editRecordID
      );
      //console.log("Response from Server: ", apiResponse);

      apiResponse.vmShiftingDetails = apiResponse.vmShiftingDetail;
      // Map through vmProductionDetails to add totalAmount property
      const updatedApiResponse = {
        ...apiResponse,
        vmShiftingDetails: apiResponse.vmShiftingDetails.map((detail) => ({
          ...detail,
          key: "o_" + detail.id,
        })),
      };

      //console.log('updated response:', updatedApiResponse);

      setShiftingEditPageData((prevData) => ({
        ...prevData,
        advanceSummary: updatedApiResponse, // Update the property with the new value
      }));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }
  useEffect(() => {
    //console.log("Page Data:", advanceEditPageData);
    if (shiftingEditPageData.editRecordID > 0) {
      //call api and get data
      getRelatedDataFromAPI(shiftingEditPageData.editRecordID);
    } else {
      //set default blank form... which is already done
    }
  }, []);

  const handleEmployeeChange = (event) => {
    // Get the selected option element
    const selectedOption = event.target.options[event.target.selectedIndex];

    // Get the text value of the selected option (displayed name)
    const selectedText = selectedOption.text;

    // Get the value (ID) of the selected option
    const selectedValue = event.target.value;

    // Update the state with the selected text and value
    setShiftingEditPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        employeeID: selectedValue,
        employeeName: selectedText,
      }, // Update the property with the new value
    }));
    console.log("Selected obj:", shiftingEditPageData.activeChildRecord);

    // You can now use selectedText and selectedValue as needed
    console.log("Selected Text:", selectedText);
    console.log("Selected Value (ID):", selectedValue);
  };

  const handleSummaryFieldChanges = (event) => {
    console.log(event);
    const { name, value } = event.target;
    console.log("setting hanle change data: ", name, value);
    setShiftingEditPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        [name]: value,
      },
    }));
  };

  const handleTxnDetailShiftingToDockChange = (event, index) => {
    const { name, value } = event.target;
    console.log("before handle detail change ", shiftingEditPageData);
    console.log("name : ", name, "/ value: ", value);

    setShiftingEditPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        [name]: value,
      }, // Update the property with the new value
    }));

    //console.log('after handle detail change ', advanceEditPageData);
  };

  const handleEditTableInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedSaleItems = [
      ...shiftingEditPageData.advanceSummary.vmShiftingDetails,
    ];

    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      [name]: value,
    };

    setShiftingEditPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        vmShiftingDetails: updatedSaleItems,
      },
    }));
  };

  const handleTableDetailIncrease = async (event) => {
    setModalOpen(true);
    //   setShiftingEditPageData((prevMasterData) => ({
    //     ...prevMasterData,
    //     advanceSummary: {
    //       ...prevMasterData.advanceSummary,
    //       vmShiftingDetails: [
    //         ...prevMasterData.advanceSummary.vmShiftingDetails,
    //         prevMasterData.activeChildRecord,
    //       ],
    //     },
    //   }));

    //   setShiftingEditPageData((prevMasterData) => ({
    //     ...prevMasterData,
    //     isChildRecordInEditMode: false,
    //     editChildRecordArrayIndex: 0,
    //     activeChildRecord: {
    //       key: "k_" + -1 * prevMasterData.advanceSummary.vmShiftingDetails.length,
    //       id: 0,
    //       employeeID: 0,
    //       desc: "",
    //       ref_No: "",
    //       ref_No: "",
    //       remarks: "",
    //     },
    //   }));
    //   console.log('after detail band data: ', advanceEditPageData);
    // };
  };

  const handleSaveSale = () => {
    // Validate modal data
    const isModalDataValid = validateModalData();

    if (!isModalDataValid) {
      // If data within the modal is invalid, prevent further execution
      return;
    }

    const newItem = { ...shiftingEditPageData.activeChildRecord };

    setShiftingEditPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmShiftingDetails: [
          ...prevMasterData.advanceSummary.vmShiftingDetails,
          newItem,
        ],
      },
    }));

    // Reset the activeChildRecord to clear the input fields
    setShiftingEditPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        key: `k_${prevData.advanceSummary.vmShiftingDetails.length}`, // Adjust the key value as needed
        id: 0,
        employeeID: 0,

        ref_No: "",
        quantity: "",
        remarks: "",
      },
    }));

    setModalOpen(false); // Close the modal here or adjust the logic as needed
  };

  const handleRemoveShiftingRecord = (index) => {
    const updatedTransactionDetails = [
      ...shiftingEditPageData.advanceSummary.vmShiftingDetails,
    ];
    updatedTransactionDetails.splice(index, 1);
    //setMainData({ ...mainData, vmTransactionDetails: updatedEmployeeDetails });
    // Add the activeRecord data to vmProductionDetails array
    setShiftingEditPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmShiftingDetails: updatedTransactionDetails,
      },
    }));
    //console.log('after remove  change ', mainData);
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    const isValid = await validateData();

    if (!isValid) {
      return; // If either main data is invalid or child data is invalid, stop further execution
    }
    try {
      var activeChild = shiftingEditPageData.activeChildRecord;
      if (
        activeChild.employeeID > 0 &&
        activeChild.ref_No.length > 0 &&
        activeChild.quantity.length > 0
      ) {
        shiftingEditPageData.advanceSummary.vmShiftingDetails.push(activeChild);
      }
      if (
        shiftingEditPageData.isInEditMode &&
        shiftingEditPageData.editRecordID > 0
      ) {
        // update a new item
        await ShiftingToCounterService.update(
          shiftingEditPageData.editRecordID,
          shiftingEditPageData.advanceSummary
        );
        //console.log("Data updated successfully:", shiftingEditPageData);
        //console.log("Data updated successfully:", shiftingEditPageData);
        navigate("/shiftingtocounter-list");
      } else {
        // create an existing item
        //console.log("Data after POST:", advanceEditPageData.advanceSummary);
        await ShiftingToCounterService.create(
          shiftingEditPageData.advanceSummary
        );
        navigate("/shiftingtocounter-list");
      }
    } catch (error) {
      console.error("Error creating/posting:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb
          title="Shifting-To-Counter Form"
          pageTitle="Shifting-To-Counter"
        />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form onSubmit={handleCreatePost}>
                    <FormGroup row>
                      <Label
                        htmlFor="transaction_Date"
                        className="form-label"
                        sm={3}
                      >
                        Transaction_Date
                      </Label>
                      <Col sm={3}>
                        <DatePicker
                          type="date"
                          id="transaction_Date"
                          name="transaction_Date"
                          onBlur={validateData}
                          value={
                            shiftingEditPageData.advanceSummary.transaction_Date?.split(
                              "T"
                            )[0]
                          }
                          onChange={(date) =>
                            setShiftingEditPageData({
                              ...shiftingEditPageData,
                              transaction_Date: date[0],
                            })
                          }
                          className={`form-control ${
                            errors.transaction_Date ? "is-invalid" : "is-valid"
                          }`}
                        />
                        {errors.transaction_Date && (
                          <div className="invalid-feedback">
                            {errors.transaction_Date}
                          </div>
                        )}
                      </Col>
                      <Label htmlFor="remarks" className="form-label" sm={3}>
                        Remarks
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="string"
                          id="remarks"
                          onBlur={validateData}
                          name="remarks"
                          className={`form-control ${
                            errors.remarks ? "is-invalid" : "is-valid"
                          }`}
                          value={shiftingEditPageData.advanceSummary.remarks}
                          onChange={handleSummaryFieldChanges}
                        />
                        {errors.remarks && (
                          <div className="invalid-feedback">
                            {errors.remarks}
                          </div>
                        )}
                      </Col>
                    </FormGroup>

                    <Table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Ref_No</th>
                          <th>Quantity</th>
                          <th>Description</th>
                          <th>
                            <Button
                              size="sm"
                              type="Button"
                              className="btn btn-soft-success"
                              onClick={handleTableDetailIncrease}
                            >
                              +
                            </Button>
                          </th>
                        </tr>
                      </thead>
                      <Modal
                        isOpen={modalOpen}
                        toggle={() => setModalOpen(!modalOpen)}
                      >
                        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
                          Add New Item
                        </ModalHeader>
                        <ModalBody>
                          <Row>
                            <Label>Employee</Label>
                            <Col>
                              <select
                                className={`form-control ${
                                  modalErrors.employeeID
                                    ? "is-invalid"
                                    : "is-valid"
                                }`}
                                name="employeeID"
                                onBlur={validateModalData}
                                value={
                                  shiftingEditPageData.activeChildRecord
                                    .employeeID
                                }
                                onChange={(e) => handleEmployeeChange(e)}
                              >
                                <option value="">Select Employee</option>
                                {Employee.map((item) => (
                                  <option
                                    key={item.id}
                                    value={item.id}
                                    // selected={employeeDetail.employeeID === item.id ? "selected":"" }
                                  >
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                              {modalErrors.employeeID && (
                                <div className="invalid-feedback">
                                  {modalErrors.employeeID}
                                </div>
                              )}
                            </Col>
                          </Row>
                          <Row>
                            <Label>Reference Number</Label>
                            <Col>
                              <Input
                                type="string"
                                className={`form-control ${
                                  modalErrors.ref_No ? "is-invalid" : "is-valid"
                                }`}
                                onBlur={validateModalData}
                                name="ref_No"
                                value={
                                  shiftingEditPageData.activeChildRecord.ref_No
                                }
                                onChange={(e) =>
                                  handleTxnDetailShiftingToDockChange(e)
                                }
                              />
                              {modalErrors.ref_No && (
                                <div className="invalid-feedback">
                                  {modalErrors.ref_No}
                                </div>
                              )}{" "}
                            </Col>
                          </Row>
                          <Row>
                            <Label>Quantity</Label>
                            <Col>
                              <Input
                                type="string"
                                name="quantity"
                                className={`form-control ${
                                  modalErrors.quantity
                                    ? "is-invalid"
                                    : "is-valid"
                                }`}
                                onBlur={validateModalData}
                                value={
                                  shiftingEditPageData.activeChildRecord
                                    .quantity
                                }
                                onChange={(e) =>
                                  handleTxnDetailShiftingToDockChange(e)
                                }
                              />
                              {modalErrors.quantity && (
                                <div className="invalid-feedback">
                                  {modalErrors.quantity}
                                </div>
                              )}
                            </Col>
                          </Row>
                          <Row>
                            <Label>Description</Label>
                            <Col>
                              <Input
                                type="string"
                                className={`form-control ${
                                  modalErrors.remarks
                                    ? "is-invalid"
                                    : "is-valid"
                                }`}
                                name="remarks"
                                onBlur={validateModalData}
                                value={
                                  shiftingEditPageData.activeChildRecord.remarks
                                }
                                onChange={(e) =>
                                  handleTxnDetailShiftingToDockChange(e)
                                }
                              />
                              {modalErrors.remarks && (
                                <div className="invalid-feedback">
                                  {modalErrors.remarks}
                                </div>
                              )}
                            </Col>
                          </Row>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={handleSaveSale}>
                            Add
                          </Button>{" "}
                          <Button
                            color="secondary"
                            onClick={() => setModalOpen(!modalOpen)}
                          >
                            Cancel
                          </Button>
                        </ModalFooter>
                      </Modal>
                      {shiftingEditPageData.advanceSummary &&
                      Array.isArray(
                        shiftingEditPageData.advanceSummary.vmShiftingDetails
                      ) ? (
                        shiftingEditPageData.advanceSummary.vmShiftingDetails.map(
                          (item, index) => (
                            <tr key={item.key}>
                              <td>
                                <select
                                  type="string"
                                  name="employeeID"
                                  value={item.employeeID}
                                  onChange={(e) =>
                                    handleEditTableInputChange(e, index)
                                  }
                                  className={`form-control ${
                                    errors.employeeID
                                      ? "is-invalid"
                                      : "is-valid"
                                  }`}
                                  onBlur={validateData}
                                >
                                  <option value="">Select employeeID</option>
                                  {Employee.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                                {errors.employeeID && (
                                  <div className="invalid-feedback">
                                    {errors.employeeID}
                                  </div>
                                )}
                              </td>
                              <td>
                                <Input
                                  type="string"
                                  name="ref_No"
                                  className={`form-control ${
                                    errors.ref_No ? "is-invalid" : "is-valid"
                                  }`}
                                  onBlur={validateData}
                                  value={item.ref_No}
                                  onChange={(e) =>
                                    handleEditTableInputChange(e, index)
                                  }
                                />
                                {errors.ref_No && (
                                  <div className="invalid-feedback">
                                    {errors.ref_No}
                                  </div>
                                )}
                              </td>
                              <td>
                                <Input
                                  type="string"
                                  name="quantity"
                                  className={`form-control ${
                                    errors.quantity ? "is-invalid" : "is-valid"
                                  }`}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleEditTableInputChange(e, index)
                                  }
                                />
                                {errors.quantity && (
                                  <div className="invalid-feedback">
                                    {errors.quantity}
                                  </div>
                                )}
                              </td>
                              <td>
                                <Input
                                  type="string"
                                  name="remarks"
                                  className={`form-control ${
                                    errors.remarks ? "is-invalid" : "is-valid"
                                  }`}
                                  value={item.remarks}
                                  onChange={(e) =>
                                    handleEditTableInputChange(e, index)
                                  }
                                />
                                {errors.remarks && (
                                  <div className="invalid-feedback">
                                    {errors.remarks}
                                  </div>
                                )}
                              </td>
                              <td>
                                <ButtonGroup size="sm">
                                  <Button
                                    size="sm"
                                    type="Button"
                                    className="btn btn-soft-danger"
                                    onClick={() =>
                                      handleRemoveShiftingRecord(index)
                                    }
                                    disabled={
                                      shiftingEditPageData.isChildRecordInEditMode
                                    }
                                  >
                                    <i className="ri-delete-bin-5-fill"></i>
                                  </Button>
                                </ButtonGroup>
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td colSpan="6"> No shifting details</td>
                        </tr>
                      )}
                    </Table>

                    <FormGroup row>
                      <div className="text-end">
                        <Button type="submit" className="btn btn-primary">
                          Save
                        </Button>
                      </div>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {/* </LayoutWithBreadCrumb> */}
    </React.Fragment>
  );
};

export default ShiftingToCounterEditor;
