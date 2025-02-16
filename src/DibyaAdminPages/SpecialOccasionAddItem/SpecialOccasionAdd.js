import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Button,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Container,
  Spinner,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import axios from "axios";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import SpecialOccasionServices from "../../services/DibyaServices/SpecialOccasionServices/SpecialOccasionServices";
import ItemServices from "../../services/DibyaServices/ItemServices/ItemServices";

const SpecialOccasionAddItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [specialOptions, setSpecialOptions] = useState([]);
  const [show, setShow] = useState([]);

  const validationSchema = Yup.object().shape({
    itemId: Yup.string().required("Please select an item"),
    specialOccasionId: Yup.string().required(
      "Please select a special occasion"
    ),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedItems = await ItemServices.itemList();
        setItemOptions(fetchedItems);
        const fetchedSpecials = await SpecialOccasionServices.specialList();
        setSpecialOptions(fetchedSpecials);

        if (id) {
          setIsEditing(true);
          const fetchedItem = await SpecialOccasionServices.viewItems(id);
          formik.setValues({
            itemId: fetchedItem.itemId,
            specialOccasionId: fetchedItem.specialOccasionId,
            id: fetchedItem.id,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      ...(isEditing && { id }),
      itemId: "",
      specialOccasionId: "",
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSaving(true);

        if (isEditing) {
          await SpecialOccasionServices.itemupdate(id, {
            ...values,
          });
          toast.success("Category Updated Successfully", { autoClose: 3000 });
        } else {
          await SpecialOccasionServices.itemcreate({
            ...values,
          });
          toast.success("Category Added Successfully", { autoClose: 3000 });
        }

        navigate("/special-item");
      } catch (error) {
        console.error("Error creating/updating category:", error);
      } finally {
        setIsSaving(false);
      }
    },
  });

  const breadcrumbItems = [
    {
      title: "Back to List",
      link: "/special-item",
    },
  ];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title={isEditing ? "Edit Item Form" : "New Item Form"}
          breadcrumbItems={breadcrumbItems}
          pageTitle={isEditing ? "Edit Item" : "New Item"}
        />

        <form onSubmit={formik.handleSubmit}>
          <Card className="pt-1">
            <CardBody>
              {/* {isEditing && (
                <Row>
                  <Col lg={6}>
                    <FormGroup>
                      <Label
                        htmlFor="specialOccasionId"
                        className="form-label mt-2"
                      >
                        Special Occasion ID:
                      </Label>
                      <Input
                        type="text"
                        id="specialOccasionId"
                        name="specialOccasionId"
                        value={formik.values.specialOccasionId}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={6}>
                    <FormGroup>
                      <Label htmlFor="itemId" className="form-label mt-2">
                        Item ID:
                      </Label>
                      <Input
                        type="text"
                        id="itemId"
                        name="itemId"
                        value={formik.values.itemId}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
              )} */}
              <Row>
                <Col lg={6}>
                  <FormGroup>
                    <Label
                      htmlFor="specialOccasionId"
                      className="form-label mt-2"
                    >
                      Special Occasion:
                    </Label>
                    <Select
                      name="specialOccasionId"
                      isClearable
                      id="specialOccasionId"
                      value={specialOptions.find(
                        (option) =>
                          option.value === formik.values.specialOccasionId
                      )}
                      onChange={(selectedOption) =>
                        formik.setFieldValue(
                          "specialOccasionId",
                          selectedOption?.value
                        )
                      }
                      options={specialOptions.map((option) => ({
                        value: option.id,
                        label: option.name,
                      }))}
                    />
                    {formik.touched.specialOccasionId &&
                      formik.errors.specialOccasionId && (
                        <div className="invalid-feedback">
                          {formik.errors.specialOccasionId}
                        </div>
                      )}
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="itemId" className="form-label mt-2">
                      Item:
                    </Label>
                    <Select
                      name="itemId"
                      isClearable
                      id="itemId"
                      value={itemOptions.find(
                        (option) => option.value === formik.values.itemId
                      )}
                      onChange={(selectedOption) =>
                        formik.setFieldValue("itemId", selectedOption?.value)
                      }
                      options={itemOptions.map((option) => ({
                        value: option.id,
                        label: option.name,
                      }))}
                    />
                    {formik.touched.itemId && formik.errors.itemId && (
                      <div className="invalid-feedback">
                        {formik.errors.itemId}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-end mt-2">
                <Button
                  type="submit"
                  className="btn btn-primary"
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
                      navigate("/special-item");
                      setIsCanceling(false);
                    }, 1000);
                  }}
                  className="btn btn-danger ms-2"
                  disabled={isCanceling || isSaving}
                >
                  {isCanceling ? (
                    <>
                      <Spinner size="sm" color="light" className="ms-2" />{" "}
                      Canceling...
                    </>
                  ) : (
                    "Cancel"
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        </form>
      </div>
    </Container>
  );
};

export default SpecialOccasionAddItem;
