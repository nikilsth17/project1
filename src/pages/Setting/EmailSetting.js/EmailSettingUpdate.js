import React, { useState, useEffect } from "react";
import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonToggle,
  Card,
  Row,
  CardBody,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CustomerTypeServices from "../../../services/Inventory Services/CustomerTypeServices";
import CustomerAust from "../../../services/AustServices/Customeraust/CustomerAust";
import EmailSettingGEtlist from "./EmailSettingGEtlist";

const EmailSettingUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState([]);
  const [customer, setCustomer] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRole = await CustomerTypeServices.getList();
        setPaymentOptions(fetchedRole);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    //id: Yup.number().required("ID is required"),
  
    EmailAddress: Yup.string()
      .email("Invalid email format")
      .required("Email Address is required"),
      serverAddress: Yup.string().required("Server Address is required"),
      serverPort: Yup.string().required("Server Port is required"),
      Password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must be at least 8 characters, including at least one letter, one number, and one special character"
        ),
  });
  

  const formik = useFormik({
    initialValues: {
      id: 0,
      tax: "",
      sgrRate: "",
      intlParcelSenderName: "",
    
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const paymentTypeIds = values.paymentTypes.map((type) => type.value);

        if (isEditing) {
          await CustomerAust.update(id, {
            ...values,
            paymentTypes: paymentTypeIds,
          });
          toast.success("Service Updated Successfully", { autoClose: 3000 });
          console.log("Customer updated successfully");
        } else {
          const response = await CustomerAust.create({
            ...values,
            paymentTypes: paymentTypeIds,
          });
          toast.success("Customer Added Successfully", { autoClose: 3000 });
          console.log("Category created:", response);
        }
        navigate("/Customer Type");
      } catch (error) {
        console.error("Error creating/updating category:", error);
      }
    },
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      CustomerAust.view(id)
        .then((values) => {
          setCustomer(values);
          const selectedPaymentTypes = values.paymentTypes.map((type) => ({
            value: type.id,
            label: type.name,
          }));
          formik.setValues({ ...values, paymentTypes: selectedPaymentTypes });
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Customer Field" pageTitle="Customer" />
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <Label for="tax" sm={2}>
                    tax:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="text"
                        id="tax"
                        name="tax"
                        value={formik.values.serverAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.tax && formik.errors.tax
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.tax && formik.errors.tax && (
                        <div className="invalid-feedback">
                          {formik.errors.tax}
                        </div>
                      )}
                    </Col>

                    <Label for="sgrRate" sm={2}>
                    sgrRate:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="text"
                        id="sgrRate"
                        name="sgrRate"
                        value={formik.values.sgrRate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.sgrRate &&
                          formik.errors.sgrRate
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.sgrRate &&
                        formik.errors.sgrRate && (
                          <div className="invalid-feedback">
                            {formik.errors.sgrRate}
                          </div>
                        )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="intlParcelSenderName" sm={2}>
                    Intl Parcel SenderName:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="email"
                        id="intlParcelSenderName"
                        name="intlParcelSenderName"
                        value={formik.values.intlParcelSenderName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.intlParcelSenderName && formik.errors.intlParcelSenderName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.intlParcelSenderName && formik.errors.intlParcelSenderName && (
                        <div className="invalid-feedback">
                          {formik.errors.intlParcelSenderName}
                        </div>
                      )}
                    </Col>

                    <Label for=" Password" sm={2}>
                     Password:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="text"
                        id=" Password"
                        name=" Password"
                        value={formik.values.Password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.Password &&
                          formik.errors.Password
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.Password &&
                        formik.errors.Password && (
                          <div className="invalid-feedback">
                            {formik.errors.Password}
                          </div>
                        )}
                    </Col>
                  </FormGroup>

                  
                  <div className="text-end">
  <Button  onClick={() => navigate('/CustomerAUS')} className="btn btn-danger me-2">
    Cancel
  </Button>
  <Button type="submit" className="btn btn-primary">
    Save
  </Button>
</div>
<EmailSettingGEtlist savedData={savedData} />


                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default EmailSettingUpdate