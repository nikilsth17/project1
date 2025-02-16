import React, { useState, useEffect } from "react";

import {
  Button,
  ButtonGroup,
  ButtonToggle,
  Col,
  Card,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  CardBody,
} from "reactstrap";

//Import Flatepicker
import Flatpickr from "react-flatpickr";

import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import EmployeeService from "../../../services/HRService/EmployeeService";
import EmployeeSettlementService from "../../../services/HRService/EmployeeSettlementService";

const EmployeeSettlementEditor = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const idValue = id || 0;
  //console.log("Normal Catch", id, idValue);
  // State for the main data
  const [settlementPageData, setSettlementPageData] = useState({
    editRecordID: idValue,
    // isInEditMode: idValue>0,
    isInEditMode: !!id,
    isChildRecordInEditMode: false,
    activeChildRecord: {
      key: "k_0",
      id: 0,
      employeeID: 0,
      ref_No: "",
      paid_Amt: "",
      received_Amt: "",
      remarks: "",
      is_Verified: true,
      status: true,
    },
    editChildRecordArrayIndex: 0,
    advanceSummary: {
      id: idValue,
      settlement_Date: "",
      remarks: "",
      vmSettlementDetails: [],
    },
  });

  const [Employee, setEmployee] = useState([]);
  const [mainFormData, setMainFormData] = useState([]);
  const [mainData, setMainData] = useState([]);

  async function getRelatedDataFromAPI() {
    try {
      //console.log(settlementPageData.editRecordID, ' id values is null');
      if (settlementPageData.editRecordID <= 0) {
        return;
      }

      const apiResponse = await EmployeeSettlementService.view(
        settlementPageData.editRecordID
      );
      // console.log("Response from Server: ", apiResponse);

      apiResponse.vmSettlementDetails = apiResponse.vmSetDetails;
      // Map through vmProductionDetails to add totalpaid_Amt property
      const updatedApiResponse = {
        ...apiResponse,
        settlement_Date: apiResponse._Date
          ? apiResponse._Date.split("T")[0]
          : "",
        vmSettlementDetails: apiResponse.vmSettlementDetails.map((detail) => ({
          ...detail,
          key: "o_" + detail.id,
        })),
      };

      //console.log('updated response:', updatedApiResponse);

      setSettlementPageData((prevData) => ({
        ...prevData,
        advanceSummary: updatedApiResponse, // Update the property with the new value
      }));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }
  useEffect(() => {
    if (settlementPageData.editRecordID > 0) {
      getRelatedDataFromAPI(settlementPageData.editRecordID);
    }
  }, []);
  const [activeEmployeeDetail, setActiveDetailRecord] = useState({});

  useEffect(() => {
    // Define an async function to fetch journal voucher details using the 'view' API call
    const fetchData = async () => {
      try {
        const relatedData = await EmployeeService.getList();
        //console.log("Fetched Posts:", relatedData); // Debugging line
        setEmployee(relatedData);
        if (settlementPageData.isInEditMode) {
          await getRelatedDataFromAPI();
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [settlementPageData.isInEditMode, settlementPageData.editRecordID]);
  useEffect(() => {
    //console.log("Page Data:", settlementPageData);
    if (settlementPageData.editRecordID > 0) {
      //call api and get data
      getRelatedDataFromAPI(settlementPageData.editRecordID);
    } else {
      //set default blank form... which is already done
    }
  }, []);

  const handleDateUpdate = (propertyName, dateValue) => {
    // Update the state with the new date value
    setSettlementPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        settlementsettlement_Date: dateValue,
      },
    }));
    console.log("after remove  change ", settlementPageData.advanceSummary);
  };

  const handleSummaryFieldChanges = (event) => {
    console.log(event);
    const { name, value } = event.target;
    console.log("setting hanle change data: ", name, value);
    setSettlementPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        [name]: value,
      },
    }));
    // console.log('after handle change ', mainData);
  };

  const handleEmployeeChange = (event) => {
    // Get the selected option element
    const selectedOption = event.target.options[event.target.selectedIndex];

    // Get the text value of the selected option (displayed name)
    const selectedText = selectedOption.text;

    // Get the value (ID) of the selected option
    const selectedValue = event.target.value;

    // Update the state with the selected text and value
    setSettlementPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        employeeID: selectedValue,
        employeeName: selectedText,
      }, // Update the property with the new value
    }));
    console.log("Selected obj:", settlementPageData.activeChildRecord);

    // You can now use selectedText and selectedValue as needed
    console.log("Selected Text:", selectedText);
    console.log("Selected Value (ID):", selectedValue);
  };
  const handleTxnDetailEmployeeRecordChange = (event, index) => {
    const { name, value } = event.target;
    //console.log('before handle detail change ', settlementPageData);
    //console.log('name : ', name, '/ value: ', value);

    setSettlementPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        [name]: value,
      }, // Update the property with the new value
    }));

    //console.log('after handle detail change ', settlementPageData);
  };

  const handleAddEmployeeDetailRecord = async (event) => {
    // //validate if activerecord ko employee id is already present in txndetailrecors
    //     const idToBeValidated = settlementPageData.activeChildRecord.employeeID;
    //     const filteredRecords = settlementPageData.advanceSummary.vmSettlementDetails.filter(function(item){return item['employeeID'] ===idToBeValidated});
    //     //if there is data in filteredRecords then show error toast notification and return
    //     if(filteredRecords &&  filteredRecords !== null)
    //     {
    //       alert('already added');
    //       console.log('already in record');
    //       return;
    //     }

    //console.log('setting detail band data: ', settlementPageData);
    //code for adding active record to master detail child record
    // Add the activeRecord data to vmProductionDetails array
    setSettlementPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmSettlementDetails: [
          ...prevMasterData.advanceSummary.vmSettlementDetails,
          prevMasterData.activeChildRecord,
        ],
      },
    }));

    // Clear the values of the activeRecord
    setSettlementPageData((prevMasterData) => ({
      ...prevMasterData,
      isChildRecordInEditMode: false,
      editChildRecordArrayIndex: 0,
      activeChildRecord: {
        key:
          "k_" + -1 * prevMasterData.advanceSummary.vmSettlementDetails.length,
        id: 0,
        employeeID: 0,
        ref_No: "",
        paid_Amt: "",
        received_Amt: "",
        remarks: "",
        is_Verified: true,
        status: true,
      },
    }));
    //console.log('after detail band data: ', settlementPageData);
  };

  const handleEditTableInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedSaleItems = [
      ...settlementPageData.advanceSummary.vmSettlementDetails,
    ];

    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      [name]: value,
    };

    setSettlementPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        vmSettlementDetails: updatedSaleItems,
      },
    }));
  };

  const handleRemoveEmployeeRecord = (index) => {
    const updatedTransactionDetails = [
      ...settlementPageData.advanceSummary.vmSettlementDetails,
    ];
    updatedTransactionDetails.splice(index, 1);
    //setMainData({ ...mainData, vmSettlementDetails: updatedEmployeeDetails });
    // Add the activeRecord data to vmProductionDetails array
    setSettlementPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmSettlementDetails: updatedTransactionDetails,
      },
    }));
    //console.log('after remove  change ', mainData);
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();

    try {
      //console.log(settlementPageData);
      var activeChild = settlementPageData.activeChildRecord;

      if (
        activeChild.employeeID > 0 &&
        activeChild.paid_Amt > 0 &&
        activeChild.received_Amt > 0 &&
        activeChild.ref_No.length > 0
      ) {
        settlementPageData.advanceSummary.vmSettlementDetails.push(activeChild);
      }
      if (
        settlementPageData.isInEditMode &&
        settlementPageData.editRecordID > 0
      ) {
        // update a new item
        await EmployeeSettlementService.update(
          settlementPageData.editRecordID,
          settlementPageData.advanceSummary
        );
        //console.log("Data updated successfully:", settlementPageData);
        navigate("/settlement-list");
      } else {
        // create an existing item
        //console.log("Data after POST:", settlementPageData.advanceSummary);

        await EmployeeSettlementService.create(
          settlementPageData.advanceSummary
        );
        navigate("/settlement-list");
      }
    } catch (error) {
      console.error("Error creating/posting:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb
          title="Employee Settlement Form"
          pageTitle="Employee Settlement"
        />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <form onSubmit={handleCreatePost}>
                    <FormGroup row>
                      <Label
                        htmlFor="settlement_Date"
                        className="form-label"
                        sm={3}
                      >
                        Settlement Date
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="date"
                          className="form-control"
                          id="settlement_Date"
                          required
                          name="settlement_Date"
                          value={
                            settlementPageData.advanceSummary.settlement_Date?.split(
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
                          name="remarks"
                          value={settlementPageData.advanceSummary.remarks}
                          onChange={handleSummaryFieldChanges}
                          required
                        />
                      </Col>
                    </FormGroup>

                    <div>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Ref_No</th>
                            <th>Paid Amount</th>
                            <th>Received Amount</th>
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
                                  settlementPageData.isInEditMode ? false : true
                                }
                                value={
                                  settlementPageData.activeChildRecord
                                    .employeeID
                                }
                                onChange={(e) => handleEmployeeChange(e)}
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
                                type="string"
                                className="form-control"
                                name="ref_No"
                                required={
                                  settlementPageData.isInEditMode ? false : true
                                }
                                value={
                                  settlementPageData.activeChildRecord.ref_No
                                }
                                onChange={(e) =>
                                  handleTxnDetailEmployeeRecordChange(e)
                                }
                              />
                            </td>
                            <td>
                              <Input
                                type="number"
                                className="form-control"
                                required={
                                  settlementPageData.isInEditMode ? false : true
                                }
                                name="paid_Amt"
                                value={
                                  settlementPageData.activeChildRecord.paid_Amt
                                }
                                onChange={(e) =>
                                  handleTxnDetailEmployeeRecordChange(e)
                                }
                              />
                            </td>
                            <td>
                              <Input
                                type="number"
                                className="form-control"
                                required={
                                  settlementPageData.isInEditMode ? false : true
                                }
                                name="received_Amt"
                                value={
                                  settlementPageData.activeChildRecord
                                    .received_Amt
                                }
                                onChange={(e) =>
                                  handleTxnDetailEmployeeRecordChange(e)
                                }
                              />
                            </td>
                            <td>
                              <Input
                                type="string"
                                className="form-control"
                                name="remarks"
                                required={
                                  settlementPageData.isInEditMode ? false : true
                                }
                                value={
                                  settlementPageData.activeChildRecord.remarks
                                }
                                onChange={(e) =>
                                  handleTxnDetailEmployeeRecordChange(e)
                                }
                              />
                            </td>

                            <td>
                              <Button
                                color="btn btn-soft-success"
                                className="  btn-sm gap-1 "
                                onClick={handleAddEmployeeDetailRecord}
                              >
                                +
                              </Button>
                            </td>
                          </tr>
                          {settlementPageData.advanceSummary &&
                          Array.isArray(
                            settlementPageData.advanceSummary
                              .vmSettlementDetails
                          ) ? (
                            settlementPageData.advanceSummary.vmSettlementDetails.map(
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
                                      <option value="">
                                        Select employeeID
                                      </option>
                                      {Employee.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.name}
                                        </option>
                                      ))}
                                    </select>
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
                                      type="number"
                                      name="received_Amt"
                                      value={item.received_Amt}
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
                                          handleRemoveEmployeeRecord(index)
                                        }
                                        disabled={
                                          settlementPageData.isChildRecordInEditMode
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
                              <td colSpan="6">No advance details</td>
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

export default EmployeeSettlementEditor;
