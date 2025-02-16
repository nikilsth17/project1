import React, { useState,useEffect } from 'react';
import * as Yup from 'yup';
import { FormGroup, Label, Col, Row, Input, Button, CardBody, Card, Table, Modal, ModalHeader, ModalBody, ModalFooter, Container, ButtonToggle } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import ProductsServices from '../../../services/Inventory Services/ProductsServices';
import UnitsService from '../../../services/Inventory Services/UnitsService';
import EmployeeService from '../../../services/HRService/EmployeeService';
import VehicleServices from '../../../services/Inventory Services/VehicleServices';
import CustomerServices from '../../../services/Inventory Services/CustomerServices';
import SelectOption from '../../Pages/Starter/Selectoption';
import DatePicker from 'react-flatpickr';
import SalesServices from '../../../services/Inventory Services/SalesServices';

// const validationSchema = Yup.object().shape({
//   transactionDate: Yup.date().required('Transaction date is required'),
//   remarks: Yup.string().required('Remarks is required'),
//   sales: Yup.array().of(
//     Yup.object().shape({
//       productID: Yup.number().required('Product ID is required'),
//       quantity: Yup.number().required('Quantity is required'),
//       unitID: Yup.number().required('Unit ID is required'),
//       rate: Yup.number().required('Rate is required'),
//       driverId: Yup.number().required('Driver ID is required'),
//       vehicleId: Yup.number().required('Vehicle ID is required'),
//       destinationAddress: Yup.string().required('Destination address is required'),
//       chalan_Number: Yup.string().required('Chalan number is required'),
//       transactionFee: Yup.number().required('Transaction fee is required'),
//       customerId: Yup.number().required('Customer ID is required'),
//       invoice_No: Yup.string().required('Invoice number is required'),
//     }),
//   ),
// });

