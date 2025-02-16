import React, { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Input,
  Label,
  Col,
  Row,
  ButtonToggle,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import ProductCategoriesServices from "../../../services/Inventory Services/ProductCategoriesServices";
import UnitsService from "../../../services/Inventory Services/UnitsService";
import ProductsServices from "../../../services/Inventory Services/ProductsServices";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import * as Yup from 'yup';
import toast from "react-hot-toast";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";

const PEditor = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    id: 0,
    code: "",
    name: "",
    categoryID: "",
    description: "",
    unitID: "",
    last_CP: "",
    last_SP: "",
    opening_Qty: "",
    ledger_Code: "",
    status: true,
    enable_Stock: true,
    is_Taxable: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [PcategoryID, setPcategoryID] = useState([]);
  const [UcategoryID, setUcategoryID] = useState([]);

  const validationSchema = Yup.object().shape({
    code: Yup.string().required('Please enter a code'),
    name: Yup.string().required('Please enter a product name'),
    categoryID: Yup.string().required('Please select a category'),
    description: Yup.string().required('Please enter a description'),
    last_CP: Yup.number().required('Please enter the cost price').typeError('Please enter a valid number'),
    unitID: Yup.string().required('Please select a unit'),
    last_SP: Yup.number().required('Please enter the selling price').typeError('Please enter a valid number'),
    opening_Qty: Yup.number().required('Please enter the opening quantity').typeError('Please enter a valid number'),
    ledger_Code: isEditing ? Yup.string() : Yup.string().required('Please enter the ledger code'),
    // Add more validations for other fields as needed
  });

  const [errors, setErrors] = useState({});

  
  const validateData = async () => {
    try {
      await validationSchema.validate(data, { abortEarly: false });
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

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    console.log(data);
  };

  const handleToggleStatus = () => {
    setData({
      ...data,
      status: !data.status,
    });
  };

  const handleEnable_Stock = () => {
    setData({
      ...data,
      enable_Stock: !data.enable_Stock,
    });
  };

  const handleis_Taxable = () => {
    setData({
      ...data,
      is_Taxable: !data.is_Taxable,
    });
  };

  async function fetchPosts() {
    try {
      const fetchedPosts = await ProductCategoriesServices.getList();
      console.log("Fetched Posts:", fetchedPosts);
      setPcategoryID(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  async function fetchUnitIDs() {
    try {
      const unitData = await UnitsService.getList();
      console.log("Fetched Units:", unitData);
      setUcategoryID(unitData);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  }

  useEffect(() => {
    fetchPosts();
    fetchUnitIDs();
  }, []);

  useEffect(() => {
    if (id) {
      // If there's an id, it means we are editing an existing category
      setIsEditing(true);
      ProductsServices.view(id)
        .then((product) => {
          setData(product);
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
      setData(data);
    }
  }, [id]);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateData();
  
    if (!isValid) {
      return; // If data is invalid, stop further execution
    }
  
    try {
      if (isEditing) {
        // If there's an id, it's an update operation
        await ProductsServices.update(id, data);
        toast.success("Product Updated Successfully", { autoClose: 3000 });
        console.log("Product updated successfully");
      } else {
        // If there's no id, it's a create operation
        const response = await ProductsServices.create(data);
        toast.success("Product Added Successfully", { autoClose: 3000 });
  
        console.log("Product created:", response);
        // Redirect to the item list after create/update
      }
      navigate("/product");
    } catch (error) {
      console.error("Error creating/updating Product:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Product Form" pageTitle="Product" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                  <form onSubmit={handleSubmit}>
                  <FormGroup row>
                    <Label for="Code" sm={2}>
                      Code:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="string"
                        id="Code"
                        value={data.code}
                        name="code"
                        onChange={handleInputChange}
                      
                        className={`form-control ${
                          errors.code ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      />
                      {errors.code && (
                          <div className="invalid-feedback">{errors.code}</div>
                        )}
                    </Col>
                    <Label for="name" sm={2}>
                     Product:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="string"
                        id="name"
                        value={data.name}
                        name="name"
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.name ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      />
                       {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="CategoryID" sm={2}>
                      Category:
                    </Label>
                    <Col sm={4}>
                      <select
                        type="string"
                      
                        name="categoryID"
                        value={data.categoryID}
                        onChange={(e) => handleInputChange(e)}
                        className={`form-control ${
                          errors.categoryID ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      >
                        <option value="">Select Category</option>
                        {PcategoryID.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryID && (
                          <div className="invalid-feedback">{errors.categoryID}</div>
                        )}
                    </Col>
                    <Label for="Description" sm={2}>
                      Description:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="string"
                        id="description"
                        value={data.description}
                        name="description"
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.description ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                       
                      />
                       {errors.description && (
                          <div className="invalid-feedback">{errors.description}</div>
                        )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="last_CP" sm={2}>
                      Cost Price:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="number"
                        id="last_CP"
                        value={data.last_CP}
                        name="last_CP"
                        onChange={handleInputChange}
                      
                        className={`form-control ${
                          errors.last_CP ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      />
                       {errors.name && (
                          <div className="invalid-feedback">{errors.last_CP}</div>
                        )}
                    </Col>
                    <Label for="UnitID" sm={2}>
                      Unit:
                    </Label>
                    <Col sm={4}>
                      <select
                        type="string"
                       
                        name="unitID"
                        value={data.unitID}
                        onChange={(e) => handleInputChange(e)}
                        className={`form-control ${
                          errors.unitID ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      >
                        <option value=""> Select Unit</option>
                        {UcategoryID.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      {errors.unitID && (
                          <div className="invalid-feedback">{errors.unitID}</div>
                        )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="last_SP" sm={2}>
                      Selling Price:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="number"
                        id="last_SP"
                        value={data.last_SP}
                        name="last_SP"
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.last_SP ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      />
                       {errors.last_SP && (
                          <div className="invalid-feedback">{errors.last_SP}</div>
                        )}
                    </Col>
                    <Label for="opening_Qty" sm={2}>
                      Opening Quantity:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="number"
                        id="opening_Qty"
                        value={data.opening_Qty}
                        name="opening_Qty"
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.opening_Qty ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      />
                       {errors.opening_Qty && (
                          <div className="invalid-feedback">{errors.opening_Qty}</div>
                        )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                  {!isEditing || !data.id ? (
                      <>
                    <Label for="ledger_Code" sm={2}>
                      Ledger Code:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="string"
                        id="ledger_Code"
                        value={data.ledger_Code}
                        name="ledger_Code"
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.ledger_Code ? "is-invalid" : "is-valid"
                        }`}
                        onBlur={validateData}
                      />
                     {errors.ledger_Code && (
                          <div className="invalid-feedback">{errors.ledger_Code}</div>
                        )}
                    </Col>
                    </>
                      ) : null}
                    <Label for="Status" sm={2}>
                      Status:
                    </Label>
                    <Col sm={4}>
                      <ButtonToggle
                        onClick={handleToggleStatus}
                        color={data.status ? "success" : "danger"}
                        className="ml-3"
                      >
                        {data.status ? "Active" : "Inactive"}
                      </ButtonToggle>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="enable_Stock" sm={2}>
                      Stock:
                    </Label>
                    <Col sm={4}>
                      <ButtonToggle
                        onClick={handleEnable_Stock}
                        color={data.enable_Stock ? "success" : "danger"}
                        className="ml-3"
                      >
                        {data.enable_Stock ? "True " : "False"}
                      </ButtonToggle>
                    </Col>
                    <Label for="is_Taxable" sm={2}>
                      Taxable:
                    </Label>
                    <Col sm={4}>
                      <ButtonToggle
                        onClick={handleis_Taxable}
                        color={data.is_Taxable ? "success" : "danger"}
                        className="ml-3"
                      >
                        {data.is_Taxable ? "Yes " : "No"}
                      </ButtonToggle>
                    </Col>
                  </FormGroup>
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
      </div>
    </React.Fragment>
  );
};

export default PEditor;
