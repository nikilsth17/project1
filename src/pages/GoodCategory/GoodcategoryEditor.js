import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
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
import GoodCategoryServices from "../../services/AustServices/Good Category/GoodCategoryServices";
import { Spinner } from "reactstrap";
import StatusRadioButtons from "../Pages/Starter/StatusRadioButton";
const GoodcategoryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Please enter a valid name")
      .matches(/^[a-zA-Z]+$/, "Please enter letters only"),
    status: Yup.boolean().required("Please select the status"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      status: true, // Assuming "status" is a boolean, you might want to initialize it accordingly
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        if (isEditing) {
          // If there's an id, it's an update operation
          await GoodCategoryServices.update(id, values);
          toast.success("Category Updated Successfully", {
            autoClose: 3000,
          });
          console.log("Good Category updated successfully");
        } else {
          // If there's no id, it's a create operation
          const response = await GoodCategoryServices.create(values);
          toast.success("Category Added Successfully", {
            autoClose: 3000,
          });
          console.log("Good Category created:", response);
        }
        navigate("/Categories");
      } catch (error) {
        console.error("Error creating/updating Good Category:", error);
      } finally {
        setIsSaving(false); // Set saving state back to false when operation finishes
      }
    },
  });

  const breadcrumbItems = [{ title: "Back to List ", link: "/Categories" }];

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      GoodCategoryServices.view(id)
        .then((data) => {
          setCustomer(data);
          formik.setValues({
            name: data.name || "", // Ensure 'name' is defined
            status: data.status || false, // Initialize 'status' accordingly
          });
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Good Category Field"
            pageTitle="Good Category List"
            breadcrumbItems={breadcrumbItems}
          />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup row>
                      <Label for="name" sm={2}>
                        Name:
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
                      <Label for="status" sm={2}>
                        Status:
                      </Label>
                      <Col sm={4} className="mt-2">
                        <StatusRadioButtons formik={formik} />
                      </Col>
                    </FormGroup>
                    <div className="text-end">
                      <Button
                        type="submit"
                        className="btn btn-primary me-2"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Spinner size="sm" color="light" className="me-2" />{" "}
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>

                      <Button
                        onClick={() => {
                          setIsCanceling(true);
                          setTimeout(() => {
                            navigate("/Categories");
                            setIsCanceling(false);
                          }, 1000); // Simulating a delay of 1 second before navigating and setting isCanceling back to false
                        }}
                        className="btn btn-danger "
                        disabled={isCanceling || isSaving}
                      >
                        {isCanceling ? (
                          <>
                            <Spinner size="sm" color="light" /> Canceling...
                          </>
                        ) : (
                          "Cancel"
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
    </Container>
  );
};

export default GoodcategoryEditor;
