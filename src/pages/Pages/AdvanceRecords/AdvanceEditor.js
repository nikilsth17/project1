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
import AdvanceService from "../../../services/HRService/AdvanceServices";
import EmployeeService from "../../../services/HRService/EmployeeService";

const AdvanceEditor = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const idValue = id || 0;
  //console.log("Normal Catch", id, idValue);
  // State for the main data
  const [advanceEditPageData, setAdvanceEditPageData] = useState({
    editRecordID: idValue,
    // isInEditMode: idValue>0,
    isInEditMode: !!id,
    isChildRecordInEditMode: false,
    activeChildRecord: {
      key: "k_0",
      id: 0,
      employeeID: 0,
      desc: "",
      amount: "",
      ref_No: "",
      remarks: "",
    },
    editChildRecordArrayIndex: 0,
    advanceSummary: {
      id: idValue,
      transaction_Date: "",
      remarks: "",
      vmTransactionDetails: [],
    },
  });

  const [Employee, setEmployee] = useState([]);
  const [mainFormData, setMainFormData] = useState([]);
  const [mainData, setMainData] = useState([]);

  async function getRelatedDataFromAPI() {
    try {
      //console.log(advanceEditPageData.editRecordID, ' id values is null');
      if (advanceEditPageData.editRecordID <= 0) {
        return;
      }

      const apiResponse = await AdvanceService.view(
        advanceEditPageData.editRecordID
      );
      // console.log("Response from Server: ", apiResponse);

      apiResponse.vmTransactionDetails = apiResponse.vmDetail;
      // Map through vmProductionDetails to add totalAmount property
      const updatedApiResponse = {
        ...apiResponse,
        vmTransactionDetails: apiResponse.vmTransactionDetails.map(
          (detail) => ({
            ...detail,
            key: "o_" + detail.id,
          })
        ),
      };

      //console.log('updated response:', updatedApiResponse);

      setAdvanceEditPageData((prevData) => ({
        ...prevData,
        advanceSummary: updatedApiResponse, // Update the property with the new value
      }));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }
  useEffect(() => {
    if (advanceEditPageData.editRecordID > 0) {
      getRelatedDataFromAPI(advanceEditPageData.editRecordID);
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
        if (advanceEditPageData.isInEditMode) {
          await getRelatedDataFromAPI();
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [advanceEditPageData.isInEditMode, advanceEditPageData.editRecordID]);
  useEffect(() => {
    //console.log("Page Data:", advanceEditPageData);
    if (advanceEditPageData.editRecordID > 0) {
      //call api and get data
      getRelatedDataFromAPI(advanceEditPageData.editRecordID);
    } else {
      //set default blank form... which is already done
    }
  }, []);

  const handleDateUpdate = (propertyName, dateValue) => {
    // Update the state with the new date value
    setAdvanceEditPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        transaction_Date: dateValue,
      },
    }));
    console.log("after remove  change ", advanceEditPageData.advanceSummary);
  };

  const handleSummaryFieldChanges = (event) => {
    console.log(event);
    const { name, value } = event.target;
    console.log("setting hanle change data: ", name, value);
    setAdvanceEditPageData((prevData) => ({
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
    setAdvanceEditPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        employeeID: selectedValue,
        employeeName: selectedText,
      }, // Update the property with the new value
    }));
    console.log("Selected obj:", advanceEditPageData.activeChildRecord);

    // You can now use selectedText and selectedValue as needed
    console.log("Selected Text:", selectedText);
    console.log("Selected Value (ID):", selectedValue);
  };
  const handleTxnDetailEmployeeRecordChange = (event, index) => {
    const { name, value } = event.target;
    //console.log('before handle detail change ', advanceEditPageData);
    //console.log('name : ', name, '/ value: ', value);

    setAdvanceEditPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        [name]: value,
      }, // Update the property with the new value
    }));

    //console.log('after handle detail change ', advanceEditPageData);
  };

  const handleAddEmployeeDetailRecord = async (event) => {
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
    setAdvanceEditPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmTransactionDetails: [
          ...prevMasterData.advanceSummary.vmTransactionDetails,
          prevMasterData.activeChildRecord,
        ],
      },
    }));

    // Clear the values of the activeRecord
    setAdvanceEditPageData((prevMasterData) => ({
      ...prevMasterData,
      isChildRecordInEditMode: false,
      editChildRecordArrayIndex: 0,
      activeChildRecord: {
        key:
          "k_" + -1 * prevMasterData.advanceSummary.vmTransactionDetails.length,
        id: 0,
        employeeID: 0,
        desc: "",
        amount: "",
        ref_No: "",
        remarks: "",
      },
    }));
    //console.log('after detail band data: ', advanceEditPageData);
  };

  const handleEditTableInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedSaleItems = [
      ...advanceEditPageData.advanceSummary.vmTransactionDetails,
    ];

    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      [name]: value,
    };

    setAdvanceEditPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        vmTransactionDetails: updatedSaleItems,
      },
    }));
  };

  const handleRemoveEmployeeRecord = (index) => {
    const updatedTransactionDetails = [
      ...advanceEditPageData.advanceSummary.vmTransactionDetails,
    ];
    updatedTransactionDetails.splice(index, 1);
    //setMainData({ ...mainData, vmTransactionDetails: updatedEmployeeDetails });
    // Add the activeRecord data to vmProductionDetails array
    setAdvanceEditPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmTransactionDetails: updatedTransactionDetails,
      },
    }));
    //console.log('after remove  change ', mainData);
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();

    try {
      //console.log(advanceEditPageData);
      var activeChild = advanceEditPageData.activeChildRecord;

      if (
        activeChild.employeeID > 0 &&
        activeChild.amount > 0 &&
        activeChild.ref_No.length > 0
      ) {
        advanceEditPageData.advanceSummary.vmTransactionDetails.push(
          activeChild
        );
      }
      if (
        advanceEditPageData.isInEditMode &&
        advanceEditPageData.editRecordID > 0
      ) {
        // update a new item
        await AdvanceService.update(
          advanceEditPageData.editRecordID,
          advanceEditPageData.advanceSummary
        );
        //console.log("Data updated successfully:", advanceEditPageData);
        navigate("/advance-list");
      } else {
        // create an existing item
        //console.log("Data after POST:", advanceEditPageData.advanceSummary);

        await AdvanceService.create(advanceEditPageData.advanceSummary);
        navigate("/advance-list");
      }
    } catch (error) {
      console.error("Error creating/posting:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Advance Records Form" pageTitle="Advance Records" />
        <Container fluid>
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
                        Transaction Date
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="date"
                          className="form-control"
                          id="transaction_Date"
                          required
                          name="transaction_Date"
                          value={
                            advanceEditPageData.advanceSummary.transaction_Date?.split(
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
                          value={advanceEditPageData.advanceSummary.remarks}
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
                            <th>Amount</th>
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
                                  advanceEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  advanceEditPageData.activeChildRecord
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
                                  advanceEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  advanceEditPageData.activeChildRecord.ref_No
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
                                  advanceEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                name="amount"
                                value={
                                  advanceEditPageData.activeChildRecord.amount
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
                                  advanceEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  advanceEditPageData.activeChildRecord.remarks
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
                          {advanceEditPageData.advanceSummary &&
                          Array.isArray(
                            advanceEditPageData.advanceSummary
                              .vmTransactionDetails
                          ) ? (
                            advanceEditPageData.advanceSummary.vmTransactionDetails.map(
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
                                      name="amount"
                                      value={item.amount}
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
                                          advanceEditPageData.isChildRecordInEditMode
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

export default AdvanceEditor;
