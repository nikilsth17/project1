import React from "react";
import {
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  FormFeedback,
  Button,
} from "reactstrap";
import Select from "react-select";

const DepoForm = ({
  values,
  countryOptions,
  setFieldValue,
  handleChange,
  handleBlur,
  touched,
  errors,
}) => {
  return (
    <Row>
      <Col xs={12} md={12} lg={6}>
        <Row className="gy-2">
          <Row>
            <Col>
              <span className="fw-bold ">Office Information: </span>
            </Col>
          </Row>
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0" for="name">
                Depo:
              </Label>
              <Input
                name={`name`}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.name && errors.name}
              />
              {touched.name && errors.name && (
                <FormFeedback>{errors.name}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0" for="officeCode">
                Office Code:
              </Label>
              <Input
                name={`officeCode`}
                value={values.officeCode}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.officeCode && errors.officeCode}
              />
              {touched.officeCode && errors.officeCode && (
                <FormFeedback>{errors.officeCode}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0" for="streetAddress">
                Street Address:
              </Label>
              <Input
                name={`streetAddress`}
                value={values.streetAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.streetAddress && errors.streetAddress}
              />
              {touched.streetAddress && errors.streetAddress && (
                <FormFeedback>{errors.streetAddress}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0" for="addressLine1">
                Address Line1:
              </Label>
              <Input
                name={`addressLine1`}
                value={values.addressLine1}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.addressLine1 && errors.addressLine1}
              />
              {touched.addressLine1 && errors.addressLine1 && (
                <FormFeedback>{errors.addressLine1}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0">State:</Label>
              <Input
                name={`state`}
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.state && errors.state}
              />
              {touched.state && errors.state && (
                <FormFeedback>{errors.state}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0">Postal Code:</Label>
              <Input
                name={`postalCode`}
                type="text"
                value={values.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.postalCode && errors.postalCode}
              />
              {touched.postalCode && errors.postalCode && (
                <FormFeedback>{errors.postalCode}</FormFeedback>
              )}
            </FormGroup>
          </Col>

          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0" for="addressLine2">
                Address Line2:
              </Label>
              <Input
                name={`addressLine2`}
                value={values.addressLine2}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.addressLine2 && errors.addressLine2}
              />
              {touched.addressLine2 && errors.addressLine2 && (
                <FormFeedback>{errors.addressLine2}</FormFeedback>
              )}
            </FormGroup>
          </Col>

          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0">Locality(Suburb):</Label>
              <Input
                name={`locality`}
                value={values.locality}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.locality && errors.locality}
              />
              {touched.locality && errors.locality && (
                <FormFeedback>{errors.locality}</FormFeedback>
              )}
            </FormGroup>
          </Col>

          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0">Postal Code Starting With:</Label>

              <Input
                name={`postalCodeStartingWith`}
                value={values.postalCodeStartingWith}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={
                  touched.postalCodeStartingWith &&
                  errors.postalCodeStartingWith
                }
              />
              {touched.postalCodeStartingWith &&
                errors.postalCodeStartingWith && (
                  <FormFeedback>{errors.postalCodeStartingWith}</FormFeedback>
                )}
            </FormGroup>
          </Col>
        </Row>
      </Col>

      <Col xs={12} md={12} lg={6}>
        <Row className="gy-2">
          <Row>
            <Col>
              <span className="fw-bold ">Company Information: </span>
            </Col>
          </Row>
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0">Full Name:</Label>
              <Input
                name={`fullName`}
                type="text"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.fullName && errors.fullName}
              />
              {touched.fullName && errors.fullName && (
                <FormFeedback>{errors.fullName}</FormFeedback>
              )}
            </FormGroup>
          </Col>{" "}
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0">Company Name:</Label>
              <Input
                name={`companyName`}
                type="text"
                value={values.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.companyName && errors.companyName}
              />
              {touched.companyName && errors.companyName && (
                <FormFeedback>{errors.companyName}</FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0">ABN:</Label>
              <Input
                name={`abn`}
                type="text"
                value={values.abn}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.abn && errors.abn}
              />
              {touched.abn && errors.abn && (
                <FormFeedback>{errors.abn}</FormFeedback>
              )}
            </FormGroup>
          </Col>{" "}
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0">Phone Number:</Label>
              <Input
                name={`telePhone`}
                type="text"
                value={values.telePhone}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.telePhone && errors.telePhone}
              />
              {touched.telePhone && errors.telePhone && (
                <FormFeedback>{errors.telePhone}</FormFeedback>
              )}
            </FormGroup>
          </Col>{" "}
          <Col xs={6}>
            <FormGroup>
              <Label className="mb-0">Email:</Label>
              <Input
                name={`email`}
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.email && errors.email}
              />
              {touched.email && errors.email && (
                <FormFeedback>{errors.email}</FormFeedback>
              )}
            </FormGroup>
          </Col>{" "}
          <Row className="gy-2">
            <Row>
              <Col>
                <span className="fw-bold ">AWS Credentials: </span>
              </Col>
            </Row>
            <Col xs={6}>
              <FormGroup>
                <Label className="mb-0">AWS UAT Name:</Label>
                <Input
                  name={`awsuatVaultName`}
                  value={values.awsuatVaultName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.awsuatVaultName && errors.awsuatVaultName}
                />
                {touched.awsuatVaultName && errors.awsuatVaultName && (
                  <FormFeedback>{errors.awsuatVaultName}</FormFeedback>
                )}
              </FormGroup>
            </Col>

            <Col xs={6}>
              <FormGroup>
                <Label className="mb-0" for="awsLiveVaultName">
                  AWS Live Name:
                </Label>
                <Input
                  type="text"
                  id="awsLiveVaultName"
                  name="awsLiveVaultName"
                  value={values.awsLiveVaultName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.awsLiveVaultName && errors.awsLiveVaultName}
                />
                {touched.awsLiveVaultName && errors.awsLiveVaultName && (
                  <FormFeedback>{errors.awsLiveVaultName}</FormFeedback>
                )}
              </FormGroup>
            </Col>
          </Row>
        </Row>
      </Col>
      <Col xs={12} md={12} lg={6}></Col>
    </Row>
  );
};

export default DepoForm;