const BulkSalesEditor = () => {
  const [formValues, setFormValues] = useState({
    transactionDate: '',
    remarks: '',
    sales: [],
  });
  const [customerId, setCustomerId] = useState([]);
  const [productsId, setProductsId] = useState([]);
  const [unitsId, setUnitsId] = useState([]);
  const [isDriverEmploy, setIsDriverEmploy] = useState([]);
  const [isVehicleNo, setIsVehicleNo] = useState([]);
  
  const [showFeeInput, setShowFeeInput] = useState(false);
//   const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSale, setNewSale] = useState({
    productID: '',
    quantity: '',
    unitID: '',
    rate: '',
    driverId: '',
    vehicleId: '',
    destinationAddress: '',
    chalan_Number: '',
    transactionFee: '',
    customerId: '',
    invoice_No: '',
  });

  
 useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCustomer = await CustomerServices.getList();
        setCustomerId(fetchedCustomer);

        const fetchedProducts = await ProductsServices.getList();
        setProductsId(fetchedProducts);
        console.log(fetchedProducts);

        const fetchedUnits = await UnitsService.getList();
        setUnitsId(fetchedUnits);

        const fetchedEmploy = await EmployeeService.getList();
        setIsDriverEmploy(fetchedEmploy);

        const fetchedVehicleno = await VehicleServices.getList();
        setIsVehicleNo(fetchedVehicleno);


      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSale({
      ...newSale,
      [name]: value,
    });
  };

  const handleInputChangeModal = (e) => {
    const { name, value } = e.target;
    setNewSale({
      ...newSale,
      [name]: value,
    });
  };

  const handleAddSale = () => {
    setModalOpen(true);
  };

  const handleSaveSale = () => {
    const saleToAdd = {
        ...newSale,
        fee: showFeeInput ? newSale.fee : '', // Include the fee property based on showFeeInput state
      };

    setFormValues({
      ...formValues,
      sales: [...formValues.sales,  saleToAdd],
    });
    setModalOpen(false);
    setNewSale({
      productID: '',
      quantity: '',
      unitID: '',
      rate: '',
      driverId: '',
      vehicleId: '',
      destinationAddress: '',
      chalan_Number: '',
      transactionFee: '',
      customerId: '',
      invoice_No: '',
      fee: '', // Clear fee after saving
    });
  };

  const handleRemoveSale = (index) => {
    const updatedSales = formValues.sales.filter((sale, i) => i !== index);
    setFormValues({
      ...formValues,
      sales: updatedSales,
    });
  };

  const handleToggleStatus = () => {
    setNewSale({
      ...newSale,
      transactionFee: !newSale.transactionFee,
      fee: '',
    });
     // Show fee input field when toggling to "Office Vehicle"
     setShowFeeInput(!newSale.transactionFee); // Update the state based on the new value of transactionFee
   
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If there's no id, it's a create operation
      const response = await SalesServices.createBulkSales(formValues);
      toast.success("Customer Added Successfully", { autoClose: 3000 });

      console.log("Category created:", response);
      // Redirect to the item list after create/update
      navigate("/sales");
    } catch (error) {
      console.error("Error creating/updating category:", error);
    }
  };
  

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Sales Item Form" pageTitle="Sales_Item" />
        <Container fluid>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <FormGroup row>
                    <Label htmlFor="transactionDate" sm={2}>
                      Transaction Date:
                    </Label>
                    <Col sm={4}>
                      <DatePicker
                        id="transactionDate"
                        name="transactionDate"
                        className="form-control"
                        value={formValues.transactionDate}
                        onChange={(date) => setFormValues({...formValues, transactionDate: date[0]})}
                      />
                    {/* {errors['productID'] && <div className="error-message">{errors['productID']}</div>}
        */}
                    </Col>
                    <Label htmlFor="remarks" sm={2}>
                      Remarks:
                    </Label>
                    <Col sm={4}>
                      <Input
                        id="remarks"
                        name="remarks"
                        className="form-control"
                        onChange={(e) => setFormValues({...formValues, remarks: e.target.value})}
                        value={formValues.remarks}
                      />
                  {/* {errors['remarks'] && <div className="error-message">{errors['remarks']}</div>}
        */}
                    </Col>
                  </FormGroup>
                  <Table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Rate</th>
                        <th>Driver</th>
                        <th>vechile Number</th>
                        <th>Destination Address</th>
                        <th>Chalan Number</th>
                        
                        <th>Customer</th>
                        <th>Invoice No.</th>
                        <th>Transaction Fee</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formValues.sales.map((sale, index) => (
                        <tr key={index}>
                          <td>{sale.productID}</td>
                          <td>{sale.quantity}</td>
                          <td>{sale.unitID}</td>
                          <td>{sale.rate}</td>
                          <td>{sale.driverId}</td>
                          <td>{sale.vechileId}</td>
                          <td>{sale.destinationAddress}</td>
                          <td>{sale.chalan_Number}</td>
                          
                          <td>{sale.customerId}</td>
                          <td>{sale.invoice_No}</td>
                          <td>{sale.transactionFee}</td>
                          <td>
                          <Button
                                        size="sm"
                                        type="Button"
                                        className="btn btn-soft-danger"
                                        onClick={() => handleRemoveSale(index)}
                                        // disabled={saleItem.isChildRecordInEditMode}
                                      >
                                        <i className="ri-delete-bin-5-fill"></i>
                                      </Button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                      
        <td colSpan="11" className='text-end'>
          <Button
            size="sm"
            className="btn btn-soft-success text-end"
            onClick={handleAddSale}
          >
            +
          </Button>
        </td>
   
    </tr>
</tbody>
                  </Table>
                  <FormGroup row>
                      <Col sm={12} className="text-end">
                        <Button type="submit" color="primary">
                          Save
                        </Button>
                      </Col>
                    </FormGroup>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
          <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Add Sale</ModalHeader>
          <ModalBody>
            <form>
            <FormGroup row>
                <Label for="productID" sm={2}>Product:</Label>
                <Col sm={4}>
                <SelectOption
                              type="number"
                                name="productID"
                                value={newSale.productID}
                                onChange={handleInputChangeModal}
                                   options={productsId}
                                placeholder="Select product"
                              />
  </Col>
              
                <Label for="quantity" sm={2}>Quantity:</Label>
                <Col sm={4}>
                <Input
                                   type="number"
                                      name="quantity"
                                      value={newSale.quantity}
                                      onChange={handleInputChangeModal}
                                          className="form-control"
                                    />
  </Col>
              
              </FormGroup>
              <FormGroup row>
                <Label for="unitID" sm={2}>Unit:</Label>
                <Col sm={4}>
                <SelectOption
                              type="number"
                                name="unitID"
                                value={newSale.unitID}
                                onChange={handleInputChangeModal}
                                   options={unitsId}
                                placeholder="Select Unit"
                              />
  </Col>
             
                <Label for="rate" sm={2}>Rate:</Label>
                <Col sm={4}>
                <Input
                                   type="number"
                                      name="rate"
                                      value={newSale.rate}
                                      onChange={handleInputChangeModal}
                                          className="form-control"
                                    />
  </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="driverId" sm={2}>driverId:</Label>
                <Col sm={4}>
                <SelectOption
                              type="number"
                                name="driverId"
                                value={newSale.driverId}
                                onChange={handleInputChangeModal}
                                   options={isDriverEmploy}
                                placeholder="Select driver"
                              />
 </Col>
              
                <Label for="vechileId" sm={2}>vechileId:</Label>
                <Col sm={4}>
                <select
                                      type="number"
                                      name="vechileId"
                                      value={newSale.vechileId}
                                       onChange={handleInputChangeModal}
                                     className="form-control"
                                    >
                                      <option value="">Select vechileNumber</option>
                                      {isVehicleNo.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.vehicle_No}
                                        </option>
                                      ))}
                                    </select>
  </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="destinationAddress" sm={2}>Destination Address:</Label>
                <Col sm={4}>
                <Input
                                   type="text"
                                      name="destinationAddress"
                                      value={newSale.destinationAddress}
                                      onChange={handleInputChangeModal}
                                          className="form-control"
                                    />
  </Col>
            
                <Label for="chalan_Number" sm={2}>Chalan Number:</Label>
                <Col sm={4}>
                <Input
                                   type="text"
                                      name="chalan_Number"
                                      value={newSale.chalan_Number}
                                      onChange={handleInputChangeModal}
                                          className="form-control"
                                    />
  </Col>
              </FormGroup>
             
              <FormGroup row>
                <Label for="customerId" sm={2}>Customer:</Label>
                <Col sm={4}>
                <SelectOption
                              type="number"
                                name="customerId"
                                value={newSale.customerId}
                                onChange={handleInputChangeModal}
                                   options={customerId}
                                placeholder="Select Customer"
                              />
 </Col>
              
                <Label for="invoice_No" sm={2}>invoice_No:</Label>
                <Col sm={4}>
                <Input
                                   type="text"
                                      name="invoice_No"
                                      value={newSale.invoice_No}
                                      onChange={handleInputChangeModal}
                                          className="form-control"
                                    />
  </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="transactionFee" sm={4}>Transportation Fee:</Label>
                <Col sm={4}>
                
                <Input
                                   type="text"
                                      name="transactionFee"
                                      value={newSale.transactionFee}
                                      onChange={handleInputChangeModal}
                                          className="form-control"
                                    />
  

                    
                {/* <ButtonToggle
                               
                                      onClick={handleToggleStatus}
color={newSale.transactionFee ? "success" : "danger"}
                                      className="ml-3"


                                      value={newSale.chalan_Number}
                                      onChange={handleInputChangeModal}
                                         
                                    >
                                          {newSale.transactionFee ? "Office Vehicle " : "Customer Vehicle"}
                        </ButtonToggle> */}
                        
          {/* <FormGroup row>
            <Label for="transactionFee" sm={4}>transactionFee:</Label>
            <Input
              type="number"
              name="fee"
              value={newSale.transactionFee}
              onChange={handleInputChangeModal}
              className="form-control"
            />
            </FormGroup> */}
       
</Col>
              
              </FormGroup>
              

              
            
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSaveSale}>
              Save
            </Button>
            <Button color="secondary" onClick={() => setModalOpen(!modalOpen)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
       
        </Container>
      </div>
    </React.Fragment>
  );
};

export default BulkSalesEditor;
