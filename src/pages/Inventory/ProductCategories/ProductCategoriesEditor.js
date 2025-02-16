import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonToggle,
  Card,
  Row,
  CardBody,
  CardHeader,
} from "reactstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import ProductCategoriesServices from "../../../services/Inventory Services/ProductCategoriesServices";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";

const ProductCategories = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id);
  const initialFormData = {
    code: "",
    name: "",
    status: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (id) {
      // If there's an id, it means we are editing an existing category
      setIsEditing(true);
      ProductCategoriesServices.view(id)
        .then((item) => {
          setFormData(item);
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
      setFormData(initialFormData);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleStatus = () => {
    setFormData({
      ...formData,
      status: !formData.status,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // If there's an id, it's an update operation
        await ProductCategoriesServices.update(id, formData);
        console.log("Category updated successfully");
      } else {
        // If there's no id, it's a create operation
        const response = await ProductCategoriesServices.create(formData);
        console.log("Category created:", response);
      }
      navigate("/product-category"); // Redirect to the item list after create/update
    } catch (error) {
      console.error("Error creating/updating category:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb
          title="Product Category Form"
          pageTitle="Product Category "
        />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card id="GeneralLedgerList">
                <CardBody>
                  <span className="placeholder col-12 mb-5 pt-5 bg-success"></span>
                  <Row>
                    <Col>
                      <Form onSubmit={handleSave}>
                        <FormGroup row>
                          <Label for="code" sm={3}>
                            Code:
                          </Label>
                          <Col sm={3}>
                            <Input
                              type="string"
                              name="code"
                              id="code"
                              value={formData.code}
                              onChange={handleInputChange}
                              required
                            />
                          </Col>
                          <Label for="name" sm={3}>
                            Category:
                          </Label>
                          <Col sm={3}>
                            <Input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="status" sm={3}>
                            Status:
                          </Label>
                          <Col sm={2}>
                            <ButtonToggle
                              onClick={handleToggleStatus}
                              color={formData.status ? "success" : "danger"}
                              className="ml-3"
                            >
                              {formData.status ? "Active" : "InActive"}
                            </ButtonToggle>
                          </Col>
                        </FormGroup>
                        <div className="text-end">
                          <Button type="submit" className="btn btn-primary">
                            Save
                          </Button>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductCategories;
