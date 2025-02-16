import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Button,
  ButtonToggle,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Container,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CustomerTypeServices from "../../../services/Inventory Services/CustomerTypeServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import PackageTypeServices from "../../../services/Inventory Services/PackageTypeServices.js";
import { Spinner } from "reactstrap";
import StatusRadioButtons from "../../Pages/Starter/StatusRadioButton.js";
const PackageTypeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRole = await CustomerTypeServices.getPayment();
        setPaymentOptions(fetchedRole);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Please enter a valid name")
      .matches(/^[a-zA-Z]+$/, "Please enter letters only"),

    code: Yup.string().required("Please enter a valid code"),
    status: Yup.boolean().required("Please select the status"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        if (isEditing) {
          await PackageTypeServices.update(id, values);
          toast.success("Package Updated Successfully", { autoClose: 3000 });
        } else {
          const response = await PackageTypeServices.create(values);
          toast.success("Package Added Successfully", { autoClose: 3000 });
          console.log("Package created:", response);
        }
        navigate("/Package");
      } catch (error) {
        console.error("Error creating/updating Package:", error);
      } finally {
        setIsSaving(false); // Set saving state back to false when operation finishes
      }
    },
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      PackageTypeServices.view(id)
        .then((customers) => {
          formik.setValues(customers);
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List ", link: "/Package" }];

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Package Field"
            pageTitle="Package List"
            breadcrumbItems={breadcrumbItems}
          />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
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
                          invalid={formik.touched.name && formik.errors.name}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="invalid-feedback">
                            {formik.errors.name}
                          </div>
                        )}
                      </Col>
                      <Label for="code" sm={2}>
                        Code:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                          id="code"
                          name="code"
                          value={formik.values.code}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={formik.touched.code && formik.errors.code}
                        />
                        {formik.touched.code && formik.errors.code && (
                          <div className="invalid-feedback">
                            {formik.errors.code}
                          </div>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
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
                            navigate("/Package");
                            setIsCanceling(false);
                          }, 1000); // Simulating a delay of 1 second before navigating and setting isCanceling back to false
                        }}
                        className="btn btn-danger me-2"
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
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    </Container>
  );
};

export default PackageTypeEditor;
