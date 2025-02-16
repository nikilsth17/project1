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
import LedgersService from "../../../services/AccountingServices/LedgerService";
import ExpensesService from "../../../services/AccountingServices/ExpensesService";

const ExpensesEditor = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const idValue = id || 0;
  console.log("Normal Catch", id, idValue);
  // State for the main data
  const [expensesEditPageData, setExpensesEditPageData] = useState({
    editRecordID: idValue,

    isInEditMode: !!id,
    isChildRecordInEditMode: false,
    activeChildRecord: {
      key: "k_0",
      id: 0,
      ledgerId: 0, // Initialize as an empty string
      debit: "",
      // credit: "",
      description: "",
      chqNo: "",
    },
    // Yo greater than 1 vayexi yeskoindex change hunxa ra editMode on hunxa
    editChildRecordArrayIndex: 0,
    advanceSummary: {
      amount: "",
      // voucherTypeId: "",
      valueDate: "",
      remarks: "",
      manualVno: "",
      chqNo: "",
      contraLedgerId: "",
      vmVoucherDetailCreate: [],
    },
  });
  const [Ledger, setLedger] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const relatedData = await LedgersService.getList();
        //console.log("Fetched Posts:", relatedData); // Debugging line
        setLedger(relatedData);
        if (expensesEditPageData.isInEditMode) {
          await getRelatedDataFromAPI();
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [expensesEditPageData.isInEditMode, expensesEditPageData.editRecordID]);

  async function getRelatedDataFromAPI() {
    try {
      //console.log(advanceEditPageData.editRecordID, ' id values is null');
      if (expensesEditPageData.editRecordID <= 0) {
        return;
      }
      const apiResponse = await ExpensesService.view(
        expensesEditPageData.editRecordID
      );
      //console.log("Response from Server: ", apiResponse);

      apiResponse.vmVoucherDetailCreate = apiResponse.vmDetails;
      // Map through vmProductionDetails to add totalAmount property
      const updatedApiResponse = {
        ...apiResponse,
        vmVoucherDetailCreate: apiResponse.vmVoucherDetailCreate.map(
          (detail) => ({
            ...detail,
            key: "o_" + detail.id,
          })
        ),
      };

      //console.log('updated response:', updatedApiResponse);

      setExpensesEditPageData((prevData) => ({
        ...prevData,
        advanceSummary: updatedApiResponse, // Update the property with the new value
      }));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }
  useEffect(() => {
    //console.log("Page Data:", advanceEditPageData);
    if (expensesEditPageData.editRecordID > 0) {
      //call api and get data
      getRelatedDataFromAPI(expensesEditPageData.editRecordID);
    } else {
      //set default blank form... which is already done
    }
  }, []);

  const handleLedgerChange = (event) => {
    // Get the selected option element
    const selectedOption = event.target.options[event.target.selectedIndex];

    // // Get the text value of the selected option (displayed name)
    // const selectedText = selectedOption.text;

    // Get the value (ID) of the selected option
    const selectedValue = event.target.value;

    // Update the state with the selected text and value
    setExpensesEditPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        ledgerId: selectedValue,
        // employeeName: selectedText
      }, // Update the property with the new value
    }));
    console.log("Selected obj:", expensesEditPageData.activeChildRecord);

    // // You can now use selectedText and selectedValue as needed
    // console.log('Selected Text:', selectedText);
    console.log("Selected Value (ID):", selectedValue);
  };

  const handleSummaryFieldChanges = (event) => {
    console.log(event);
    const { name, value } = event.target;
    console.log("setting hanle change data: ", name, value);
    setExpensesEditPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        [name]: value,
      },
    }));
  };

  const handleTxnDetailChange = (event, index) => {
    const { name, value } = event.target;
    console.log("before handle detail change ", expensesEditPageData);
    console.log("name : ", name, "/ value: ", value);

    setExpensesEditPageData((prevData) => ({
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
      ...expensesEditPageData.advanceSummary.vmVoucherDetailCreate,
    ];

    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      [name]: value,
    };

    setExpensesEditPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        vmVoucherDetailCreate: updatedSaleItems,
      },
    }));
  };

  const handleAddRecordChange = async (event) => {
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
    setExpensesEditPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmVoucherDetailCreate: [
          ...prevMasterData.advanceSummary.vmVoucherDetailCreate,
          prevMasterData.activeChildRecord,
        ],
      },
    }));

    // Clear the values of the activeRecord
    setExpensesEditPageData((prevMasterData) => ({
      ...prevMasterData,
      isChildRecordInEditMode: false,
      editChildRecordArrayIndex: 0,
      activeChildRecord: {
        key:
          "k_" +
          -1 * prevMasterData.advanceSummary.vmVoucherDetailCreate.length,
        id: 0,
        ledgerId: 0, // Initialize as an empty string
        debit: "",
        // credit: "",
        description: "",
        chqNo: "",
      },
    }));
    //console.log('after detail band data: ', advanceEditPageData);
  };

  const handleRemoveShiftingRecord = (index) => {
    const updatedTransactionDetails = [
      ...expensesEditPageData.advanceSummary.vmVoucherDetailCreate,
    ];
    updatedTransactionDetails.splice(index, 1);
    //setMainData({ ...mainData, vmTransactionDetails: updatedEmployeeDetails });
    // Add the activeRecord data to vmProductionDetails array
    setExpensesEditPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmVoucherDetailCreate: updatedTransactionDetails,
      },
    }));
    //console.log('after remove  change ', mainData);
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      var activeChild = expensesEditPageData.activeChildRecord;
      if (
        activeChild.ledgerId > 0 &&
        activeChild.debit.length > 0 &&
        activeChild.chqNo.length > 0
      ) {
        expensesEditPageData.advanceSummary.vmVoucherDetailCreate.push(
          activeChild
        );
      }
      if (expensesEditPageData.editRecordID === 0) {
        console.log("Creating a new item");
        // create a new item
        await ExpensesService.create(expensesEditPageData.advanceSummary);
        navigate("/expenses-vouchers");
      } else {
        console.log("Updating an existing item");
        // update an existing item
        await ExpensesService.update(
          expensesEditPageData.editRecordID,
          expensesEditPageData.advanceSummary
        );
        console.log("Data updated successfully:", expensesEditPageData);
        navigate("/expenses-vouchers");
      }
    } catch (error) {
      console.error("Error creating/posting:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Expenses Form" pageTitle="Expenses " />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <form onSubmit={handleCreatePost}>
                    <FormGroup row>
                      <Label htmlFor="amount" className="form-label" sm={3}>
                        Amount
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="number"
                          className="form-control"
                          id="amount"
                          name="amount"
                          required={
                            expensesEditPageData.isInEditMode ? false : true
                          }
                          value={expensesEditPageData.advanceSummary.amount}
                          onChange={handleSummaryFieldChanges}
                        />
                      </Col>

                      <Label htmlFor="valueDate" className="form-label" sm={3}>
                        Date
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="date"
                          className="form-control"
                          id="valueDate"
                          name="valueDate"
                          required
                          value={
                            expensesEditPageData.advanceSummary.valueDate?.split(
                              "T"
                            )[0]
                          }
                          onChange={handleSummaryFieldChanges}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label htmlFor="remarks" className="form-label" sm={3}>
                        Remarks
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="string"
                          className="form-control"
                          id="remarks"
                          name="remarks"
                          required
                          value={expensesEditPageData.advanceSummary.remarks}
                          onChange={handleSummaryFieldChanges}
                        />
                      </Col>
                      <Label htmlFor="manualVno" className="form-label" sm={3}>
                        Manual Voucher Number
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="string"
                          className="form-control"
                          id="manualVno"
                          required
                          name="manualVno"
                          value={expensesEditPageData.advanceSummary.manualVno}
                          onChange={handleSummaryFieldChanges}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label htmlFor="chqNo" className="form-label" sm={3}>
                        Cheque Number
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="string"
                          className="form-control"
                          required={
                            expensesEditPageData.isInEditMode ? false : true
                          }
                          id="chqNo"
                          name="chqNo"
                          value={expensesEditPageData.advanceSummary.chqNo}
                          onChange={handleSummaryFieldChanges}
                        />
                      </Col>
                      <Label
                        htmlFor="contraLedgerId"
                        className="form-label"
                        sm={3}
                      >
                        ContraLedger
                      </Label>
                      <Col sm={3}>
                        <select
                          className="form-control"
                          name="contraLedgerId"
                          required
                          value={
                            expensesEditPageData.advanceSummary.contraLedgerId
                          }
                          onChange={handleSummaryFieldChanges}
                        >
                          <option value="">Select Contraledger</option>
                          {Ledger.map((item) => (
                            <option
                              key={item.id}
                              value={item.id}
                              // selected={employeeDetail.employeeID === item.id ? "selected":"" }
                            >
                              {item.ledgerName}
                            </option>
                          ))}
                        </select>
                      </Col>
                    </FormGroup>

                    <div>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Ledger</th>
                            <th>Debit</th>
                            {/* <th>Credit</th> */}
                            <th>Description</th>
                            <th>Cheque</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <select
                                className="form-control"
                                name="ledgerId"
                                required={
                                  expensesEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  expensesEditPageData.activeChildRecord
                                    .ledgerId
                                }
                                onChange={(e) => handleLedgerChange(e)}
                              >
                                <option value="">Select Ledger</option>
                                {Ledger.map((item) => (
                                  <option
                                    key={item.id}
                                    value={item.id}
                                    // selected={employeeDetail.employeeID === item.id ? "selected":"" }
                                  >
                                    {item.ledgerName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <Input
                                type="number"
                                className="form-control"
                                required={
                                  expensesEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                name="debit"
                                value={
                                  expensesEditPageData.activeChildRecord.debit
                                }
                                onChange={(e) => handleTxnDetailChange(e)}
                              />
                            </td>
                            {/* <td>
                              <Input
                                type="number"
                                className="form-control"
                                name="credit"
                                value={
                                  expensesEditPageData.activeChildRecord.credit
                                }
                                onChange={(e) => handleTxnDetailChange(e)}
                              />
                            </td> */}
                            <td>
                              <Input
                                type="text"
                                className="form-control"
                                name="description"
                                required={
                                  expensesEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  expensesEditPageData.activeChildRecord
                                    .description
                                }
                                onChange={(e) => handleTxnDetailChange(e)}
                              />
                            </td>
                            <td>
                              <Input
                                type="string"
                                className="form-control"
                                name="chqNo"
                                required={
                                  expensesEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  expensesEditPageData.activeChildRecord.chqNo
                                }
                                onChange={(e) => handleTxnDetailChange(e)}
                              />
                            </td>
                            <td>
                              <ButtonGroup>
                                <Button
                                  color="btn btn-soft-success"
                                  className="  btn-sm gap-1 "
                                  onClick={handleAddRecordChange}
                                >
                                  +
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                          {expensesEditPageData.advanceSummary &&
                          Array.isArray(
                            expensesEditPageData.advanceSummary
                              .vmVoucherDetailCreate
                          ) ? (
                            expensesEditPageData.advanceSummary.vmVoucherDetailCreate.map(
                              (item, index) => (
                                <tr key={item.key}>
                                  <td>
                                    <select
                                      type="string"
                                      name="ledgerId"
                                      value={item.ledgerId}
                                      onChange={(e) =>
                                        handleEditTableInputChange(e, index)
                                      }
                                      className="form-control"
                                    >
                                      <option value="">Select Ledger</option>
                                      {Ledger.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.ledgerName}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <Input
                                      type="text"
                                      name="debit"
                                      value={item.debit}
                                      onChange={(e) =>
                                        handleEditTableInputChange(e, index)
                                      }
                                      className="form-control"
                                    />
                                  </td>
                                  {/* <td>
                                    <Input
                                      type="number"
                                      name="credit"
                                      value={item.credit}
                                      onChange={(e) =>
                                        handleEditTableInputChange(e, index)
                                      }
                                      className="form-control"
                                    />
                                  </td> */}
                                  <td>
                                    <Input
                                      type="text"
                                      name="description"
                                      value={item.description}
                                      onChange={(e) =>
                                        handleEditTableInputChange(e, index)
                                      }
                                      className="form-control"
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="string"
                                      name="chqNo"
                                      value={item.chqNo}
                                      onChange={(e) =>
                                        handleEditTableInputChange(e, index)
                                      }
                                      className="form-control"
                                    />
                                  </td>
                                  <td>
                                    {/* <Button 
      color="btn btn-soft-danger"
      className="  btn-sm gap-1 "
      onClick={() => handleRemoveShiftingRecord(index)}
      
       >    
        -                                   
      </Button> */}
                                    <ButtonGroup size="sm">
                                      <Button
                                        size="sm"
                                        type="Button"
                                        className="btn btn-soft-danger"
                                        onClick={() =>
                                          handleRemoveShiftingRecord(index)
                                        }
                                        disabled={
                                          expensesEditPageData.isChildRecordInEditMode
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
                              <td colSpan="6"> No expenses details</td>
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

export default ExpensesEditor;
