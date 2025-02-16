import React, { useState, useEffect } from "react";

import {
  Button,
  ButtonGroup,
  ButtonToggle,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Card,
  CardBody,
} from "reactstrap";

//Import Flatepicker
import Flatpickr from "react-flatpickr";

import { useNavigate, useParams } from "react-router-dom";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import EmployeeService from "../../../services/HRService/EmployeeService";
import PayrollService from "../../../services/HRService/PayrollService";

const PayrollEditor = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const idValue = id || 0;
  //console.log("Normal Catch", id, idValue);
  // State for the main data
  const [payrollEditPageData, setPayrollEditPageData] = useState({
    editRecordID: idValue,
    isInEditMode: !!id,
    isChildRecordInEditMode: false,
    activeChildRecord: {
      key: "k_0",
      id: 0,
      employeeID: "",
      desc: "",
      paid_Amt: "",
      ref_No: "",
      remarks: "",
    },
    // Yo greater than 1 vayexi yeskoindex change hunxa ra editMode on hunxa
    editChildRecordArrayIndex: 0,
    advanceSummary: {
      id: idValue,
      transaction_Date: "",
      remarks: "",
      vmPayrollDetails: [],
    },
  });
  const [Employee, setEmployee] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const relatedData = await EmployeeService.getList();
        //console.log("Fetched Posts:", relatedData); // Debugging line
        setEmployee(relatedData);
        if (payrollEditPageData.isInEditMode) {
          await getRelatedDataFromAPI();
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [payrollEditPageData.isInEditMode, payrollEditPageData.editRecordID]);

  async function getRelatedDataFromAPI() {
    try {
      //console.log(advanceEditPageData.editRecordID, ' id values is null');
      if (payrollEditPageData.editRecordID <= 0) {
        return;
      }

      const apiResponse = await PayrollService.view(
        payrollEditPageData.editRecordID
      );
      //console.log("Response from Server: ", apiResponse);

      apiResponse.vmPayrollDetails = apiResponse.vmPayrollDetail;
      // Map through vmProductionDetails to add totalAmount property
      const updatedApiResponse = {
        ...apiResponse,
        vmPayrollDetails: apiResponse.vmPayrollDetails.map((detail) => ({
          ...detail,
          key: "o_" + detail.id,
        })),
      };

      //console.log('updated response:', updatedApiResponse);

      setPayrollEditPageData((prevData) => ({
        ...prevData,
        advanceSummary: updatedApiResponse, // Update the property with the new value
      }));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }
  useEffect(() => {
    //console.log("Page Data:", advanceEditPageData);
    if (payrollEditPageData.editRecordID > 0) {
      //call api and get data
      getRelatedDataFromAPI(payrollEditPageData.editRecordID);
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
    setPayrollEditPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        employeeID: selectedValue,
        employeeName: selectedText,
      }, // Update the property with the new value
    }));
    console.log("Selected obj:", payrollEditPageData.activeChildRecord);

    // You can now use selectedText and selectedValue as needed
    console.log("Selected Text:", selectedText);
    console.log("Selected Value (ID):", selectedValue);
  };

  const handleSummaryFieldChanges = (event) => {
    console.log(event);
    const { name, value } = event.target;
    console.log("setting hanle change data: ", name, value);
    setPayrollEditPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        [name]: value,
      },
    }));
  };

  const handleTxnDetailShiftingToDockChange = (event, index) => {
    const { name, value } = event.target;
    console.log("before handle detail change ", payrollEditPageData);
    console.log("name : ", name, "/ value: ", value);

    setPayrollEditPageData((prevData) => ({
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
      ...payrollEditPageData.advanceSummary.vmPayrollDetails,
    ];

    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      [name]: value,
    };

    setPayrollEditPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        vmPayrollDetails: updatedSaleItems,
      },
    }));
  };

  const handleAddShiftingDetailRecord = async (event) => {
    // //validate if activerecord ko employee id is already present in txndetailrecors
    //     const idToBeValidated = advanceEditPageData.activeChildRecord.employeeID;
    //     const filteredRecords = advanceEditPageData.advanceSummary.vmTransactionDetails.filter(function(item){return item['employeeID'] ===idToBeValidated});
    //     //if there is data in filteredRecords then show error toast notification and return
    //     if(filteredRecords &&  filteredRecords !== null)
    //     {
    //       alert('already added');
    //       console.log('already in record');
    //       return;
    //     }

    //console.log('setting detail band data: ', advanceEditPageData);
    //code for adding active record to master detail child record
    // Add the activeRecord data to vmProductionDetails array
    setPayrollEditPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmPayrollDetails: [
          ...prevMasterData.advanceSummary.vmPayrollDetails,
          prevMasterData.activeChildRecord,
        ],
      },
    }));

    // Clear the values of the activeRecord
    setPayrollEditPageData((prevMasterData) => ({
      ...prevMasterData,
      isChildRecordInEditMode: false,
      editChildRecordArrayIndex: 0,
      activeChildRecord: {
        key: "k_" + -1 * prevMasterData.advanceSummary.vmPayrollDetails.length,
        id: 0,
        employeeID: "",
        // desc: "",
        paid_Amt: "",
        ref_No: "",
        remarks: "",
      },
    }));
    //console.log('after detail band data: ', advanceEditPageData);
  };

  const handleRemoveShiftingRecord = (index) => {
    const updatedTransactionDetails = [
      ...payrollEditPageData.advanceSummary.vmPayrollDetails,
    ];
    updatedTransactionDetails.splice(index, 1);
    //setMainData({ ...mainData, vmTransactionDetails: updatedEmployeeDetails });
    // Add the activeRecord data to vmProductionDetails array
    setPayrollEditPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmPayrollDetails: updatedTransactionDetails,
      },
    }));
    //console.log('after remove  change ', mainData);
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      var activeChild = payrollEditPageData.activeChildRecord;
      if (
        activeChild.employeeID > 0 &&
        activeChild.paid_Amt.length > 0 &&
        activeChild.ref_No.length > 0
      ) {
        payrollEditPageData.advanceSummary.vmPayrollDetails.push(activeChild);
      }
      if (
        payrollEditPageData.isInEditMode &&
        payrollEditPageData.editRecordID > 0
      ) {
        // update a new item
        await PayrollService.update(
          payrollEditPageData.editRecordID,
          payrollEditPageData.advanceSummary
        );
        //console.log("Data updated successfully:", shiftingEditPageData);
        //console.log("Data updated successfully:", shiftingEditPageData);
        navigate("/payroll-list");
      } else {
        // create an existing item
        //console.log("Data after POST:", advanceEditPageData.advanceSummary);
        await PayrollService.create(payrollEditPageData.advanceSummary);
        navigate("/payroll-list");
      }
    } catch (error) {
      console.error("Error creating/posting:", error);
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Payroll Form " pageTitle="Payroll" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <form onSubmit={handleCreatePost}>
                    <FormGroup row>
                      <Label
                        htmlFor="transaction_Date"
                        className="form-label"
                        sm={3}
                      >
                        Transaction_Date
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="date"
                          className="form-control"
                          id="transaction_Date"
                          name="transaction_Date"
                          required
                          value={
                            payrollEditPageData.advanceSummary.transaction_Date?.split(
                              "T"
                            )[0]
                          }
                          onChange={handleSummaryFieldChanges}
                        />
                      </Col>
                      <Label htmlFor="remarks" className="form-label" sm={3}>
                        Remarks
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="string"
                          className="form-control"
                          id="remarks"
                          required
                          name="remarks"
                          value={payrollEditPageData.advanceSummary.remarks}
                          onChange={handleSummaryFieldChanges}
                        />
                      </Col>
                    </FormGroup>

                    <div>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            {/* <th>Description</th> */}
                            <th>Paid Amount</th>
                            <th>Ref.No</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <select
                                className="form-control"
                                name="employeeID"
                                required={
                                  payrollEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  payrollEditPageData.activeChildRecord
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
                            </td>

                            <td>
                              <Input
                                type="number"
                                className="form-control"
                                name="paid_Amt"
                                required={
                                  payrollEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  payrollEditPageData.activeChildRecord.paid_Amt
                                }
                                onChange={(e) =>
                                  handleTxnDetailShiftingToDockChange(e)
                                }
                              />
                            </td>
                            <td>
                              <Input
                                type="string"
                                className="form-control"
                                name="ref_No"
                                required={
                                  payrollEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  payrollEditPageData.activeChildRecord.ref_No
                                }
                                onChange={(e) =>
                                  handleTxnDetailShiftingToDockChange(e)
                                }
                              />
                            </td>
                            <td>
                              <Input
                                type="text"
                                className="form-control"
                                name="remarks"
                                required={
                                  payrollEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  payrollEditPageData.activeChildRecord.remarks
                                }
                                onChange={(e) =>
                                  handleTxnDetailShiftingToDockChange(e)
                                }
                              />
                            </td>
                            <td>
                              <ButtonGroup>
                                <Button
                                  color="btn btn-soft-success"
                                  className="  btn-sm gap-1 "
                                  onClick={handleAddShiftingDetailRecord}
                                >
                                  +
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                          {payrollEditPageData.advanceSummary &&
                          Array.isArray(
                            payrollEditPageData.advanceSummary.vmPayrollDetails
                          ) ? (
                            payrollEditPageData.advanceSummary.vmPayrollDetails.map(
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
                                      className="form-control"
                                    >
                                      <option value="">Select Employee</option>
                                      {Employee.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>

                                  <td>
                                    <Input
                                      type="number"
                                      name="paid_Amt"
                                      value={item.paid_Amt}
                                      onChange={(e) =>
                                        handleEditTableInputChange(e, index)
                                      }
                                      className="form-control"
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="string"
                                      name="ref_No"
                                      value={item.ref_No}
                                      onChange={(e) =>
                                        handleEditTableInputChange(e, index)
                                      }
                                      className="form-control"
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="text"
                                      name="remarks"
                                      value={item.remarks}
                                      onChange={(e) =>
                                        handleEditTableInputChange(e, index)
                                      }
                                      className="form-control"
                                    />
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
                                          payrollEditPageData.isChildRecordInEditMode
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
                        </tbody>
                      </table>
                    </div>
                    <div className="text-end">
                      <Button type="submit" className="btn btn-primary">
                        Save
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PayrollEditor;
