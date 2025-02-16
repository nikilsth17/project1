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
  Table,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import CategoryServices from "../../../services/DibyaServices/CategoryServices/CategoryServices";
import toast from "react-hot-toast";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import SubCategoryCreate from "./SubCategory";
import { values } from "lodash";

const CategoryCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [showSubCategoryCreate, setShowSubCategoryCreate] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [generateResponse, setgenerateResponse] = useState();
  const [categorylist, setCategorylist] = useState();

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

  const handleAddSubcategory = () => {
    setShowSubCategoryCreate(true);
    setShowCreate(true);
  };

  const domesticOptions = [
    { value: "0", label: "Menu" },
    { value: "1", label: "Combo" },
    { value: "2", label: "BulkOrder" },
    { value: "3", label: "SpecialOccasion" },
  ];

  // useEffect(() => {
  //   const fetchCategoryDetail = async () => {
  //     try {
  //       const response = await CategoryServices.viewcategory(id);
  //       console.log("🚀 ~ fetchCategoryDetail ~ response:", response);

  //       // Assuming response.mainCat contains the value for mainCat
  //       const mainCatValue = response.mainCat
  //         ? [{ value: response.mainCat }]
  //         : null;

  //       formik.setValues({
  //         title: response.title,
  //         mainCat: mainCatValue,
  //         categoryName: response.categoryName,
  //         category_type: domesticOptions.filter(
  //           (item) => item.label === response.category_type
  //         ),
  //         description: response.description,
  //       });
  //     } catch (error) {
  //       console.log("🚀 ~ fetchRateCardDetail ~ error:", error);
  //     }
  //   };
  //   fetchCategoryDetail();
  // }, [id]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    // category_type: Yup.object().shape({
    //   label: Yup.string().required("Category type is required"),
    //   value: Yup.string().required("Category type is required"),
    // }),
    // description: Yup.string().required("Description is required"),
    // mainCat: Yup.string().nullable().required("Main category is required"),
    subCategory: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required("Subcategory title is required"),
        description: Yup.string().required(
          "Subcategory description is required"
        ),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      category_type: "",
      description: "",
      mainCat: null,
      subCategory: [
        {
          title: "",
          description: "",
        },
      ],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Destructure resetForm here
      try {
        setIsSaving(true);

        if (isEditing) {
          const response = await CategoryServices.categoryUpdate(id, {
            ...values,
            category_type: values.category_type?.label,
          });
          setgenerateResponse(response);
          toast.success("Category Updated Successfully", { autoClose: 3000 });
        } else {
          const response = await CategoryServices.categorycreate({
            ...values,
            category_type: values.category_type?.label,
          });
          setgenerateResponse(response);
          toast.success("Category Added Successfully", { autoClose: 3000 });
        }
        setShowSubCategoryCreate(true);
        // reseCtForm();
        navigate("/category-list");
      } catch (error) {
        console.error("Error creating/updating category:", error);
      } finally {
        setIsSaving(false);
      }
    },
  });

  const breadcrumbItems = [{ title: "Back to List ", link: "/category-list" }];

  const addNewItem = () => {
    formik.setFieldValue("subCategory", [
      ...formik.values.subCategory,
      {
        title: "",
        description: "",
      },
    ]);
  };

  const removeItem = (index) => {
    const temp = [...formik.values.subCategory];
    temp.splice(index, 1);
    formik.setFieldValue("subCategory", temp);
  };

  const handleInputChange = ({ index, property, v }) => {
    formik.setFieldValue(`subCategory.${index}.${property}`, v);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          setIsEditing(true);
          const categoryData = await CategoryServices.viewcategory(id);
          setData(categoryData);

          const selectedOptions = [
            {
              value: categoryData.id,
              label: categoryData.category_type,
            },
          ];

          formik.setValues({
            id: categoryData[0].id || "",
            title: categoryData[0].title || "",
            category_type: domesticOptions.filter(
              (item) => item.label === categoryData[0].category_type
            )[0],
            description: categoryData[0].description || "",

            subCategory: categoryData[0].subCategories.map((subCat) => ({
              title: subCat.title || "",
              description: subCat.description || "",
            })),
          });
        } catch (error) {
          console.error("Error fetching item:", error);
        }
      } else {
        setIsEditing(false);
      }
    };

    fetchData();
  }, [id]);

  console.log("formik.values", formik.errors);

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Category Form"
          pageTitle="Category"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <Label for="title" sm={2}>
                      Title:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="text"
                        id={`title`}
                        name={`title`}
                        placeholder="Title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.title && formik.errors.title}
                      />
                      {formik.touched.title && formik.errors.title && (
                        <div className="invalid-feedback">
                          {formik.errors.title}
                        </div>
                      )}
                    </Col>

                    <Label for="description" sm={2}>
                      Description:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="text"
                        id={`description`}
                        name={`description`}
                        placeholder="Description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.description &&
                          formik.errors.description
                            ? "is-invalid"
                            : ""
                        }`}
                        invalid={
                          formik.touched.description &&
                          formik.errors.description
                        }
                      />
                      {formik.touched.description &&
                        formik.errors.description && (
                          <div className="invalid-feedback">
                            {formik.errors.description}
                          </div>
                        )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label
                      htmlFor="category_type"
                      className="form-label"
                      sm={2}
                    >
                      Category:
                    </Label>
                    <Col sm={4}>
                      <Select
                        name="category_type"
                        isClearable
                        placeholder="Select Main Category"
                        id="category_type"
                        // value={domesticOptions.find(
                        //   (option) =>
                        //     option.label === formik.values.category_type
                        // )}
                        value={formik.values.category_type}
                        onChange={(selectedOption) =>
                          formik.setFieldValue("category_type", selectedOption)
                        }
                        options={domesticOptions}
                      />
                      {/* {formik.touched.category_type &&
                        formik.errors.category_type && (
                          <div className="invalid-feedback">
                            {formik.errors.category_type.label}
                          </div>
                        )} */}
                    </Col>

                    <Label htmlFor="mainCat" className="form-label" sm={2}>
                      Parent Category:
                    </Label>
                    <Col lg={4}>
                      <Select
                        name="mainCat"
                        id="mainCat"
                        isClearable
                        placeholder="Select Sub Category"
                        value={categoryOptions.find(
                          (option) => option.label === formik.values.mainCat
                        )}
                        onChange={(selectedOption) =>
                          formik.setFieldValue("mainCat", selectedOption?.value)
                        }
                        options={categoryOptions.map((option) => ({
                          value: option.id,
                          label: option.title,
                        }))}
                      />

                      {formik.touched.mainCat && formik.errors.mainCat && (
                        <div className="invalid-feedback">
                          {formik.errors.mainCat}
                        </div>
                      )}
                    </Col>
                  </FormGroup>
                  <span className="fs-6 fw-bold">Sub Category:</span>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>S.N</th>
                        <th className="text-black">Title</th>
                        <th className="text-black">Description</th>
                        <th className="text-black">
                          Action{" "}
                          <Button
                            color="primary"
                            size="sm"
                            className=" bx bx-plus-medical ms-auto text-end"
                            onClick={() => addNewItem()}
                          ></Button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Dynamic rows */}
                      {formik.values?.subCategory?.map((item, index) => (
                        <tr key={index + 1}>
                          <td>{index + 1}</td>
                          <td>
                            <Input
                              type="text"
                              id={`subCategory.${index}.title`}
                              name={`subCategory.${index}.title`}
                              placeholder="Title"
                              value={item.title}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={
                                formik.touched?.subCategory?.[index]?.title &&
                                !!formik.errors?.subCategory?.[index]?.title
                              }
                            />
                            {formik.touched?.subCategory?.[index]?.title &&
                              formik.errors?.subCategory?.[index]?.title && (
                                <div className="invalid-feedback">
                                  {formik.errors.subCategory[index]?.title}
                                </div>
                              )}
                          </td>
                          <td>
                            <Input
                              type="text"
                              id={`subCategory.${index}.description`}
                              name={`subCategory.${index}.description`}
                              placeholder="Description"
                              value={item.description}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={
                                formik.touched?.subCategory?.[index]
                                  ?.description &&
                                !!formik.errors?.subCategory?.[index]
                                  ?.description
                              }
                            />
                            {formik.touched?.subCategory?.[index]
                              ?.description &&
                              formik.errors?.subCategory?.[index]
                                ?.description && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.subCategory[index]
                                      ?.description
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <Button
                              color="danger"
                              size="sm"
                              className="bx bx-minus"
                              onClick={() => removeItem(index)}
                            ></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

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
      </div>
    </Container>
  );
  console.log("🚀 ~ CategoryCreate ~ categoryOptions:", categoryOptions);
};

export default CategoryCreate;
