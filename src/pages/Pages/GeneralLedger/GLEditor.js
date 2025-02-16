import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import GeneralLedgerService from "../../../services/AccountingServices/GeneralLedgerService";

const initialData = {
  glName: "",
  description: "",
  code: "",
  glType: 1,
  status: true,
  parentGLID: "",
  parentGLName: "",
};

const GLTypes = [
  { value: 1, label: "Liabilities" },
  { value: 2, label: "Assets" },
  { value: 3, label: "Income" },
  { value: 4, label: "Expenses" },
];

const GLEditor = (props) => {
  const [MainDataINEditorTemp, setData] = useState(
    props.myPropHoldingData || initialData
  );
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({
      ...MainDataINEditorTemp,
      [name]: value,
    });
  };

  const handleSelect = (selectedSingle) => {
    setData({
      ...MainDataINEditorTemp,
      glType: selectedSingle.value,
    });
  };

  const handleSelect1 = (selectedOption) => {
    console.log("handleSelect1 called");
    if (selectedOption) {
      const { value, label } = selectedOption;

      console.log("Selected Option: ", selectedOption);
      console.log("Value: ", value);
      console.log("Label: ", label);

      setData({
        ...MainDataINEditorTemp,
        parentGLName: label,
        parentGLID: value || "",
      });
    }
  };

  const [GLedger, setGLedger] = useState([]);

  async function getGLedgerList() {
    try {
      const relatedData = await GeneralLedgerService.getList();
      setGLedger(relatedData);
    } catch (error) {
      console.error("Error fetching general ledger list:", error);
    }
  }

  useEffect(() => {
    // Reset data when props change
    setData(props.myPropHoldingData || initialData);
    getGLedgerList();
  }, [props]);
  const gLIdOptions = GLedger?.length && [
    { value: "id", label: "Select Parent GL" },
    ...GLedger?.map((item) => ({
      value: item.parentGLID,
      label: item.gLedgerNameCode,
    })),
  ];
  console.log(props?.myPropHoldingData, GLedger, "thisss");

  const validationSchema = Yup.object().shape({
    glName: Yup.string().required("Please Enter General Ledger Name"),
    code: Yup.string().required("Please Enter a Valid Code"),
    glType: Yup.number()
      .typeError("Please select a valid type")
      .required("Please select a Type"),
    description: Yup.string().required("Please Enter a Description"),
    parentGLID: Yup.string()
      .required("Please Select Parent General Ledger")
      .nullable(),
  });

  const handleBlur = () => {
    validationSchema
      .validate(MainDataINEditorTemp, { abortEarly: false })
      .then(() => {})
      .catch((validationErrors) => {
        const newErrors = {};
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      });
  };

  const [errors, setErrors] = useState({});
  const [selectedGroup2, setSelectedGroup2] = useState(null);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      await validationSchema.validate(MainDataINEditorTemp, {
        abortEarly: false,
      });
      const isNewGL = !props.myPropHoldingData?.id;

      if (isNewGL) {
        await GeneralLedgerService.create(MainDataINEditorTemp);
        toast.success("General Ledger Added Successfully", { autoClose: 3000 });
      } else {
        await GeneralLedgerService.update(
          props.myPropHoldingData.id,
          MainDataINEditorTemp
        );
        toast.success("General Ledger Updated Successfully", {
          autoClose: 3000,
        });
      }

      if (typeof props.onCloseEditor === "function") {
        props.onCloseEditor(MainDataINEditorTemp);
      }
    } catch (error) {
      console.error("Error creating/posting:", error);
    }
  };

  const handleCancel = () => {
    if (typeof props.onCloseEditor === "function") {
      props.onCloseEditor(MainDataINEditorTemp);
    }
  };

  return (
    <React.Fragment>
      <Row className="justify-content-center">
        <form onSubmit={handleCreatePost}>
          <Row>
            <Col>
              <FormGroup row>
                <Label for="glName" sm={3}>
                  General Ledger
                </Label>
                <Col sm={3}>
                  <Input
                    type="text"
                    id="glName"
                    placeholder="Enter GL Name"
                    value={MainDataINEditorTemp.glName}
                    name="glName"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-control ${
                      errors.glName ? "is-invalid" : ""
                    }`}
                  />
                  {errors.glName && (
                    <div className="invalid-feedback">{errors.glName}</div>
                  )}
                </Col>
                <Label for="code" sm={3}>
                  Code
                </Label>
                <Col sm={3}>
                  <Input
                    type="text"
                    id="code"
                    placeholder="Enter Code"
                    value={MainDataINEditorTemp.code}
                    name="code"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-control ${
                      errors.code ? "is-invalid" : ""
                    }`}
                  />
                  {errors.code && (
                    <div className="invalid-feedback">{errors.code}</div>
                  )}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="glType" sm={3}>
                  General Ledger Type
                </Label>
                <Col sm={3}>
                  <Select
                    id="glType"
                    value={GLTypes.find(
                      (option) => option.value === MainDataINEditorTemp.glType
                    )}
                    name="glType"
                    onChange={handleSelect}
                    options={GLTypes}
                    className={errors.glType ? "is-invalid" : ""}
                  />
                  {errors.glType && (
                    <div className="invalid-feedback">{errors.glType}</div>
                  )}
                </Col>
                <Label for="description" sm={3}>
                  Description
                </Label>
                <Col sm={3}>
                  <Input
                    type="text"
                    id="description"
                    placeholder="Enter Description"
                    value={MainDataINEditorTemp.description}
                    name="description"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-control ${
                      errors.description ? "is-invalid" : ""
                    }`}
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="parentGLID" sm={3}>
                  Parent GL
                </Label>
                <Col sm={3}>
                  <Select
                    isClearable={true}
                    defaultValue={
                      gLIdOptions?.length && MainDataINEditorTemp?.parentGLID
                    }
                    value={
                      gLIdOptions?.length &&
                      gLIdOptions?.find(
                        (option) =>
                          option?.value === MainDataINEditorTemp?.parentGLID
                      )
                    }
                    onChange={handleSelect1}
                    options={gLIdOptions}
                  />
                  {errors.parentGLID && (
                    <div className="invalid-feedback">{errors.parentGLID}</div>
                  )}
                </Col>
              </FormGroup>
              <Row>
                <Col>
                  <Button
                    type="submit"
                    color="success"
                    className="btn-md mb-5"
                    style={{ marginRight: "30px" }}
                  >
                    Save
                  </Button>
                  <Button
                    color="danger"
                    className="btn-md mb-5"
                    onClick={handleCancel}
                    style={{ marginRight: "30px" }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
      </Row>
    </React.Fragment>
  );
};

export default GLEditor;
