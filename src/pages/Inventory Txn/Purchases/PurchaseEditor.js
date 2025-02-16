import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonGroup,
} from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutWithBreadCrumb from '../../Pages/Starter/LayoutWithBreadCrumb';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import PurchasesServices from '../../../services/Inventory Services/PurchasesServices';
import ProductsServices from '../../../services/Inventory Services/ProductsServices';
import UnitsService from '../../../services/Inventory Services/UnitsService';
import VendorsServices from '../../../services/Inventory Services/VendorServices';
import { useEffect } from 'react';
import * as Yup from 'yup';
import DatePicker from 'react-flatpickr';




const PurchaseEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const idValue = id || 0;

  const [formData, setFormData] = useState({
    editRecordID: idValue,
    isInEditMode: !!id,
    isChildRecordInEditMode: false,
    activeChildRecord: {
 key: "k_0",
      id: 0,
      productID: '',
      quantity: '',
      unitID: '',
      rate: '',
      mgf_Date: '',
      exp_Date: '',
      batch_No: '',
    },
    editChildRecordArrayIndex: 0,
    advanceSummary: {
   
      purchase_Date: '',
      vendorID: '',
      invoice_No: '',
      remarks: '',
      disc_Amt: "",
      vmPurchaseItems: [],
    }
  });
  const [productsId, setProductsId] = useState([]);
  const [unitsId, setUnitsId] = useState([]);
  const [vendorsId, setVendorsId] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const defaultDate = '2023-01-01'; // Example default date
  if (isNaN(Date.parse(formData.advanceSummary.purchase_Date))) {
    formData.advanceSummary.purchase_Date = defaultDate;
  }
  

  const validationSchema = Yup.object().shape({
    purchase_Date: Yup.date().nullable().required('Purchase date is required'),

    vendorID: Yup.number().required('Vendor is required'),
    invoice_No: Yup.string().required('Invoice number is required'),
    remarks: Yup.string().required('Remarks are required'),
    disc_Amt: Yup.number().required('Discount amount is required'),
    // vmPurchaseItems: Yup.array().of(
    //   Yup.object().shape({
    //     productID: Yup.number().required('Product ID is required'),
    //     // Add other validations for fields within vmPurchaseItems
    //   })
    // ),
  });

  const validateData = async () => {
    try {
      await validationSchema.validate(formData.advanceSummary, { abortEarly: false });
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
        console.error("Validation errors not found or in unexpected format:", validationErrors);
      }
      return false;
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await ProductsServices.getList();
        setProductsId(fetchedProducts);

        const fetchedUnits = await UnitsService.getList();
        setUnitsId(fetchedUnits);

        const fetchedVendors = await VendorsServices.getList();
        setVendorsId(fetchedVendors);
 if (formData.isInEditMode) {
          await getRelatedDataFromAPI();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [formData.isInEditMode,formData.editRecordID]);


  async function getRelatedDataFromAPI() {
    try {
      if (formData.editRecordID <= 0) {
        return;
      }

      const apiResponse = await PurchasesServices.view(formData.editRecordID);
      apiResponse.vmPurchaseItems = apiResponse.vmPurchaseItemDetails;

      const updatedApiResponse = {
        ...apiResponse,
        purchase_Date: apiResponse.date,
        vendorID: apiResponse.vendorId,
        vmPurchaseItems: apiResponse.vmPurchaseItemDetails.map((detail) => ({
          ...detail,
          mgf_Date:detail.mgf_Date? detail.mgf_Date.split("T")[0] : "",
          exp_Date:detail.exp_Date? detail.exp_Date.split("T")[0] : "",
          
          key: "o_" + detail.id,

        })),
      };

      setFormData((prevData) => ({
        ...prevData,

        advanceSummary: updatedApiResponse,
      }));

    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }

  useEffect(() => {
    if (formData.editRecordID > 0) {
      getRelatedDataFromAPI(formData.editRecordID);
  } else {
      //set default blank form... which is already done
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        [name]: value
      },
    }));
  };

  const handleTableInputChange = (event, index) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      activeChildRecord: {
        ...prevData.activeChildRecord,
        [name]: value,
      },
    }));
  };


  const handleEditTableInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedPurchaseItems = [...formData.advanceSummary.vmPurchaseItems];

    updatedPurchaseItems[index] = {
      ...updatedPurchaseItems[index],
      [name]: value,
    };

    setFormData((prevData) => ({
      ...prevData,
      advanceSummary: {
        ...prevData.advanceSummary,
        vmPurchaseItems: updatedPurchaseItems,
      },
    }));
  };

  const handleTableDetailIncrease = () => {
    const newPurchaseItem = { ...formData.activeChildRecord };
    setFormData((prevMasterData) => ({
      ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmPurchaseItems: [
          ...prevMasterData.advanceSummary.vmPurchaseItems,
          newPurchaseItem ,
        ],
      },
      isChildRecordInEditMode: false,
      editChildRecordArrayIndex: -1,
      activeChildRecord: {
        key: `k_${-1 * prevMasterData.advanceSummary.vmPurchaseItems.length}`,
        id: 0,
      productID: '',
      quantity: '',
      unitID: '',
      rate: '',
      mgf_Date: '',
      exp_Date: '',
      batch_No: '',
    },
 }));
  };

  const handleTAbleDetailDecrease = (index) => {
  const updatedTransactionDetails = [
      ...formData.advanceSummary.vmPurchaseItems,
    ];
updatedTransactionDetails.splice(index, 1);
    setFormData((prevMasterData) => ({
     ...prevMasterData,
      advanceSummary: {
        ...prevMasterData.advanceSummary,
        vmPurchaseItems: updatedTransactionDetails,
     
      },
    }));
  };

  const handleTableDetailEdit = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      editChildRecordArrayIndex: index,
      isChildRecordInEditMode: true,
      activeChildRecord: {
        ...prevData.advanceSummary.vmPurchaseItems[index],
      },
    }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateData();
  
    if (!isValid) {
      return; // If data is invalid, stop further execution
    }

    try {
     
      const activeChild = formData.activeChildRecord;
  
      if (
        activeChild.productID > 0 &&
        activeChild.quantity.length > 0 &&
        activeChild.unitID > 0 &&
        activeChild.rate.length > 0 &&
        activeChild.mgf_Date.length > 0 &&
        activeChild.exp_Date.length > 0 &&
        activeChild.batch_No.length > 0
      ) {
        formData.advanceSummary.vmPurchaseItems.push(activeChild);
      }
  
      if (formData.isInEditMode) {
        const updatedPurchase = await PurchasesServices.update(
          formData.editRecordID,
          formData.advanceSummary
        );
        console.log(updatedPurchase);
      } else {
        const newPurchase = await PurchasesServices.create(formData.advanceSummary);
        console.log(newPurchase);
      }
  
      navigate("/purchases");
    } catch (error) {
     
        console.error('Error:', error);
      }
    
  };
  

  return (
    
      <React.Fragment>
        <div className='page-content'>
          <BreadCrumb title="Purchase Fields" pageTitle="Purchase" />
          <Container fluid >
            <Row>
              <Col>
                <Card>
                  <CardHeader />
                  <CardBody>
                    <Form onSubmit={handleSubmit}>
                      <FormGroup row>
                       
                          <Label for="purchase_Date" sm={2}>Purchase Date:</Label>
                        
                          <Col sm={4}>
                          <DatePicker
                            type="date"
                            name="purchase_Date"
                            id="purchase_Date"
                            value={formData.advanceSummary.purchase_Date.split("T")[0] .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                           .substring(0, 10)}
                           onChange={(date) => setFormData({...formData, purchase_Date: date[0]})}
                           className={`form-control ${
                            errors.purchase_Date ? "is-invalid" : "is-valid"
                          }`}
                          onBlur={validateData}
                        
                          />
                     
                     {errors.purchase_Date && (
                          <div className="invalid-feedback">{errors.purchase_Date}</div>
                        )}
                             </Col>
                     
                          <Label for="vendorID" sm={2}>Vendor: </Label>
                        
                          <Col sm={4}>
                          <select
                            // type="number"
                            name="vendorID"
                            id="vendorID"
                            value={formData.advanceSummary.vendorID}
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.vendorID ? "is-invalid" : "is-valid"
                            }`}
                            onBlur={validateData}
                           
                          >
                            <option value="">Select vendor</option>
                            {vendorsId.map((vendor) => (
                              <option
                                key={vendor.id}
                                value={vendor.id}
                              >
                                {vendor.name}
                              </option>
                            ))}
                          </select>
                          {errors.vendorID && (
                          <div className="invalid-feedback">{errors.vendorID}</div>
                        )}
                        </Col>
                        </FormGroup>
                        <FormGroup row>
                       
                          <Label for="invoice_No" sm={2}>Invoice No:</Label>
                           
                           <Col sm={4}>
                          <Input
                            type="string"
                            name="invoice_No"
                            id="invoice_No"
                            value={formData.advanceSummary.invoice_No}
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.invoice_No ? "is-invalid" : "is-valid"
                            }`}
                            onBlur={validateData}
                       
                          />
                           {errors.invoice_No && (
                          <div className="invalid-feedback">{errors.invoice_No}</div>
                        )}
                        </Col>
                     
                          <Label for="remarks" sm={2}>Remarks:</Label>
                       
                          <Col sm={4}>
                          <Input
                            type="string"
                            name="remarks"
                            id="remarks"
                            value={formData.advanceSummary.remarks}
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.remarks ? "is-invalid" : "is-valid"
                            }`}
                            onBlur={validateData}
                         
                          />
                           {errors.remarks && (
                          <div className="invalid-feedback">{errors.remarks}</div>
                        )}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                    
                          <Label for="disc_Amt" sm={2}>Discount Amount:</Label>
                         
                          <Col sm={4}>
                          <Input
                            type="number"
                            name="disc_Amt"
                            id="disc_Amt"
                            value={formData.advanceSummary.disc_Amt}
                            onChange={handleInputChange}
                            className={`form-control ${
                              errors.disc_Amt ? "is-invalid" : "is-valid"
                            }`}
                            onBlur={validateData}
                           
                          />
                           {errors.disc_Amt && (
                          <div className="invalid-feedback">{errors.disc_Amt}</div>
                        )}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Table bordered>
                          <thead>
                            <tr>
                              <th>Product </th>
                              <th>Quantity</th>
                              <th>Unit </th>
                              <th>Rate</th>
                              <th>Mfg_Date</th>
                              <th>Exp_Date</th>
                              <th>Batch_No</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <select
                                  type="number"
                                  name="productID"
                                  id="productID"
                                  value={formData.activeChildRecord.productID}
                                  onChange={(e) => handleTableInputChange(e)}
                                  className={`form-control ${
                                    errors.productID ? "is-invalid" : "is-valid"
                                  }`}
                                  onBlur={validateData}
                                 
                                 
                                >
                                  <option value="">Select product</option>
                                  {productsId.map((product) => (
                                    <option
                                      key={product.id}
                                      value={product.id}
                                    >
                                      {product.name}
                                    </option>
                                  ))}
                                </select>
                                {errors.productID && (
                          <div className="invalid-feedback">{errors.productID}</div>
                        )}
                              </td>
                              <td>
                                <Input
                                  type="number"
                                  name="quantity"
                                  id="quantity"
                                  value={formData.activeChildRecord.quantity}
                                  onChange={(e) => handleTableInputChange(e)}
                                  
                                />
                              </td>
                              <td>
                                <select
                                  type="number"
                                  name="unitID"
                                  id="unitID"
                                  value={formData.activeChildRecord.unitID}
                                  onChange={(e) => handleTableInputChange(e)}
                                  className="form-control"
                                 
                                >
                                  <option value="">Select unit</option>
                                  {unitsId.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                      {unit.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <Input
                                  type="number"
                                  name="rate"
                                  id="rate"
                                  value={formData.activeChildRecord.rate}
                                  onChange={(e) => handleTableInputChange(e)}
                                  
                                />
                              </td>
                              <td>
                                <Input
                                  type="date"
                                  name="mgf_Date"
                                  id="mgf_Date"
                                  value={formData.activeChildRecord.mgf_Date
                                    .split("T")[0]
                                    .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                                    .substring(0, 10)}
                                  onChange={(e) => handleTableInputChange(e)}
                                
                                />
                              </td>
                              <td>
                                <Input
                                  type="date"
                                  name="exp_Date"
                                  id="exp_Date"
                                  value={formData.activeChildRecord.exp_Date.split("T")[0]
                                  .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                                  .substring(0, 10)}
                                  onChange={(e) => handleTableInputChange(e)}
                                 
                                />
                              </td>
                              <td>
                                <Input
                                  type="string"
                                  name="batch_No"
                                  id="batch_No"
                                  value={formData.activeChildRecord.batch_No}
                                  onChange={(e) => handleTableInputChange(e)}
                                 
                                />
                              </td>
                              <td>
                                <ButtonGroup size='sm'>
                                  <Button
                                  
                                  size="sm"
                                  className="btn btn-soft-success"
                                  style={{ padding: "7px", display: "flex", marginBottom: "5px" }}
                                    onClick={handleTableDetailIncrease}
                                  >
                                    +
                                  </Button>
                                </ButtonGroup>
                              </td>
                            </tr>
                            {formData.advanceSummary && Array.isArray(formData.advanceSummary.vmPurchaseItems) ? (
                              formData.advanceSummary.vmPurchaseItems.map((purchaseRecord, index) => (
                                <tr key={purchaseRecord.key}>
                                  <td>
                                    <select
                                      type="number"
                                      name="productID"
                                      id="productID"
                                      value={purchaseRecord.productID}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      className="form-control"
                                    
                                    >
                                      <option value="">Select product</option>
                                      {productsId.map((product) => (
                                        <option
                                          key={product.id}
                                          value={product.id}
                                        >
                                          {product.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <Input
                                      type="number"
                                      name="quantity"
                                      id="quantity"
                                      value={purchaseRecord.quantity}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      
                                    />
                                  </td>
                                  <td>
                                    <select
                                      type="number"
                                      name="unitID"
                                      id="unitID"
                                      value={purchaseRecord.unitID}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      className="form-control"
                                     
                                    >
                                      <option value="">Select unit</option>
                                      {unitsId.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                          {unit.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <Input
                                      type="number"
                                      name="rate"
                                      id="rate"
                                      value={purchaseRecord.rate}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="date"
                                      name="mgf_Date"
                                      id="mgf_Date"
                                      value={purchaseRecord.mgf_Date}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                     
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="date"
                                      name="exp_Date"
                                      id="exp_Date"
                                      value={purchaseRecord.exp_Date}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                      
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="text"
                                      name="batch_No"
                                      id="batch_No"
                                      value={purchaseRecord.batch_No}
                                      onChange={(e) => handleEditTableInputChange(e, index)}
                                 
                                    />
                                  </td>
                                  <td>
                                    <ButtonGroup size='sm'>
                                      {/* <Button
                                        color="success"
                                        onClick={() => handleTableDetailEdit(index)}
                                        disabled={
                                          formData.isChildRecordInEditMode &&
                                          formData.editChildRecordArrayIndex !== index
                                        }
                                      >
                                        <i className="ri-edit-line"></i>
                                      </Button> */}
                                      <Button
                                             size="sm"
                                             type="Button"
                                             className="btn btn-soft-danger"
                                        onClick={() => handleTAbleDetailDecrease(index)}
                                        disabled={formData.isChildRecordInEditMode}
                                      >
                                        <i className="ri-delete-bin-5-fill"></i>
                                      </Button>
                                    </ButtonGroup>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6">No Purchase details</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </FormGroup>
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
      </React.Fragment>
    
  );
}

export default PurchaseEditor;
