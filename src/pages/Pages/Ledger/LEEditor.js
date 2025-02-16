import React, { useState, useEffect } from "react";
import { Button, FormGroup, Input, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import GeneralLedgerService from "../../../services/AccountingServices/GeneralLedgerService";
import LedgersService from "../../../services/AccountingServices/LedgerService";
import * as Yup from "yup";
import toast from "react-hot-toast";

const initialData = {
  ledgerName: "",
  description: "",
  code: "",
  parentGLID: null,
  status: true,
  glType: null,
  parentGLName: "",
};

const GLTypes = [
  { value: 1, label: "Liabilities" },
  { value: 2, label: "Assets" },
  { value: 3, label: "Income" },
  { value: 4, label: "Expenses" },
];

const LEEditor = (props) => {
  const [Ldata, setLdata] = useState(props.myPropHoldingData || initialData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLdata({
      ...Ldata,
      [name]: value,
    });
  };

  const handleSelect = (selectedSingle) => {
    setLdata({
      ...Ldata,
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

      setLdata({
        ...Ldata,
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
    setLdata(props.myPropHoldingData || initialData);
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
    ledgerName: Yup.string().required(" Please Enter Ledger Name"),
    code: Yup.string().required("Please Enter a Valid Code"),
    glType: Yup.number()
      .typeError("Please select a valid type")
      .required("Please select a Type"),
    description: Yup.string().required(" Please Enter a Description"),
    parentGLID: Yup.string().required(" Please Select Parent General Ledger"),
  });

  const handleBlur = () => {
    validationSchema
      .validate(Ldata, { abortEarly: false })
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

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      await validationSchema.validate(Ldata, { abortEarly: false });
      if (!Ldata.id || Ldata.id === 0) {
        // Create a new item
        await LedgersService.create(Ldata);
        toast.success("Ledger Added Successfully", { autoClose: 3000 });
      } else {
        // Update an existing item
        await LedgersService.update(Ldata.id, Ldata);
        toast.success("Ledger Updated Successfully", { autoClose: 3000 });
      }
      if (typeof props.onCloseEditor === "function") {
        props.onCloseEditor(Ldata);
      }
    } catch (error) {
      console.error("Error creating/posting ledger:", error);
    }
  };

  const handleCancel = () => {
    if (typeof props.onCloseEditor === "function") {
      props.onCloseEditor(Ldata);
    }
  };

  useEffect(() => {
    setLdata(props.myPropHoldingData || initialData);
    getGLedgerList();
  }, [props.myPropHoldingData]);

  return (
    <React.Fragment>
      <Row className="justify-content-center">
        <form onSubmit={handleCreatePost}>
          <Row>
            <Col>
              <FormGroup row>
                <Label for="ledgerName" sm={3}>
                  Ledger
                </Label>
                <Col sm={3}>
                  <Input
                    type="text"
                    id="ledgerName"
                    placeholder="Enter Ledger Name"
                    value={Ldata.ledgerName}
                    name="ledgerName"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-control ${
                      errors.ledgerName ? "is-invalid" : ""
                    }`}
                  />
                  {errors.ledgerName && (
                    <div className="invalid-feedback">{errors.ledgerName}</div>
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
                    value={Ldata.code}
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
                  General Ledger
                </Label>
                <Col sm={3}>
                  <Select
                    id="glType"
                    value={GLTypes.find(
                      (option) => option.value === Ldata.glType
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
                    value={Ldata.description}
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
                    defaultValue={gLIdOptions?.length && Ldata?.parentGLID}
                    value={
                      gLIdOptions?.length &&
                      gLIdOptions?.find(
                        (option) => option?.value === Ldata?.parentGLID
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

export default LEEditor;
