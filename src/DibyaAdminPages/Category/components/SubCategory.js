import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Form,
} from "reactstrap";
import { useFormik } from "formik";
import Select from "react-select";
import CategoryServices from "../../../services/DibyaServices/CategoryServices/CategoryServices";
import toast from "react-hot-toast";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const SubCategoryCreate = ({ generateResponse, value }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  console.log("🚀 ~ SubCategoryCreate ~ categoryOptions:", categoryOptions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await CategoryServices.maincategoryList();
        setCategoryOptions(fetchedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const domesticOptions = [
    { value: "0", label: "Menu" },
    { value: "1", label: "Combo" },
    { value: "2", label: "BulkOrder" },
  ];

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      name: "Menu",
      mainCat: generateResponse.id || "",
      category_type: generateResponse.category_type || "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSaving(true);

        const mainCatValue = Array.isArray(values.mainCat)
          ? values.mainCat.map((cat) => cat.value).join(",")
          : values.mainCat;

        if (isEditing) {
          await CategoryServices.categoryUpdate(id, {
            ...values,
          });

          toast.success("Sub-Category Updated Successfully", {
            autoClose: 3000,
          });
          console.log("Category updated successfully");
        } else {
          const response = await CategoryServices.categorycreate({
            ...values,
          });
          toast.success("Sub-Category Added Successfully", { autoClose: 3000 });
          console.log("Category created:", response);
        }
        // resetForm();
        // navigate("/category-list");
      } catch (error) {
        console.error("Error creating/updating category:", error);
      } finally {
        setIsSaving(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      CategoryServices.viewcategory(id)
        .then((categoryData) => {
          setData(categoryData);

          const selectedOptions = [
            {
              value: categoryData.mainCat,
              label: categoryData.mainCatName,
            },
          ];

          const Options = [
            {
              value: categoryData.category_type,
              label: categoryData.category_type,
            },
          ];
          const selectedOption = Options.find(
            (option) => option.value === categoryData.category_type
          );

          const categoryTypeLabel = selectedOption ? selectedOption.label : "";
          formik.setValues({
            id: categoryData.id,
            title: categoryData.title || "",
            name: categoryData.title || "",
            description: categoryData.description || "",
            category_type: categoryTypeLabel,
          });
          formik.setValues({ ...values, mainCat: selectedOptions });
        })

        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  return (
    <Row className="pt-4">
      <Col>
        <Card>
          <CardBody>
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup row>
                <Col sm={4}>
                  <Label for="title">Title:</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.touched.title && formik.errors.title
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <div className="invalid-feedback">
                      {formik.errors.title}
                    </div>
                  )}
                </Col>
                <Col lg={4}>
                  <Label for="description">Description:</Label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.touched.description && formik.errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="invalid-feedback">
                      {formik.errors.description}
                    </div>
                  )}
                </Col>

                <Col lg={4}>
                  <>
                    <p className="fw-bold">
                      Menu: {generateResponse.category_type}{" "}
                    </p>{" "}
                    <p className="fw-bold">Main-Menu:{value} </p>
                    <p className="fw-bold">Sub-Menu:{formik.values.title} </p>
                  </>
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
                      navigate("/category-list");
                      setIsCanceling(false);
                    }, 1000);
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
  );
};

export default SubCategoryCreate;
