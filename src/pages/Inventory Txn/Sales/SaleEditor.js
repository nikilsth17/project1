import React, { useState, useEffect } from "react";
import {
  ButtonGroup,
  FormGroup,
  Label,
  Col,
  Row,
  ButtonToggle,
  Form,
  CardBody,
  Card,
  Table,
  Input,
  Button,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import UnitsService from "../../../services/Inventory Services/UnitsService";
import ProductsServices from "../../../services/Inventory Services/ProductsServices";
import CustomerServices from "../../../services/Inventory Services/CustomerServices";
import SalesServices from "../../../services/Inventory Services/SalesServices";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeService from "../../../services/HRService/EmployeeService";
import VehicleServices from "../../../services/Inventory Services/VehicleServices";
import SelectOption from "../../Pages/Starter/Selectoption";
import * as Yup from "yup"; // Import Yup
import { Formik,  Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";



const SaleItemEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const idValue = id || 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // New state for editing mode
  const [editedUser, setEditedUser] = useState(null); // New state for edited user
  const dispatch = useDispatch();

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditedUser(null);
    setSaleItem({
    activeChildRecord: {
      key: "k_0",
      // id: 0,
      productID: "",
      quantity: "",
      unitID: "",
      rate: "",
      driverId: "",
      vechileId: "",
      destination: "",
      chalan_No: "",
      transportation_Fee: 0
    },
   
    editChildRecordArrayIndex: 0,
    
    advanceSummary: {
    
      date: "",
      customerId: "",
      invoice_No: "",
      remarks: "",
      disc_Amt: "",
      // vaT_Per: "",
      // status: true,
      vmSaleItem: [],
    }, });
  };
  const [saleItem, setSaleItem] = useState({
    
    editRecordID: idValue,
   isInEditMode: !!id,
    isChildRecordInEditMode: false,

    activeChildRecord: {
      key: "k_0",
      // id: 0,
      productID: "",
      quantity: "",
      unitID: "",
      rate: "",
      driverId: "",
      vechileId: "",
      destination: "",
      chalan_No: "",
      transportation_Fee: 0
    },
   
    editChildRecordArrayIndex: 0,
    
    advanceSummary: {
    
      date: "",
      customerId: "",
      invoice_No: "",
      remarks: "",
      disc_Amt: "",
      // vaT_Per: "",
      // status: true,
      vmSaleItem: [],
    },
  });
  let validationSchema = Yup.object().shape({
    date: Yup.date().required("date is required"),
   
    customerId: Yup.number().required("customerid is required"),
  
  });

  if (!isEditMode) {
    validationSchema = validationSchema.concat(
      Yup.object().shape({
        password: Yup.string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters")
          .matches(
            /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=\S+$)/,
            "Password must include at least one number, one uppercase letter, and one special character"
          ),
      })
    );
  }

  const [customerId, setCustomerId] = useState([]);
  const [productsId, setProductsId] = useState([]);
  const [unitsId, setUnitsId] = useState([]);
  const [isDriverEmploy, setIsDriverEmploy] = useState([]);
  const [isVehicleNo, setIsVehicleNo] = useState([]);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCustomer = await CustomerServices.getList();
        setCustomerId(fetchedCustomer);

        const fetchedProducts = await ProductsServices.getList();
        setProductsId(fetchedProducts);

        const fetchedUnits = await UnitsService.getList();
        setUnitsId(fetchedUnits);

        const fetchedEmploy = await EmployeeService.getList();
        setIsDriverEmploy(fetchedEmploy);

        const fetchedVehicleno = await VehicleServices.getList();
        setIsVehicleNo(fetchedVehicleno);
 if (saleItem.isInEditMode) {
          await getRelatedDataFromAPI();
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [saleItem.isInEditMode,saleItem.editRecordID]);

  async function getRelatedDataFromAPI() {
    try {
      if (saleItem.editRecordID <= 0) {
        return;
      }

      const apiResponse = await SalesServices.view(saleItem.editRecordID);
      apiResponse.vmSaleItem = apiResponse.vmSaleItemDetails;

      const updatedApiResponse = {
        ...apiResponse,
        vmSaleItem: apiResponse.vmSaleItemDetails.map((detail) => ({
          ...detail,
          driverId:detail.driver_Id,
          vechileId:detail.vehicle_Id,
          key: "o_" + detail.id
        })),
      };

      setSaleItem((prevData) => ({
        ...prevData,
        advanceSummary: updatedApiResponse,
      }));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }

  useEffect(() => {
    if (saleItem.editRecordID > 0) {
      getRelatedDataFromAPI(saleItem.editRecordID);
   } else {
      //set default blank form... which is already done
    }
  }, []);

 

  const handleSummaryInputChanges = (event) => {
    const { name, value } = event.target;
    setSaleItem((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        [name]: value,
      },
    }));
    console.log(saleItem);
  };

  const handleSalesInputChanges = (event, index) => {
    const { name, value } = event.target;
    setSaleItem((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        [name]: value,
      },
    }));
    console.log(saleItem);
  };

  const handleEditTableInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedSaleItems = [...saleItem.advanceSummary.vmSaleItem];

    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      [name]: value,
    };

    setSaleItem((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        vmSaleItem: updatedSaleItems,
      },
    }));
    console.log(saleItem);
  };

  const handleEditSaleItem = (index) => {
    setSaleItem((prevData) => ({
      ...prevData,
      isChildRecordInEditMode: true,
      editChildRecordArrayIndex: index,
      activeChildRecord: {
        ...prevData.advanceSummary.vmSaleItem[index],
      },
    }));
  };



  const handleRemoveSaleItem = (index) => {
    const updatedSaleItems = [...saleItem.advanceSummary.vmSaleItem];
    updatedSaleItems.splice(index, 1);

    setSaleItem((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        vmSaleItem: updatedSaleItems,
      },
    }));
  };

  const handleAddSaleItem = () => {
    const newSaleItem = { ...saleItem.activeChildRecord };
    setSaleItem((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmSaleItem: [
          ...prevMasterData.advanceSummary.vmSaleItem,
          newSaleItem,
        ],
      },
      isChildRecordInEditMode: false,
      editChildRecordArrayIndex: -1,
      activeChildRecord: {
        key: `k_${-1 * prevMasterData.advanceSummary.vmSaleItem.length}`,
        id: 0,
        productID: "",
        quantity: "",
        unitID: "",
        rate: "",
        driverId: "",
        vechileId: "",
        destination:"",
        chalan_No: "",
        transportation_Fee: 0
      },
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
  
    try {
      const activeChild = saleItem.activeChildRecord;
  
      if (
        activeChild.productID > 0 &&
        activeChild.quantity > 0 &&
        activeChild.unitID > 0 &&
        activeChild.rate.length > 0 &&
        activeChild.driverId > 0 &&
        activeChild.vechileId > 0 &&
        activeChild.destination.length > 0 &&
        activeChild.chalan_No.length > 0 &&
        activeChild. transportation_Fee.length > 0 
      
      ) {
        saleItem.advanceSummary.vmSaleItem.push(activeChild);
      }
  
      if (saleItem.isInEditMode) {
        await SalesServices.update(saleItem.editRecordID, saleItem.advanceSummary);
      } else {
        await SalesServices.create(saleItem.advanceSummary);
      }
  
      navigate("/sales");
    } catch (error) {
      console.error("Error creating/posting:", error);
    }
  };
  

  return (
   
      <React.Fragment>
         <div className="page-content">
       
          <BreadCrumb title="Sales Item Form" pageTitle="Sales_Item" />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Form onSubmit={handleSave}>
                    <FormGroup row>
                      <Col sm={3}>
                        <Label for="date">Date:</Label>
                      </Col>
                      <Col sm={3}>
                        <Input
                          type="date"
                          id="date"
                          placeholder="Enter date"
                          value={saleItem.advanceSummary.date.split("T")[0]
                          .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                          .substring(0, 10)}
                          name="date"
                          onChange={handleSummaryInputChanges}
                          className="form-control"
                        />
                      </Col>
                      <Col sm={3}>
                        <Label for="customerId">Customer: </Label>
                      </Col>
                      <Col sm={3}>
                        <SelectOption
                         type="number"
  name="customerId"
  value={saleItem.advanceSummary.customerId}
  onChange={handleSummaryInputChanges}
  options={customerId}
  placeholder="Select customer"
                        />
                        
                        {/* <select
                          type="text"
                          id="customerId"
                          placeholder="Enter Customer ID"
                          value={saleItem.advanceSummary.customerId}
                          name="customerId"
                          onChange={handleSummaryInputChanges}
                          className="form-control"
                        >
                          <option value="">Select customer</option>
                          {customerId.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select> */}
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col sm={3}>
                        <Label for="invoice_No">Invoice Number:</Label>
                      </Col>
                      <Col sm={3}>
                        <Input
                          type="string"
                          id="invoice_No"
                          // placeholder="Enter Invoice Number"
                          value={saleItem.advanceSummary.invoice_No}
                          name="invoice_No"
                          onChange={handleSummaryInputChanges}
                          className="form-control"
                        />
                      </Col>
                      <Col sm={3}>
                        <Label for="remarks">Remarks:</Label>
                      </Col>
                      <Col sm={3}>
                        <Input
                          type="string"
                          id="remarks"
                          // placeholder="Enter Remarks"
                          value={saleItem.advanceSummary.remarks}
                          name="remarks"
                          onChange={handleSummaryInputChanges}
                          className="form-control"
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col sm={3}>
                        <Label for="vaT_Per">Discount Amount:</Label>
                      </Col>
                      <Col sm={3}>
                        <Input
                          type="number"
                          id="disc_Amt"
                          // placeholder="Enter VAT Percentage"
                          value={saleItem.advanceSummary.disc_Amt}
                          name="disc_Amt"
                          onChange={handleSummaryInputChanges}
                          className="form-control"
                        />
                      </Col>
                    </FormGroup>

                    <div>
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>Product </th>
                            <th>Quantity</th>
                            <th>Unit </th>
                            <th>Rate</th>
                            <th>Driver Name</th>
                            <th>Vehicle Number</th>
                            <th>destination</th>
                            <th>Chalan Number</th>
                            <th>Transportation Fee</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <SelectOption
                              type="number"
                                name="productID"
                                value={saleItem.activeChildRecord.productID}
                                onChange={(e) => handleSalesInputChanges(e)}
                                options={productsId}
                                placeholder="Select product"
                              />
                              {/* <select
                                type="text"
                                name="productID"
                                value={saleItem.activeChildRecord.productID}
                                onChange={(e) => handleSalesInputChanges(e)}
                                className="form-control"
                              >
                                <option value="">Select product</option>
                                {productsId.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select> */}
                            </td>
                            <td>
                              <Input
                                 type="number"
                                name="quantity"
                                value={saleItem.activeChildRecord.quantity}
                                onChange={(e) => handleSalesInputChanges(e)}
                                className="form-control"
                              />
                            </td>
                            <td>
                              <SelectOption
                               type="number"
                                name="unitID"
                                value={saleItem.activeChildRecord.unitID}
                                onChange={(e) => handleSalesInputChanges(e)}
                                options={unitsId}
                                placeholder="Select unit"
                              />
                              {/* <select
                                type="text"
                                name="unitID"
                                value={saleItem.activeChildRecord.unitID}
                                onChange={(e) => handleSalesInputChanges(e)}
                                className="form-control"
                              >
                                <option value="">Select unit</option>
                                {unitsId.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select> */}
                            </td>
                            <td>
                              <Input
                                type="text"
                                name="rate"
                                value={saleItem.activeChildRecord.rate}
                                onChange={(e) => handleSalesInputChanges(e)}
                                className="form-control"
                              />
                            </td>
                            <td>
                              <select
                                type="number"
                                name="driverId"
                                value={saleItem.activeChildRecord.driverId}
                                onChange={(e) => handleSalesInputChanges(e)}
                                className="form-control"
                              >
                                <option value="">Select driver</option>
                                {isDriverEmploy.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>

                              <select
                               type="number"
                                name="vechileId"
                                value={saleItem.activeChildRecord.vechileId}
                                onChange={(e) => handleSalesInputChanges(e)}
                                className="form-control"
                              >
                                <option value="">Select vechile Number</option>
                                {isVehicleNo.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.vehicle_No}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <Input
                                 type="string"
                                name="destination"
                                value={saleItem.activeChildRecord.destination}
                                onChange={(e) => handleSalesInputChanges(e)}
                                className="form-control"
                              />
                            </td>
                            <td>
                              <Input
                                 type="string"
                                name="chalan_No"
                                value={saleItem.activeChildRecord.chalan_No}
                                onChange={(e) => handleSalesInputChanges(e)}
                                className="form-control"
                              />
                            </td>
                            <td>
                              <Input
                                 type="number"
                                name="transportation_Fee"
                                value={saleItem.activeChildRecord.transportation_Fee}
                                onChange={(e) => handleSalesInputChanges(e)}
                                className="form-control"
                              />
                            </td>
                            <td>
                              <ButtonGroup size="sm">

                                <Button
                                  size="sm"
                                  className="btn btn-soft-success"
                                  style={{ padding: "7px", display: "flex", marginBottom: "5px" }}
                                  onClick={handleAddSaleItem}
                                >
                                  +
                                </Button>

                              </ButtonGroup>
                            </td>
                          </tr>
                          {saleItem.advanceSummary &&
                            Array.isArray(saleItem.advanceSummary.vmSaleItem) ? (
                            saleItem.advanceSummary.vmSaleItem.map(
                              (item, index) => (
                                <tr key={item.key}>
                                  <td>
                                    <select
                                      type="number"
                                      name="productID"
                                      value={item.productID}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      className="form-control"
                                    >
                                      <option value="">Select product</option>
                                      {productsId.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <Input
                                   type="number"
                                      name="quantity"
                                      value={item.quantity}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      className="form-control"
                                    />
                                  </td>
                                  <td>
                                    <select
                                      type="number"
                                      name="unitID"
                                      value={item.unitID}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      className="form-control"
                                    >
                                      <option value="">Select unit</option>
                                      {unitsId.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <Input
                                     type="number"
                                      name="rate"
                                      value={item.rate}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      className="form-control"
                                    />
                                  </td>
                                  <td>

                                    <select
                                      type="number"
                                      name="driverId"
                                      value={item.driverId}
                                      onChange={(e) => handleEditTableInputChange(e, index)}

                                      className="form-control"
                                    >
                                      <option value="">Select drivername</option>
                                      {isDriverEmploy.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>

                                    <select
                                      type="number"
                                      name="vechileId"
                                      value={item.vechileId}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      className="form-control"
                                    >
                                      <option value="">Select vechileNumber</option>
                                      {isVehicleNo.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.vehicle_No}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <Input
                                     type="string"
                                      name="destination"
                                      value={item.destination}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      className="form-control"
                                    />
                                  </td>
                                  <td>
                                    <Input
                                     type="string"
                                      name="chalan_No"
                                      value={item.chalan_No}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      className="form-control"
                                    />
                                  </td>
                                  
                                  <td>
                                    <Input
                                     type="number"
                                      name="transportation_Fee"
                                      value={item.transportation_Fee}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      className="form-control"
                                    />
                                  </td>

                                  <td>
                                    <ButtonGroup size="sm">
                                      {/* <Button
                                        size="sm"
                                        type="Button"
                                        className="btn btn-soft-success"
                                        onClick={() => handleEditSaleItem(index)}
                                        disabled={
                                          saleItem.isChildRecordInEditMode &&
                                          saleItem.editChildRecordArrayIndex !== index
                                        }
                                      >
                                        <i className="ri-edit-line"></i>
                                      </Button> */}
                                      <Button
                                        size="sm"
                                        type="Button"
                                        className="btn btn-soft-danger"
                                        onClick={() => handleRemoveSaleItem(index)}
                                        disabled={saleItem.isChildRecordInEditMode}
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
                              <td colSpan="7">No sale item details</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>

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
          </div>
      </React.Fragment>
    
  );
};

export default SaleItemEditor;
