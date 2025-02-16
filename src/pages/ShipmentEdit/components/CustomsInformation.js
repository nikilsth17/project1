import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import Select from "react-select";
import GeneralServices from "../../../services/AustServices/GeneralServices/GeneralServices";
import CurrencyServices from "../../../services/AustServices/CurrencySe/CurrencyServices";

const CustomsInformation = ({
  value,
  handleChange,
  handleBlur,
  setFieldValue,
  errors,
  touched,
  setFieldTouched,
  currencyOptions,
  countryOptions,
}) => {
  const importReasons = [
    {
      label: "Gift",
      value: "GIFT",
    },
    {
      label: "Documents",
      value: "DOCUMENTS",
    },
    {
      label: "Commercial Sample",
      value: "SAMPLE",
    },
    {
      label: "Returned Goods",
      value: "RETURN",
    },
    {
      label: "Sale of Goods",
      value: "SALE_OF_GOODS",
    },
    {
      label: "Others",
      value: "OTHER",
    },
  ];

  useEffect(() => {}, []);

  // Total Calculation
  let tCost = 0;
  useEffect(() => {
    value.customsInformation.invoiceDetails?.forEach((item) => {
      tCost += Number(item.valueOfGoods) * Number(item.qty);
    });

    setFieldValue("customsInformation.tCost", +tCost.toFixed(2));
  }, [value.customsInformation.invoiceDetails]);

  const addNewItem = () => {
    setFieldValue("customsInformation.invoiceDetails", [
      ...value.customsInformation.invoiceDetails,
      {
        itemType: "",
        countryOfOrigin: "",
        valueOfGoods: null,
        qty: null,
        total: 0,
        tariffCode: "",
      },
    ]);
  };

  const removeItem = (index) => {
    const temp = [...value.customsInformation.invoiceDetails];
    temp.splice(index, 1);
    setFieldValue("customsInformation.invoiceDetails", temp);
  };

  const handleInputChange = ({ index, property, v }) => {
    setFieldValue(`customsInformation.invoiceDetails.${index}.${property}`, v);
  };

  return (
    <Row className="justify-content-center ">
      <Card className="px-3">
        <CardHeader style={{ height: "3rem" }}>
          <h5>Customs Information </h5>
        </CardHeader>

        <Row className="mt-2">
          <Col md={6} className="md-ms-3 ">
            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  What is your reason to Export?
                  <span className="text-danger">*</span>
                </span>
              </Label>
              <Col xs={7}>
                <Select
                  name={`importReason`}
                  options={importReasons}
                  // isDisabled={true}
                  value={value?.importReason}
                  onChange={(e) => {
                    setFieldValue(`importReason`, e);
                  }}
                  onBlur={() => {
                    setFieldTouched("importReason", true);
                  }}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor:
                        errors.importReason?.value && touched.importReason
                          ? "#F17171"
                          : "#CED4DA",
                    }),
                  }}
                />
                {errors.importReason?.value && touched.importReason && (
                  <span
                    style={{ fontSize: "0.875em" }}
                    className="fs-8 text-danger"
                  >
                    {errors.importReason?.value}
                  </span>
                )}
              </Col>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label className="mb-0">
                <span className="fw-semibold">
                  What currency is being used for this invoice?
                  <span className="text-danger">*</span>
                </span>
              </Label>
              <Col xs={7}>
                <Select
                  name={`currency`}
                  options={currencyOptions}
                  onChange={(e) => {
                    setFieldValue(`invoiceCurrency`, e);
                  }}
                  // isDisabled={true}
                  // defaultValue={value..invoiceCurrency}
                  value={value?.currency}
                  onBlur={() => {
                    setFieldTouched("invoiceCurrency", true);
                  }}
                  invalid={
                    touched.delivery?.country && errors.delivery?.country
                  }
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor:
                        errors.invoiceCurrency?.value && touched.invoiceCurrency
                          ? "#F17171"
                          : "#CED4DA",
                    }),
                  }}
                />
                {errors.invoiceCurrency?.value && touched.invoiceCurrency && (
                  <span
                    style={{ fontSize: "0.875em" }}
                    className="fs-8 text-danger"
                  >
                    {errors.invoiceCurrency?.value}
                  </span>
                )}
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <CardBody>
          <div className="table-card mt-3 mb-1 table-responsive">
            <table className="table align-middle table-striped-columns">
              <thead className="">
                <tr>
                  <th>Item Type</th>

                  <th>Country of Origin</th>

                  <th>Value</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>HS Tariff Code</th>

                  <th>
                    <Button
                      color="primary"
                      size="sm"
                      className=" bx bx-plus-medical"
                      onClick={() => {
                        addNewItem();
                      }}
                    ></Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {value.customsInformation?.invoiceDetails?.map(
                  (item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <Input
                            id={`itemType-${index}`}
                            name={`customsInformation.invoiceDetails.${index}.itemType`}
                            value={item.itemType}
                            placeholder="Item Description"
                            onChange={(e) =>
                              handleInputChange({
                                index: index,
                                property: "itemType",
                                v: e.target.value,
                              })
                            }
                            onBlur={handleBlur}
                            invalid={
                              touched?.customsInformation?.invoiceDetails[index]
                                ?.itemType &&
                              errors?.customsInformation?.invoiceDetails[index]
                                ?.itemType
                            }
                          />
                          {touched?.customsInformation?.invoiceDetails[index]
                            ?.itemType &&
                            errors?.customsInformation?.invoiceDetails[index]
                              ?.itemType && (
                              <FormFeedback>
                                {
                                  errors.customsInformation?.invoiceDetails[
                                    index
                                  ]?.itemType
                                }
                              </FormFeedback>
                            )}
                        </td>
                        <td style={{ width: "12rem" }}>
                          <Select
                            className="w-full"
                            type="text"
                            id={`countryOfOrigin-${index}`}
                            name={`customsInformation.invoiceDetails.${index}.countryOfOrigin`}
                            options={countryOptions}
                            value={item.countryOfOrigin}
                            onBlur={() => {
                              setFieldTouched(
                                `customsInformation.invoiceDetails.${index}.countryOfOrigin`,
                                true
                              );
                            }}
                            onChange={(e) => {
                              handleInputChange({
                                index: index,
                                property: "countryOfOrigin",
                                v: e,
                              });
                            }}
                            // defaultOptions
                            // loadOptions={fetchCategoryTypeOption}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor:
                                  errors.customsInformation?.invoiceDetails[
                                    index
                                  ]?.countryOfOrigin?.value &&
                                  touched.customsInformation?.invoiceDetails[
                                    index
                                  ]?.countryOfOrigin
                                    ? "#F17171"
                                    : "#CED4DA",
                              }),
                            }}
                          />
                          {errors.customsInformation?.invoiceDetails[index]
                            ?.countryOfOrigin?.value &&
                            touched.customsInformation?.invoiceDetails[index]
                              ?.countryOfOrigin && (
                              <span
                                style={{ fontSize: "0.875em" }}
                                className="fs-8 text-danger"
                              >
                                {
                                  errors.customsInformation?.invoiceDetails[
                                    index
                                  ]?.countryOfOrigin?.value
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <Input
                            id={`value-${index}`}
                            name={`customsInformation.invoiceDetails.${index}.valueOfGoods`}
                            value={item.valueOfGoods}
                            onBlur={() => {
                              setFieldTouched(
                                `customsInformation.invoiceDetails.${index}.valueOfGoods`,
                                true
                              );
                              handleInputChange({
                                index: index,
                                property: "total",
                                v: item.valueOfGoods * item.qty,
                              });
                            }}
                            placeholder="per Item"
                            onChange={(e) =>
                              handleInputChange({
                                index: index,
                                property: "valueOfGoods",
                                v: e.target.value,
                              })
                            }
                            invalid={
                              touched.customsInformation?.invoiceDetails[index]
                                ?.valueOfGoods &&
                              errors.customsInformation?.invoiceDetails[index]
                                ?.valueOfGoods
                            }
                          />
                          {touched.customsInformation?.invoiceDetails[index]
                            ?.valueOfGoods &&
                            errors.customsInformation?.invoiceDetails[index]
                              ?.valueOfGoods && (
                              <FormFeedback>
                                {
                                  errors.customsInformation?.invoiceDetails[
                                    index
                                  ]?.valueOfGoods
                                }
                              </FormFeedback>
                            )}
                        </td>
                        <td>
                          <Input
                            id={`qty-${index}`}
                            name={`customsInformation.invoiceDetails.${index}.qty`}
                            value={item.qty}
                            type="number"
                            placeholder="Quantity"
                            onBlur={() => {
                              setFieldTouched(
                                `customsInformation.invoiceDetails.${index}.qty`,
                                true
                              );
                              handleInputChange({
                                index: index,
                                property: "total",
                                v: item.valueOfGoods * item.qty,
                              });
                            }}
                            onChange={(e) =>
                              handleInputChange({
                                index: index,
                                property: "qty",
                                v: e.target.value,
                              })
                            }
                            invalid={
                              touched.customsInformation?.invoiceDetails[index]
                                ?.qty &&
                              errors.customsInformation?.invoiceDetails[index]
                                ?.qty
                            }
                          />
                          {touched.customsInformation?.invoiceDetails[index]
                            ?.qty &&
                            errors.customsInformation?.invoiceDetails[index]
                              ?.qty && (
                              <FormFeedback>
                                {
                                  errors.customsInformation?.invoiceDetails[
                                    index
                                  ]?.qty
                                }
                              </FormFeedback>
                            )}
                        </td>
                        <td style={{ width: "5rem" }}>
                          ${Number(item.total).toFixed(2)}
                        </td>
                        <td>
                          <Input
                            id={`tariff-${index}`}
                            name={`customsInformation.invoiceDetails.${index}.tariffCode`}
                            value={item.tariffCode}
                            onBlur={handleBlur}
                            onChange={(e) =>
                              handleInputChange({
                                index: index,
                                property: "tariffCode",
                                v: e.target.value,
                              })
                            }
                            invalid={
                              touched.customsInformation?.invoiceDetails[index]
                                ?.tariffCode &&
                              errors.customsInformation?.invoiceDetails[index]
                                ?.tariffCode
                            }
                          />
                          {touched.customsInformation?.invoiceDetails[index]
                            ?.tariffCode &&
                            errors.customsInformation?.invoiceDetails[index]
                              ?.tariffCode && (
                              <FormFeedback>
                                {
                                  errors.customsInformation?.invoiceDetails[
                                    index
                                  ]?.tariffCode
                                }
                              </FormFeedback>
                            )}
                        </td>

                        {value?.customsInformation?.invoiceDetails.length >
                          1 && (
                          <td>
                            <Button
                              color="danger"
                              size="sm"
                              className="bx bx-minus"
                              onClick={() => {
                                removeItem(index);
                              }}
                            ></Button>
                          </td>
                        )}
                      </tr>
                    );
                  }
                )}
                <tr>
                  <td>
                    Total value of the goods: ${" "}
                    {value?.customsInformation.invoiceDetails?.reduce(
                      (accumulator, currentValue) =>
                        accumulator + currentValue.total,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </Row>
  );
};

export default CustomsInformation;
