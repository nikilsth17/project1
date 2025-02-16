import React, { useEffect, useState } from "react"; // Import React if not already imported
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Card,
  FormGroup,
  Input,
  Label,
  CardBody,
  Row,
} from "reactstrap";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import ProductionService from "../../../services/HRService/ProductionService";
import EmployeeService from "../../../services/HRService/EmployeeService";

const ProductionEditor = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const idValue = id || 0;
  // console.log("Normal Catch", id, idValue);

  const [productionEditPageData, setProductionPageData] = useState({
    editRecordID: idValue,
    // isInEditMode: idValue>0,
    isInEditMode: !!id,
    isChildRecordInEditMode: false,
    activeChildRecord: {
      key: "",
      id: 0,
      employeeID: 0,
      ref_No: "",
      quantity: "",
      remarks: "",
    },
    editChildRecordArrayIndex: 0,
    advanceSummary: {
      id: idValue,
      transaction_Date: "",
      remarks: "",
      vmProductionDetails: [],
    },
  });

  // Your component logic here
  const handleSummaryFieldChanges = (event) => {
    console.log(event);
    const { name, value } = event.target;
    console.log("setting hanle change data: ", name, value);
    setProductionPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        [name]: value,
      },
    }));
    // console.log('after handle change ', mainData);
  };
  const handleTxnDetailProductionRecordChange = (event, index) => {
    const { name, value } = event.target;
    console.log("before handle detail change ", productionEditPageData);
    //console.log('name : ', name, '/ value: ', value);

    setProductionPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        [name]: value,
      }, // Update the property with the new value
    }));

    //console.log('after handle detail change ', advanceEditPageData);
  };

  async function getRelatedDataFromAPI() {
    try {
      //console.log(advanceEditPageData.editRecordID, ' id values is null');
      if (productionEditPageData.editRecordID <= 0) {
        return;
      }

      const apiResponse = await ProductionService.view(
        productionEditPageData.editRecordID
      );
      console.log("Response from Server: ", apiResponse);

      apiResponse.vmProductionDetails = apiResponse.vmProductionDetail;
      // Map through vmProductionDetails to add totalAmount property
      const updatedApiResponse = {
        ...apiResponse,
        vmProductionDetails: apiResponse.vmProductionDetails.map((detail) => ({
          ...detail,
          
          key: "o_" + detail.id,
        })),
      };

      console.log("updated response:", updatedApiResponse);

      setProductionPageData((prevData) => ({
        ...prevData,
        advanceSummary: updatedApiResponse, // Update the property with the new value
      }));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }
  useEffect(() => {
    if (productionEditPageData.editRecordID > 0) {
      getRelatedDataFromAPI(productionEditPageData.editRecordID);
    }
  }, []);

  const handleAddProductionDetailRecord = async (event) => {
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
    setProductionPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmProductionDetails: [
          ...prevMasterData.advanceSummary.vmProductionDetails,
          prevMasterData.activeChildRecord,
        ],
      },
    }));

    // Clear the values of the activeRecord
    setProductionPageData((prevMasterData) => ({
      ...prevMasterData,
      isChildRecordInEditMode: false,
      editChildRecordArrayIndex: 0,
      activeChildRecord: {
        key:
          "k_" + -1 * prevMasterData.advanceSummary.vmProductionDetails.length,
        id: 0,
        employeeID: 0,
        ref_No: "",
        quantity: "",
        remarks: "",
      },
    }));
    //console.log('after detail band data: ', advanceEditPageData);
  };

  const handleRemoveProductionRecord = (index) => {
    const updatedTransactionDetails = [
      ...productionEditPageData.advanceSummary.vmProductionDetails,
    ];
    updatedTransactionDetails.splice(index, 1);
    //setMainData({ ...mainData, vmTransactionDetails: updatedEmployeeDetails });
    // Add the activeRecord data to vmProductionDetails array
    setProductionPageData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmProductionDetails: updatedTransactionDetails,
      },
    }));
    //console.log('after remove  change ', mainData);
  };

  const handleEmployeeChange = (event) => {
    // Get the selected option element
    const selectedOption = event.target.options[event.target.selectedIndex];

    // Get the text value of the selected option (displayed name)
    const selectedText = selectedOption.text;

    // Get the value (ID) of the selected option
    const selectedValue = event.target.value;

    // Update the state with the selected text and value
    setProductionPageData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        employeeID: selectedValue,
        employeeName: selectedText,
      }, // Update the property with the new value
    }));
    console.log("Selected obj:", productionEditPageData.activeChildRecord);

    // You can now use selectedText and selectedValue as needed
    console.log("Selected Text:", selectedText);
    console.log("Selected Value (ID):", selectedValue);
  };

  const [Employee, setEmployee] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const relatedData = await EmployeeService.getList();
        //console.log("Fetched Posts:", relatedData); // Debugging line
        setEmployee(relatedData);
        if (productionEditPageData.isInEditMode) {
          await getRelatedDataFromAPI();
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [
    productionEditPageData.isInEditMode,
    productionEditPageData.editRecordID,
  ]);
  useEffect(() => {
    //console.log("Page Data:", advanceEditPageData);
    if (productionEditPageData.editRecordID > 0) {
      //call api and get data
      getRelatedDataFromAPI(productionEditPageData.editRecordID);
    } else {
      //set default blank form... which is already done
    }
  }, []);

  const handleEditTableInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedSaleItems = [
      ...productionEditPageData.advanceSummary.vmProductionDetails,
    ];

    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      [name]: value,
    };

    setProductionPageData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        vmProductionDetails: updatedSaleItems,
      },
    }));
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      //console.log(advanceEditPageData);
      var activeChild = productionEditPageData.activeChildRecord;
      if (activeChild.employeeID > 0 && activeChild.ref_No.length > 0) {
        productionEditPageData.advanceSummary.vmProductionDetails.push(
          activeChild
        );
      }

      if (
        productionEditPageData.isInEditMode &&
        productionEditPageData.editRecordID > 0
      ) {
        // update a new item
        await ProductionService.update(
          productionEditPageData.editRecordID,
          productionEditPageData.advanceSummary
        );
        //console.log("Data updated successfully:", productionEditPageData);
        navigate("/production-list");
      } else {
        // create an existing item
        //console.log("Data after POST:", productionEditPageData.advanceSummary);
        await ProductionService.create(productionEditPageData.advanceSummary);
        navigate("/production-list");
      }
    } catch (error) {
      console.error("Error creating/posting:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Production Form" pageTitle="Production" />
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
                            productionEditPageData.advanceSummary.transaction_Date?.split(
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
                          required
                          value={productionEditPageData.advanceSummary.remarks}
                          onChange={handleSummaryFieldChanges}
                        />
                      </Col>
                    </FormGroup>

                    <div>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Ref_No</th>
                            <th>Quantity</th>
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
                                  productionEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  productionEditPageData.activeChildRecord
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
                                  productionEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  productionEditPageData.activeChildRecord
                                    .ref_No
                                }
                                onChange={(e) =>
                                  handleTxnDetailProductionRecordChange(e)
                                }
                              />
                            </td>
                            <td>
                              <Input
                                type="number"
                                className="form-control"
                                name="quantity"
                                required={
                                  productionEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  productionEditPageData.activeChildRecord
                                    .quantity
                                }
                                onChange={(e) =>
                                  handleTxnDetailProductionRecordChange(e)
                                }
                              />
                            </td>
                            <td>
                              <Input
                                type="string"
                                className="form-control"
                                name="remarks"
                                required={
                                  productionEditPageData.isInEditMode
                                    ? false
                                    : true
                                }
                                value={
                                  productionEditPageData.activeChildRecord
                                    .remarks
                                }
                                onChange={(e) =>
                                  handleTxnDetailProductionRecordChange(e)
                                }
                              />
                            </td>

                            <td>
                              <ButtonGroup>
                                <Button
                                  className="btn btn-soft-success"
                                  color="success"
                                  style={{
                                    padding: "7px",
                                    display: "flex",
                                    marginBottom: "5px",
                                  }}
                                  onClick={handleAddProductionDetailRecord}
                                >
                                  +
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                          {productionEditPageData.advanceSummary &&
                          Array.isArray(
                            productionEditPageData.advanceSummary
                              .vmProductionDetails
                          ) ? (
                            productionEditPageData.advanceSummary.vmProductionDetails.map(
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
                                      <option value="">Select employee</option>
                                      {Employee.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <Input
                                      type="text"
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
                                      name="quantity"
                                      value={item.quantity}
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
                                          handleRemoveProductionRecord(index)
                                        }
                                        disabled={
                                          productionEditPageData.isChildRecordInEditMode
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
                              <td colSpan="6">No production details</td>
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
export default ProductionEditor;
