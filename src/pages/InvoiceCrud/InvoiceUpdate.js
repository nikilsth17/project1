import React, { useEffect, useState } from 'react'
import InvoiceServices from '../../services/AustServices/InvoiceSev/InvoiceServices';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Label,
    Input,
    ButtonToggle,
    Button,
    Form,
  } from "reactstrap";
  import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Spinner } from "reactstrap";
import Select from "react-select";
import CustomerAust from '../../services/AustServices/Customeraust/CustomerAust';
const InvoiceUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
   const [isShipmentId, setIsShipmentId] = useState([]);
   const [isSelectSelectShipment, setIsSelectSelectShipment] = useState(null);
  const [isCustomerId, setIsCustomerId] = useState([]);
   const [isSelectisCustomerId, setIsSelectisCustomerId] = useState(null);

   
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCustomer = await CustomerAust.getList();
        setIsCustomerId(fetchedCustomer);
        const fetchedDomestic = await GeneralServices.getDomesticServiceProvider();
        setIsShipmentId(fetchedDomestic);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const Customeroptions = isCustomerId.map((vendor) => ({
    value: vendor.id,
    label: `${vendor.firstName} ${vendor.lastName}`,
  }));

  const Shipmentoptions = isCustomerId.map((vendor) => ({
    value: vendor.id,
    label: vendor.firstName,
  }));

  const handleCustomerChange = (selectedOption) => {
    setIsSelectisCustomerId(selectedOption);
    formik.setFieldValue(
      "customerId",
      selectedOption?.value || null
    );
  };
  const validationSchema = Yup.object().shape({
   
    shipmentId: Yup.number().integer("Shipment ID must be an integer").min(1, "Shipment ID must be greater than 0"),
    customerId: Yup.number().integer("Customer ID must be an integer").min(1, "Customer ID must be greater than 0"),
    refNo: Yup.string().required("Reference number is required"),
    invoiceDate: Yup.date().required("Please select the invoice date"),
    dueDate: Yup.date()
      .required("Please select the due date")
      .min(Yup.ref('invoiceDate'), "Due date must be after the invoice date"),
    totalAmount: Yup.number()
      .positive("Total amount must be a positive number")
      .required("Total amount is required"),
    // Add more fields and their respective validation rules as needed
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return an empty string if the date string is empty or undefined
  
    // Regular expression to match the YYYY-MM-DD format
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const match = dateRegex.exec(dateString);
  
    if (!match) return dateString; // Return the date string if it doesn't match the expected format
  
    // Construct a new date string in the YYYY-MM-DD format
    return `${match[1]}-${match[2]}-${match[3]}`;
  };
  
  
  
    const formik = useFormik({
      initialValues: {
        id: 0,
        shipmentId: 0,
        customerId: 0,
        refNo: "",
        invoiceDate: "",
        dueDate: "",
        totalAmount: 0 // Assuming "status" is a boolean, you might want to initialize it accordingly
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        try {
          setIsSaving(true);
          if (isEditing) {
            // If there's an id, it's an update operation
            await InvoiceServices.update(id, values);
            toast.success("Invoice Updated Successfully", {
              autoClose: 3000,
            });
            console.log("Invoice updated successfully");
            navigate("/Invoice");
          } else {
            // If there's no id, it's a create operation
            // Handle this case as needed for your application
          }
        } catch (error) {
          console.error("Error creating/updating Good Invoice:", error);
        } finally {
          setIsSaving(false); // Set saving state back to false when operation finishes
        }
      },
    });
  
    const breadcrumbItems = [
      
      { title: '< Invoice ', link: '/Invoice' },
  
    ];
  
    useEffect(() => {
        if (id) {
          setIsEditing(true);
          InvoiceServices.view(id)
            .then((data) => {
              // Assuming 'data' represents the fetched invoice information
              formik.setValues({
                id: data.id || 0,
                shipmentId: data.shipmentId || 0,
                customerId: data.customerId || 0,
                refNo: data.refNo || "",
                invoiceDate: data.invoiceDate || "",
                dueDate: data.dueDate || "",
                totalAmount: data.totalAmount || 0,
              });
              setIsSelectisCustomerId({ value: data.customerId, label: data.customerName });
              setIsSelectSelectShipment({ value: data.shipmentId, label: data.shipmentName });
            })
            .catch((error) => console.error("Error fetching item:", error));
        } else {
          setIsEditing(false);
        }
      }, [id]);
      
  
    return (
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb title="Invoice Field"  breadcrumbItems={breadcrumbItems}  pageTitle="Invoice" />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                      <Label for="refNo" sm={2}>
                      Refrence No.:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                          id="refNo"
                          name="refNo"
                          value={formik.values.refNo}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.refNo && formik.errors.refNo
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.touched.refNo && formik.errors.refNo && (
                          <div className="invalid-feedback">
                            {formik.errors.refNo}
                          </div>
                        )}
                      </Col>
                      <Label for="totalAmount" sm={2}>
                      Total Amount:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                          id="totalAmount"
                          name="totalAmount"
                          value={formik.values.totalAmount}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.totalAmount && formik.errors.totalAmount
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.touched.totalAmount && formik.errors.totalAmount && (
                          <div className="invalid-feedback">
                            {formik.errors.totalAmount}
                          </div>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="shipmentId" sm={2}>
                      Shipment:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.name && formik.errors.name
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="invalid-feedback">
                            {formik.errors.name}
                          </div>
                        )}
                      </Col>
                      <Label for="customerId" sm={2}>
                      Customer:
                    </Label>
                    <Col sm={4}>
                      <Select
                        name="customerId"
                        id="customerId"
                        value={isSelectisCustomerId}
                        onChange={handleCustomerChange}
                        options={Customeroptions}
                        className={`${
                          formik.touched.customerId &&
                          formik.errors.customerId
                            ? "is-invalid"
                            : ""
                        }`}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.customerId &&
                        formik.errors.customerId && (
                          <div className="invalid-feedback">
                            {formik.errors.customerId}
                          </div>
                        )}
                    </Col>
                    </FormGroup>
                    <FormGroup row>
  <Label for="invoiceDate" sm={2}>
    Invoice Date:
  </Label>
  <Col sm={4}>
    <Input
      type="date"
      id="invoiceDate"
      name="invoiceDate"
      value={formatDate(formik.values.invoiceDate)}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className={`form-control ${
        formik.touched.invoiceDate && formik.errors.invoiceDate
          ? "is-invalid"
          : ""
      }`}
    />
    {formik.touched.invoiceDate && formik.errors.invoiceDate && (
      <div className="invalid-feedback">
        {formik.errors.invoiceDate}
      </div>
    )}
  </Col>
  <Label for="dueDate" sm={2}>
    Due Date:
  </Label>
  <Col sm={4}>
    <Input
      type="date"
      id="dueDate"
      name="dueDate"
      value={formatDate(formik.values.dueDate)}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className={`form-control ${
        formik.touched.dueDate && formik.errors.dueDate
          ? "is-invalid"
          : ""
      }`}
    />
    {formik.touched.dueDate && formik.errors.dueDate && (
      <div className="invalid-feedback">
        {formik.errors.dueDate}
      </div>
    )}
  </Col>
</FormGroup>
                    <div className="text-end">
                    <Button
    onClick={() => {
      setIsCanceling(true);
      setTimeout(() => {
        navigate("/Invoice");
        setIsCanceling(false);
      }, 1000); // Simulating a delay of 1 second before navigating and setting isCanceling back to false
    }}
    className="btn btn-danger me-2"
    disabled={isCanceling || isSaving}
  >
    {isCanceling ? (
      <>
        <Spinner size="sm" color="light" className="me-2" /> Canceling...
      </>
    ) : (
      "Cancel"
    )}
  </Button>
  
                      <Button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? (
              <>
                <Spinner size="sm" color="light" className="me-2" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
  )
}

export default InvoiceUpdate