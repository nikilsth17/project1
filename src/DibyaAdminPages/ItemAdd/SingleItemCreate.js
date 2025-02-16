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
  Table,
  CardHeader,
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
import CategoryServices from "../../services/DibyaServices/CategoryServices/CategoryServices";
import UnitServices from "../../services/DibyaServices/UnitServices/UnitServices";
import ItemServices from "../../services/DibyaServices/ItemServices/ItemServices";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const SingleItemCreate = () => {
  // const convertBase64IntoFile = (base64String) => {
  //   const byteCharacters = atob(base64String);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   const blob = new Blob([byteArray], { type: "image/jpeg" });

  //   const file = new File([blob], "avatar-4.jpg", { type: "image/jpeg" });

  //   return file;
  // };
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [list, setList] = useState([]);
  const [editorHtml, setEditorHtml] = useState("");

  const token = localStorage.getItem("jwtToken");
  console.log("🚀 ~ SingleItemCreate ~ token:", token);

  // const handleEditorChange = (html) => {
  //   setEditorHtml(html);
  //   formik.setFieldValue("description", html);
  // };

  const stripPTags = (html) => {
    return html.replace(/^<p>|<\/p>$/g, '');
  };

  const handleEditorChange = (content, delta, source, editor) => {
    const strippedContent = stripPTags(content);
    setEditorHtml(content);
    formik.setFieldValue("description", strippedContent);
  };

  const validationSchemas = Yup.object().shape({
    name: Yup.string().required("Item name cannot be null"),
    isVeg: Yup.boolean(),
    price: Yup.number().required("Price is required").min(0.01, "Price must be greater than zero"),
    unit: Yup.string().required("Please select unit"),
    shelfLife: Yup.number().required("Shelf Life is required").min(1, "Shelf Life must be greater than zero"),
    energy: Yup.number().required("Please enter energy"),
    //bulkPrice: Yup.number().required("Bulk Price is required").min(0.01, "Bulk Price must be greater than zero"),
    ingredients: Yup.string(),
    tags: Yup.string(),
    categoryId: Yup.string().required("Please select sub-category"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await CategoryServices.subcategoryList();
        setCategoryOptions(fetchedCategories);

        const fetchedUnits = await UnitServices.unitList();
        setUnitOptions(fetchedUnits);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      categoryId: "",
      price: "",
      bulkPrice: "",
      unit: "",
      ingredients: "",
      shelfLife: "",
      energy: 0,
      description: "",
      tags: "",
      isFeatured: true,
      isActive: true,
      isVeg: false,
      package_Type: "",
      isPackage: false,
      packageItems: [{ item_id: "", quantity: 0, isDefault: "true" }],
    },
    validationSchema: validationSchemas,
    onSubmit: async (values) => {
      console.log("🚀 ~ onSubmit: ~ values:", values);
      try {
        setIsSaving(true);

        let formattedValues = { ...values };

        // If isPackage is true, format packageItems
        if (values.isPackage) {
          const formattedPackageItems = values.packageItems.map((item) => ({
            item_Id: item.item_Id.value,
            quantity: item.quantity,
            isDefault: item.isDefault,
          }));

          formattedValues = {
            ...values,
            bulkPrice: values.bulkPrice === "" ? 0 : Number(values.bulkPrice),
            packageItems: formattedPackageItems,
          };
        } else {
          // If isPackage is false, set packageItems to null
          formattedValues = {
            ...values,
            bulkPrice: values.bulkPrice === "" ? 0 : Number(values.bulkPrice),
            packageItems: null,
          };
        }

        if (id) {
          const response = await axios.put(
            `/items/itemupdatewithpackage/${id}`,
            formattedValues,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("🚀 ~ onSubmit: ~ response:", response);
          toast.success("Item Updated Successfully", {
            autoClose: 3000,
          });
        } else {
          const response = await axios.post("/items", formattedValues, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("🚀 ~ onSubmit: ~ response:", response);
          toast.success("Item Added Successfully", {
            autoClose: 3000,
          });
        }

        navigate("/items");
      } catch (error) {
        console.log("🚀 ~ onSubmit: ~ error:", error);
        if (error.response && error.response.data) {
          toast.error(error.response.data, {
            autoClose: 3000,
          });
        } else {
          toast.error("Something went wrong.", {
            autoClose: 3000,
          });
        }
      } finally {
        setIsSaving(false);
      }
    },
  });
  console.log('formik.values', formik.errors  )
  console.log('formik.values', formik.touched  )

  const handleAcceptedFiles = (files) => {
    const formattedFiles = files.map((file) => ({
      name: file.name,
      path: file.path,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles(formattedFiles);
    formik.setFieldValue("formfile", files[0]);
  };

  const handleFileRemove = (index) => {
    const files = [...selectedFiles];
    const removedFile = files.splice(index, 1)[0];
    setSelectedFiles(files);

    if (removedFile.name === formik.values.formfile) {
      formik.setFieldValue("formfile", "");
    }
    console.log("🚀 ~ handleFileRemove ~ formfile:", formfile);
  };

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const response = await CategoryServices.viewitems(id);
        console.log("🚀 ~ fetchItemDetail ~ response:", response);

        const { items, packageItem } = response;

        formik.setValues({
          name: items.name,
          categoryId: items.categoryId,
          price: items.price,
          bulkPrice: items.bulkPrice,
          unit: items.unit,
          ingredients: items.ingredients,
          shelfLife: items.shelfLife,
          energy: items.energy,
          description: items.description,
          tags: items.tags,
          isFeatured: items.isFeatured,
          isActive: items.isActive,
          isPackage: items.isPackage,
          package_Type: items.package_Type,

          packageItems: packageItem?.map((pkgItem) => ({
            // categoryId: pkgItem.categoryId || "",
            quantity: pkgItem.quantity || "",
          })),
        });

        const imageUrl = `data:image/png;base64,${items.image}`;

        const formFile = convertBase64IntoFile(items.image);
        console.log("🚀 ~ fetchItemDetail ~ formFile:", formFile);
        const formattedFiles = {
          name: formFile.name,
          path: formFile.path,
          preview: imageUrl,
        };
        setSelectedFiles(formattedFiles);
        formik.setFieldValue("formFile", formFile);
        console.log("🚀 ~ fetchItemDetail ~ formFile:", formFile);
      } catch (error) {
        console.log("🚀 ~ fetchItemDetail ~ error:", error);
      }
    };
    fetchItemDetail();
  }, [id]);

  const breadcrumbpackageItems = [
    {
      title: "Back to List",
      link: "/items",
    },
  ];

  const handleAddItem = () => {
    const newPackageItem = { item_Id: "", quantity: 0 };
    const updatedPackageItems = [...formik.values.packageItems, newPackageItem];
    formik.setFieldValue("packageItems", updatedPackageItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...formik.values.packageItems];
    updatedItems.splice(index, 1);
    formik.setFieldValue("packageItems", updatedItems);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await ItemServices.list();
        setList(fetchedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Item Form"
          breadcrumbItems={breadcrumbpackageItems}
          pageTitle="Item"
        />

        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col lg={8}>
              <Card className="pt-1">
                <CardBody>
                  <Row>
                    <Col>
                      <Label htmlFor="name" className="form-label mt-2">
                        Item Name:
                      </Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter name"
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
                  </Row>
                  <Row>
                    <Col>
                      <Label htmlFor="description" className="form-label mt-2">
                        Description:
                      </Label>

                      <ReactQuill
                        theme="snow"
                        value={editorHtml}
                        onChange={handleEditorChange}
                      />
                      {formik.touched.description && formik.errors.description && (
                        <div className="invalid-feedback">
                          {formik.errors.description}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <CardBody>
                        <FormGroup check row className="mt-2">
                          <div className="d-flex gap-5">
                            <Label check>
                              <Input
                                type="checkbox"
                                name="isVeg"
                                checked={formik.values.isVeg}
                                onChange={formik.handleChange}
                              />{" "}
                              Veg
                            </Label>
                            <Label check>
                              <Input
                                type="checkbox"
                                name="isFeatured"
                                checked={formik.values.isFeatured}
                                onChange={formik.handleChange}
                              />{" "}
                              Is Featured
                            </Label>
                          </div>
                        </FormGroup>
                      </CardBody>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card>
                <CardBody>
                  <div>
                    <Dropzone onDrop={handleAcceptedFiles}>
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone dz-clickable ">
                          <div
                            className="dz-message needsclick mb-2"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <i className=" align-item-center display-4 text-muted ri-upload-cloud-2-fill" />
                            <h4 className="fs-15 fw-semi-bold pt-3">
                              Drop files here or{" "}
                              <Link to="#">click to upload.</Link>
                            </h4>
                            <h4 className="fs-14 text-muted ">
                              Max Upload Size 10MB.
                            </h4>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="list-unstyled mb-0" id="file-previews">
                      {selectedFiles.map((f, i) => (
                        <Card
                          className=" mb-0  shadow-none border dz-processing dz-formfile-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div>
                            <Row className="align-packageItems-center">
                              <Col className="col-auto">
                                <img
                                  data-dz-thumbnail=""
                                  height="100"
                                  className="avatar-sm rounded bg-light"
                                  alt={f.name}
                                  src={f.preview}
                                />
                              </Col>
                              <Col>
                                <Link
                                  to="#"
                                  className="text-muted font-weight-bold"
                                >
                                  {f.name}
                                </Link>
                                <p className="mb-0">
                                  <strong>{f.formattedSize}</strong>
                                </p>
                              </Col>
                              <Col lg={2}>
                                <Link onClick={() => handleFileRemove(i)}>
                                  <h3>
                                    <i className="ri-delete-bin-2-line text-danger"></i>
                                  </h3>
                                </Link>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div className="">
                    <Label htmlFor="categoryId" className="form-label mt-2">
                      Sub-category:
                    </Label>
                    <Select
                      name="categoryId"
                      isClearable
                      id="categoryId"
                      value={categoryOptions.find(
                        (option) => option.value === formik.values.categoryId
                      )}
                      onChange={(selectedOption) =>
                        formik.setFieldValue(
                          "categoryId",
                          selectedOption?.value
                        )
                      }
                      options={categoryOptions.map((option) => ({
                        value: option.id,
                        label: option.title,
                      }))}
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          borderColor: formik.touched.categoryId && formik.errors.categoryId ? '#dc3545' : provided.borderColor,
                          '&:hover': {
                            borderColor: formik.touched.categoryId && formik.errors.categoryId ? '#dc3545' : provided['&:hover'].borderColor,
                          },
                          boxShadow: formik.touched.categoryId && formik.errors.categoryId ? '0 0 0 1px #dc3545' : state.isFocused ? '0 0 0 1px #2684FF' : provided.boxShadow,
                        }),
                      }}
                    />

                    {formik.touched.categoryId && formik.errors.categoryId && (
                      <div className="invalid-feedback">
                        {formik.errors.categoryId}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="price" className="form-label mt-2">
                      Price:
                    </Label>
                    <Input
                      type="text"
                      name="price"
                      id="price"
                      placeholder="Enter price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.price && formik.errors.price}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <div className="invalid-feedback">
                        {formik.errors.price}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="unit" className="form-label mt-2">
                      Unit:
                    </Label>
                    <Select
                      name="unit"
                      isClearable
                      id="unit"
                      value={unitOptions.find(
                        (option) => option.value === formik.values.unit
                      )}
                      onChange={(selectedOption) => {
                        formik.setFieldValue("unit", selectedOption?.value);
                      }}
                      options={unitOptions.map((option) => ({
                        value: option.id,
                        label: option.title,
                      }))}
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          borderColor: formik.touched.unit && formik.errors.unit ? '#dc3545' : provided.borderColor,
                          '&:hover': {
                            borderColor: formik.touched.unit && formik.errors.unit ? '#dc3545' : provided['&:hover'].borderColor,
                          },
                          boxShadow: formik.touched.unit && formik.errors.unit ? '0 0 0 1px #dc3545' : state.isFocused ? '0 0 0 1px #2684FF' : provided.boxShadow,
                        }),
                      }}
                    />

                    {formik.touched.unit && formik.errors.unit && (
                      <div className="invalid-feedback">
                        {formik.errors.unit}
                      </div>
                    )}
                  </div>
                  {/* <div>
                    <Label htmlFor="unit" className="form-label mt-2">
                      Unit:
                    </Label>
                    <Select
                      name="unit"
                      isClearable
                      id="unit"
                      value={unitOptions.find(
                        (option) => option.label === formik.values.unit
                      )}
                      onChange={(selectedOption) => {
                        formik.setFieldValue("unit", selectedOption?.value); // Update unit field value to selected option's value
                      }}
                      options={unitOptions.map((option) => ({
                        value: option.id,
                        label: option.title,
                      }))}
                      invalid={formik.touched.unit && formik.errors.unit}
                    />

                    {formik.touched.unit && formik.errors.unit && (
                      <div className="invalid-feedback">
                        {formik.errors.unit}
                      </div>
                    )}
                  </div> */}
                </CardBody>
              </Card>
              <Card>
                <CardHeader>Meta Information</CardHeader>
                <CardBody>
                  <Row>
                    <Label htmlFor="tags" className="form-label mt-2 col-4">
                      Tags:
                    </Label>
                    <Col lg={8}>
                      <Input
                        type="text"
                        name="tags"
                        id="tags"
                        placeholder="Enter tags"
                        value={formik.values.tags}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.tags && formik.errors.tags && (
                        <div className="invalid-feedback">
                          {formik.errors.tags}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row className="pt-1">
                    <Label
                      htmlFor="shelfLife"
                      className="form-label mt-2 col-4"
                    >
                      Shelf Life:
                    </Label>
                    <Col lg={8}>
                      <Input
                        type="text"
                        name="shelfLife"
                        id="shelfLife"
                        placeholder="Enter shelfLife"
                        value={formik.values.shelfLife}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.shelfLife && formik.errors.shelfLife}
                      />
                      {formik.touched.shelfLife && formik.errors.shelfLife && (
                        <div className="invalid-feedback">
                          {formik.errors.shelfLife}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row className="pt-1">
                    <Label
                      htmlFor="shelfLife"
                      className="form-label mt-2 col-4"
                    >
                      Energy:
                    </Label>
                    <Col lg={8}>
                      <Input
                        type="text"
                        name="energy"
                        id="energy"
                        placeholder="Enter energy"
                        value={formik.values.energy}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.energy && formik.errors.energy && (
                        <div className="invalid-feedback">
                          {formik.errors.energy}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row className="pt-1">
                    <Label
                      htmlFor="shelfLife"
                      className="form-label mt-2 col-4"
                    >
                      Bulk Price:
                    </Label>
                    <Col lg={8}>
                      <Input
                        type="text"
                        name="bulkPrice"
                        id="bulkPrice"
                        placeholder="Enter bulkPrice"
                        value={formik.values.bulkPrice}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.bulkPrice && formik.errors.bulkPrice}
                      />
                      {formik.touched.bulkPrice && formik.errors.bulkPrice && (
                        <div className="invalid-feedback">
                          {formik.errors.bulkPrice}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row className="pt-1">
                    <Label
                      htmlFor="shelfLife"
                      className="form-label mt-2 col-4"
                    >
                      Ingredients:
                    </Label>
                    <Col lg={8}>
                      <Input
                        type="text"
                        name="ingredients"
                        id="ingredients"
                        placeholder="Enter ingredients"
                        value={formik.values.ingredients}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.ingredients &&
                        formik.errors.ingredients && (
                          <div className="invalid-feedback">
                            {formik.errors.ingredients}
                          </div>
                        )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
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
                  <Spinner size="sm" color="light" className="me-2" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
            <Button
              onClick={() => {
                setIsCanceling(true);
                setTimeout(() => {
                  navigate("/packageItems");
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
        </form>
      </div>
    </Container>
  );
};

export default SingleItemCreate;
