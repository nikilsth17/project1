import React, { useState, useEffect } from "react";
import { Col, Form, Button, Card, Row, CardBody, Container } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Select from "react-select";
import { Spinner } from "reactstrap";
import GeneralServices from "../../services/GeneralServices/GeneralServices";
import DepoService from "../../services/AustServices/DepoServices/Depo";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DepoForm from "./DepoForm";

const digitsOnly = (value) => /^\d+$/.test(value);

const DepotEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    const fetchCountryList = async () => {
      try {
        const response = await GeneralServices.getCountryList();
        const temp = response.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setCountryOptions(temp);
      } catch (error) {
        console.log("Error fetching country list:", error);
      }
    };
    fetchCountryList();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required!"),
    officeCode: Yup.string().required("Office Code is required!"),

    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    awsuatVaultName: Yup.string().required("awsuatVaultName is required!"),
    awsLiveVaultName: Yup.string().required("awsLiveVaultName is required!"),
    streetAddress: Yup.string(),
    locality: Yup.string().required("Locality is required!"),
    state: Yup.string().required("State is required!"),
    postalCode: Yup.string().required("Postal code is required!"),
    postalCodeStartingWith: Yup.string()
      .matches(
        /^(\d+,)*\d+$/,
        "Invalid format. Please provide numbers separated by commas"
      )
      .required("PostalCodeStarting With is required!"),
    fullName: Yup.string().required("Full Name is required"),
    companyName: Yup.string().required("Company Name is requird"),
    abn: Yup.string().required("ABN is requried!"),
    telePhone: Yup.string()
      .required("Phone number is required!")
      .test("Digits  only", "Please enter only digits!", digitsOnly),
    email: Yup.string()
      .required("Email is required!")
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Email is invalid!"
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      officeCode: "",
      locality: "",
      state: "",
      postalCode: "",
      countryId: 39,
      addressLine1: "",
      addressLine2: "",
      awsuatVaultName: "",
      awsLiveVaultName: "",
      streetAddress: "",
      postalCodeStartingWith: null,
      status: true,
      fullName: "",
      companyName: "",
      abn: "",
      telePhone: "",
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        const countryIdValue = values.countryId.value;
        const depotData = {
          ...values,
          countryId: countryIdValue,
        };

        if (isEditing) {
          await DepoService.update(id, depotData);
          toast.success("Depot Office Updated Successfully", {
            autoClose: 3000,
          });
        } else {
          await DepoService.create(depotData);
          toast.success("Depot Office Added Successfully", {
            autoClose: 3000,
          });
        }
        navigate("/depot-office");
      } catch (error) {
        toast.error(error?.response?.data || "An error occurred", {
          autoClose: 3000,
        });
      } finally {
        setIsSaving(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);

      DepoService.view(id)
        .then((values) => {
          const temp = values.postalCodeStartingWith.map((item) => {
            return item.code;
          });
          const tempString = temp.join(",");
          formik.setValues({
            ...values,
            countryId: {
              label: values.countryName,
              value: values.countryId,
            },
            postalCodeStartingWith: tempString,
          });
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List", link: "/depot-office" }];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Depot Office"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Depot Office"
        />
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Form onSubmit={formik.handleSubmit}>
                  <DepoForm
                    values={formik.values}
                    countryOptions={countryOptions}
                    setFieldValue={formik.setFieldValue}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                  />

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
                          navigate("/depot-office");
                          setIsCanceling(false);
                        }, 1000);
                      }}
                      className="btn btn-danger me-2"
                      disabled={isCanceling || isSaving}
                    >
                      {isCanceling ? (
                        <>
                          <Spinner size="sm" color="light" className="me-2" />{" "}
                          Canceling...
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
    </Container>
  );
};

export default DepotEditor;
