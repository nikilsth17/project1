import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonDropdown,
  Card,
  CardHeader,
  Col,
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
import AsyncSelect from "react-select/async";
import GeneralServices from "../../../services/AustServices/GeneralServices/GeneralServices";
import InstructionServices from "../../../services/AustServices/InstructionService/InstructionServices";

const PickUpDetail = ({
  value,
  handleChange,
  handleBlur,
  setFieldValue,
  errors,
  touched,
  setFieldTouched,
}) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [instructions, setInstructions] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

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
      const response = await InstructionServices.getListPickup();
      setInstructions(response);
    };

    fetchInstructions();

    fetchCountry();
  }, []);

  //For postalcode change api hit

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

  return (
    <Row className="justify-content-center">
      <Card>
        <CardHeader style={{ height: "3rem" }}>
          <Row>
            <Col xs={6} md={8} lg={10}>
              <h5>Pickup Detail</h5>
            </Col>
          </Row>
        </CardHeader>

        <Row className="p-2 ">
          <Col lg={6}>
            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  Company Name<sup className="text-danger">*</sup>
                </span>
              </Label>
              <Input
                name={`pickUp.companyName`}
                value={value.pickUp?.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={
                  touched.pickUp?.companyName && errors.pickUp?.companyName
                }
              />
              {touched.pickUp?.companyName && errors.pickUp?.companyName && (
                <FormFeedback>{errors.pickUp?.companyName}</FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  Pickup Address Type<sup className="text-danger">*</sup>
                </span>
              </Label>
              <AsyncSelect
                name="pickUp.addressType"
                className="mt-1 w-full"
                value={value?.pickUp?.addressType}
                onChange={(e) => {
                  setFieldValue("pickUp.addressType", e);
                }}
                onBlur={() => {
                  setFieldTouched("pickUp.addressType", true);
                }}
                placeholder="Please Select"
                defaultOptions
                loadOptions={fetchAddressTypeOption}
              />
              {touched.pickUp?.addressType && errors.pickUp?.addressType && (
                <FormFeedback>{errors.pickUp?.addressType?.value}</FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  Address Line 1<sup className="text-danger">*</sup>
                </span>
              </Label>
              <Input
                name={`pickUp.addressLine1`}
                value={value.pickUp?.addressLine1}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={
                  touched.pickUp?.addressLine1 && errors.pickUp?.addressLine1
                }
              />
              {touched.pickUp?.addressLine1 && errors.pickUp?.addressLine1 && (
                <FormFeedback>{errors.pickUp?.addressLine1}</FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">Address Line 2</span>
              </Label>
              <Input
                name={`pickUp.addressLine2`}
                value={value.pickUp?.addressLine2}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={
                  touched.pickUp?.addressLine2 && errors.pickUp?.addressLine2
                }
              />
              {touched.pickUp?.addressLine2 && errors.pickUp?.addressLine2 && (
                <FormFeedback>{errors.pickUp?.addressLine2}</FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Row>
                <Col xs={6}>
                  <Label className="mb-0">
                    <span className="fw-semibold">
                      Country<sup className="text-danger">*</sup>
                    </span>
                  </Label>
                </Col>
              </Row>
              <Select
                name={`pickUp.country`}
                options={countryOptions}
                onChange={(e) => {
                  setFieldValue(`pickUp.country`, e);
                }}
                value={value.pickUp.country}
                defaultValue={value.pickUp.country}
                onBlur={handleBlur}
                invalid={touched.pickUp?.country && errors.pickUp?.country}
              />

              {touched.pickUp?.country && errors.pickUp?.country && (
                <FormFeedback>{errors.pickUp?.country}</FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  City/Town<sup className="text-danger">*</sup>
                </span>
              </Label>
              <Input
                name={`pickUp.city`}
                // onChange={handleChange}
                // disabled={!value.pickUp?.country}
                onChange={(e) => {
                  setFieldValue(`pickUp.city`, e.target.value);
                }}
                value={value.pickUp?.city}
                onBlur={handleBlur}
                invalid={touched.pickUp?.city && errors.pickUp?.city}
              />

              {touched.pickUp?.city && errors.pickUp?.city && (
                <FormFeedback>{errors.pickUp?.city}</FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  State/Postcode<sup className="text-danger">*</sup>
                </span>
              </Label>
              <Row>
                <Col xs={6}>
                  <Input
                    name={`pickUp.state`}
                    value={value.pickUp?.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.pickUp?.state && errors.pickUp?.state}
                  />
                  {touched.pickUp?.state && errors.pickUp?.state && (
                    <FormFeedback>{errors.pickUp?.state}</FormFeedback>
                  )}
                </Col>
                <Col xs={6}>
                  <Input
                    name={`pickUp.postCode`}
                    value={value.pickUp?.postCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={
                      touched.pickUp?.postCode && errors.pickUp?.postCode
                    }
                  />

                  {touched.pickUp?.postCode && errors.pickUp?.postCode && (
                    <FormFeedback>{errors.pickUp?.postCode}</FormFeedback>
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
                    Contact Name<sup className="text-danger">*</sup>
                  </span>
                </Label>
                <Row>
                  <Col xs={6}>
                    <Input
                      name={`pickUp.firstName`}
                      value={value.pickUp?.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={
                        touched.pickUp?.firstName && errors.pickUp?.firstName
                      }
                    />
                    {touched.pickUp?.firstName && errors.pickUp?.firstName && (
                      <FormFeedback>{errors.pickUp?.firstName}</FormFeedback>
                    )}
                  </Col>
                  <Col xs={6}>
                    <Input
                      name={`pickUp.lastName`}
                      value={value.pickUp?.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={
                        touched.pickUp?.lastName && errors.pickUp?.lastName
                      }
                    />
                    {touched.pickUp?.lastName && errors.pickUp?.lastName && (
                      <FormFeedback>{errors.pickUp?.lastName}</FormFeedback>
                    )}
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup>
                <Label className="mb-0">
                  <span className="fw-semibold">
                    Email Address<sup className="text-danger">*</sup>
                  </span>
                </Label>
                <Input
                  name={`pickUp.email`}
                  value={value.pickUp?.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.pickUp?.email && errors.pickUp?.email}
                />
                {touched.pickUp?.email && errors.pickUp?.email && (
                  <FormFeedback>{errors.pickUp?.email}</FormFeedback>
                )}
              </FormGroup>

              <FormGroup>
                <Label className="mb-0">
                  <span className="fw-semibold">
                    Phone<sup className="text-danger">*</sup>
                  </span>
                </Label>
                <Input
                  name={`pickUp.phone`}
                  value={value.pickUp?.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.pickUp?.phone && errors.pickUp?.phone}
                />
                {touched.pickUp?.phone && errors.pickUp?.phone && (
                  <FormFeedback>{errors.pickUp?.phone}</FormFeedback>
                )}
              </FormGroup>
            </div>

            {value.parcelInfo === "pickUp" && (
              <div>
                <h5>Pickup Instructions</h5>
                <FormGroup>
                  <Label className="mb-0">
                    <span className="text-muted">
                      Please enter any pickup instructions for the driver (eg
                      Authority to Leave, Leave with warehouse)
                    </span>
                  </Label>

                  <InputGroup>
                    <Input
                      name={`pickUp.instruction`}
                      onChange={(e) => {
                        setFieldValue(`pickUp.instruction`, e.target.value);
                      }}
                      value={value.pickUp.instruction}
                      onBlur={handleBlur}
                      invalid={
                        touched.pickUp?.instruction &&
                        errors.pickUp?.instruction
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
                                setFieldValue(`pickUp.instruction`, item.title);
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
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </Row>
  );
};

export default PickUpDetail;
