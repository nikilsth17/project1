import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonDropdown,
  Card,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import Select from "react-select";
import axios from "axios";
import AsyncSelect from "react-select/async";
import InstructionServices from "../../../services/AustServices/InstructionService/InstructionServices";
import GeneralServices from "../../../services/AustServices/GeneralServices/GeneralServices";

const DeliveryDetail = ({
  value,
  handleChange,
  handleBlur,
  setFieldValue,
  errors,
  touched,
  reCalcData,
  getNearestDepot,
}) => {
  const [countryOptions, setCountryOptions] = useState();
  const [instructions, setInstructions] = useState();
  const [preview, setPreview] = useState(false);
  const [editContact, setEditContact] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCountry = async () => {
      const response = await GeneralServices.getCountries();
      const options = response.map((resp) => {
        return {
          label: resp.name,
          value: resp.id,
        };
      });
      setCountryOptions(options);
    };

    const fetchInstructions = async () => {
      const response = await InstructionServices.getListDelivery();

      setInstructions(response);
    };

    fetchInstructions();

    fetchCountry();
  }, []);

  //For postalcode change api hit

  const handlePreviewToggle = () => {
    setPreview(!preview);
  };
  const handleEditContactToggle = () => {
    setEditContact(!editContact);
  };

  const fetchAddressTypeOption = async () => {
    const addressTypes = await GeneralServices.getAddressType();
    const options = addressTypes.map((addressType) => {
      return {
        label: addressType.name,
        value: addressType.id,
      };
    });
    return options;
  };

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Row className="justify-content-center ">
      <Card>
        <CardHeader style={{ height: "3rem" }}>
          <Row>
            <Col xs={7} md={8} lg={10}>
              <h5>Delivery Detail</h5>
            </Col>
          </Row>
        </CardHeader>
        <Row className="p-2 ">
          <Col lg={6}>
            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  Company Name<span className="text-danger">*</span>
                </span>
              </Label>
              <Input
                name={`delivery.companyName`}
                value={value.delivery?.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={
                  touched.delivery?.companyName && errors.delivery?.companyName
                }
              />
              {touched.delivery?.companyName &&
                errors.delivery?.companyName && (
                  <FormFeedback>{errors.delivery?.companyName}</FormFeedback>
                )}
            </FormGroup>

            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  Pickup Address Type<span className="text-danger">*</span>
                </span>
              </Label>
              <AsyncSelect
                name="delivery.addressType"
                className="mt-1 w-full"
                value={value?.delivery?.addressType}
                // defaultValue={value?.delivery?.addressType}
                onChange={(e) => {
                  setFieldValue("delivery.addressType", e);
                }}
                placeholder="Please Select"
                defaultOptions
                loadOptions={fetchAddressTypeOption}
              />
              {touched.delivery?.addressType &&
                errors.delivery?.addressType && (
                  <FormFeedback>
                    {errors.delivery?.addressType.value}
                  </FormFeedback>
                )}
            </FormGroup>

            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  Address Line 1<span className="text-danger">*</span>
                </span>
              </Label>
              <Input
                name={`delivery.addressLine1`}
                value={value.delivery?.addressLine1}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={
                  touched.delivery?.addressLine1 &&
                  errors.delivery?.addressLine1
                }
              />
              {touched.delivery?.addressLine1 &&
                errors.delivery?.addressLine1 && (
                  <FormFeedback>{errors.delivery?.addressLine1}</FormFeedback>
                )}
            </FormGroup>

            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">Address Line 2</span>
              </Label>
              <Input
                name={`delivery.addressLine2`}
                value={value.delivery?.addressLine2}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={
                  touched.delivery?.addressLine2 &&
                  errors.delivery?.addressLine2
                }
              />
              {touched.delivery?.addressLine2 &&
                errors.delivery?.addressLine2 && (
                  <FormFeedback>{errors.delivery?.addressLine2}</FormFeedback>
                )}
            </FormGroup>

            <FormGroup>
              <Row>
                <Col xs={6}>
                  <Label className="mb-0">
                    <span className="fw-semibold">
                      Country<span className="text-danger">*</span>
                    </span>
                  </Label>
                </Col>
              </Row>

              <Select
                name={`delivery.country`}
                options={countryOptions}
                onChange={(e) => {
                  setFieldValue(`delivery.country`, e);
                }}
                value={value.delivery?.country}
                onBlur={handleBlur}
                invalid={touched.delivery?.country && errors.delivery?.country}
              />

              {touched.delivery?.country && errors.delivery?.country && (
                <FormFeedback>{errors.delivery?.country}</FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  City/Town<span className="text-danger">*</span>
                </span>
              </Label>
              <Input
                name={`delivery.city`}
                // onChange={handleChange}
                // disabled={!value.delivery?.country}
                onChange={(e) => {
                  setFieldValue("delivery.city", e.target.value);
                }}
                value={value.delivery?.city}
                onBlur={handleBlur}
                invalid={touched.delivery?.city && errors.delivery?.city}
              />

              {touched.delivery?.city && errors.delivery?.city && (
                <FormFeedback>{errors.delivery?.city}</FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  State/Postcode<span className="text-danger">*</span>
                </span>
              </Label>
              <Row>
                <Col xs={6}>
                  <Input
                    name={`delivery.state`}
                    value={value.delivery?.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.delivery?.state && errors.delivery?.state}
                  />
                  {touched.delivery?.state && errors.delivery?.state && (
                    <FormFeedback>{errors.delivery?.state}</FormFeedback>
                  )}
                </Col>
                <Col xs={6}>
                  <Input
                    name={`delivery.postCode`}
                    value={value.delivery?.postCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={
                      touched.delivery?.postCode && errors.delivery?.postCode
                    }
                  />
                  {touched.delivery?.postCode && errors.delivery?.postCode && (
                    <FormFeedback>{errors.delivery?.postCode}</FormFeedback>
                  )}
                </Col>
              </Row>
            </FormGroup>
          </Col>

          <Col lg={6}>
            <div>
              <FormGroup>
                <Label className="mb-0">
                  <span className="fw-semibold">
                    Contact Name<span className="text-danger">*</span>
                  </span>
                </Label>
                <Row>
                  <Col xs={6}>
                    <Input
                      name={`delivery.firstName`}
                      value={value.delivery?.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={
                        touched.delivery?.firstName &&
                        errors.delivery?.firstName
                      }
                    />
                    {touched.delivery?.firstName &&
                      errors.delivery?.firstName && (
                        <FormFeedback>
                          {errors.delivery?.firstName}
                        </FormFeedback>
                      )}
                  </Col>
                  <Col xs={6}>
                    <Input
                      name={`delivery.lastName`}
                      value={value.delivery?.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={
                        touched.delivery?.lastName && errors.delivery?.lastName
                      }
                    />
                    {touched.delivery?.lastName &&
                      errors.delivery?.lastName && (
                        <FormFeedback>{errors.delivery?.lastName}</FormFeedback>
                      )}
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup>
                <Label className="mb-0">
                  <span className="fw-semibold">
                    Email Address<span className="text-danger">*</span>
                  </span>
                </Label>
                <Input
                  name={`delivery.email`}
                  value={value.delivery?.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.delivery?.email && errors.delivery?.email}
                />
                {touched.delivery?.email && errors.delivery?.email && (
                  <FormFeedback>{errors.delivery?.email}</FormFeedback>
                )}
              </FormGroup>

              <FormGroup>
                <Label className="mb-0">
                  <span className="fw-semibold">
                    Phone<span className="text-danger">*</span>
                  </span>
                </Label>
                <Input
                  name={`delivery.phone`}
                  value={value.delivery?.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.delivery?.phone && errors.delivery?.phone}
                />
                {touched.delivery?.phone && errors.delivery?.phone && (
                  <FormFeedback>{errors.delivery?.phone}</FormFeedback>
                )}
              </FormGroup>
            </div>

            <h5>Delivery Instructions</h5>
            <FormGroup>
              <Label className="mb-0">
                <span className="text-muted">
                  Please enter any delivery instructions for the driver (eg
                  Authority to Leave, Leave with warehouse)
                </span>
              </Label>

              <InputGroup>
                <Input
                  name={`delivery.instruction`}
                  onChange={(e) => {
                    setFieldValue(`delivery.instruction`, e.target.value);
                  }}
                  value={value.delivery.instruction}
                  onBlur={handleBlur}
                  invalid={
                    touched.delivery?.instruction &&
                    errors.delivery?.instruction
                  }
                />
                <ButtonDropdown isOpen={isOpen} toggle={toggle}>
                  <DropdownToggle caret>Popular Options</DropdownToggle>
                  <DropdownMenu>
                    {instructions?.map((item) => {
                      return (
                        <DropdownItem
                          className="cursor-pointer"
                          onClick={() => {
                            setFieldValue(`delivery.instruction`, item.title);
                          }}
                        >
                          <span>{item.title}</span>
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </ButtonDropdown>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </Card>
    </Row>
  );
};

export default DeliveryDetail;
