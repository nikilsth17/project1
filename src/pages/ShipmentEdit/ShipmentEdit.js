import React, { useEffect, useState } from "react";
import ShipmentServices from "../../services/AustServices/ShipmentServices/ShipmentServices";
import ShipmentService from "../../services/AustServices/Shipmentservice";
import { useFormik } from "formik";
import CustomsInformation from "./components/CustomsInformation";
import { setInitialValues } from "./data/setInitalValues";
import Select from "react-select";

import {
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Button,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import PickUpDetail from "./components/PickUpDetail";
import DeliveryDetail from "./components/DeliveryDetail";
import updateData from "./data/updateData";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import CurrencyServices from "../../services/AustServices/CurrencySe/CurrencyServices";
import GeneralServices from "../../services/AustServices/GeneralServices/GeneralServices";

const ShipmentEdit = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState();
  const [loading, setLoading] = useState();
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  console.log("🚀 ~ ShipmentEdit ~ countryOptions:", countryOptions);

  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const response = await ShipmentService.getList(id);
        setShipment(response);
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
    (async () => {
      try {
        const response = await CurrencyServices.getCurrencyList();
        const temp = response?.map((item) => {
          return {
            label: `${item.name} (${item.currencyCode}) `,
            value: item.currencyCode,
          };
        });
        setCurrencyOptions(temp);
      } catch (error) {
        console.log("🚀 ~ async ~ error:", error);
      }
    })();
    (async () => {
      try {
        const response = await GeneralServices.getCountries();
        const temp = response?.map((item) => {
          return {
            label: item.name,
            value: item.countryCode,
          };
        });
        setCountryOptions(temp);
      } catch (error) {
        console.log("🚀 ~ async ~ error:", error);
      }
    })();
  }, []);

  useEffect(() => {
    setInitialValues({
      shipment: shipment,
      // selectedQuote: selectedQuote,
      setFieldValue: formik.setFieldValue,
      values: formik.values,
      currencyOptions: currencyOptions,
      countryOptions: countryOptions,
    });
  }, [shipment]);

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      goodDescription: "",
      internalReference: null,
      documents: false,
      nonDocuments: true,
      trackingNumber: "",
      pickUp: {
        companyName: "",
        addressType: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postCode: "",
        country: {
          label: "",
          value: null,
        },
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        instruction: "",
      },
      collectionDate: "",
      collectionDateUTC: "",
      collectionFromTime: "",
      collectionToTime: "",
      collectionTimeUTC: {
        from: "",
        to: "",
      },
      delivery: {
        companyName: "",
        addressType: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postCode: "",
        country: {
          label: "",
          value: null,
        },
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        instruction: "",
      },
      tax: "",
      packageDetails: [
        {
          type: "",
          quantity: 1,
          weight: 1,

          length: 0,
          width: 0,
          height: 0,

          volume: 0,
          fragile: false,
          liquid: false,
          unusualShape: false,
        },
      ],
      totalWeight: "",
      totalQty: "",
      totalVolume: null,
      packageUnit: "",

      paperworkSend: true,
      paperworkPrint: false,
      paperworkNotificationType: 1,
      packageNotificationReceiver: 1,
      packageNotification: {
        receiver: true,
        sender: false,
        account: false,
      },
      serviceProvider: "",
      serviceTypeCode: "",
      serviceCode: "",
      serviceDisplayCode: "",
      serviceDescription: "",
      sla: null,
      eta: "",
      noQuote: false,
      chargeableWeight: "",
      shipmentPriceBreakdowns: [],
      calculatedFreightCharge: "",
      calculatedFuelCharge: "",
      importReason: "",
      invoiceCurrency: "",
      customsInformation: {
        invoiceDetails: [
          {
            itemType: "",
            countryOfOrigin: "",
            valueOfGoods: null,
            qty: null,
            total: 0,
            tariffCode: "",
          },
        ],
        tCost: "",
      },

      parcelInfo: "pickUp",
      nearestDepot: "",
      nearestDepotList: [],
      domesticServiceProvider: "",
      domesticServiceProviderName: "",
      intlServiceProvider: "",
      intlServiceProviderName: "",
      deliveryCountryId: null,
      domesticServiceDescription: "",
      auPostServiceType: "",
      serviceTypeCodeName: "",
      domesticSignatureCharge: "",
      intlSignatureCharge: "",
      domestic: {
        maxWeightKg: null,
        maxWeightLb: null,
        maxSizeCm: null,
        maxSizeInch: null,
      },
      intl: {
        maxWeightKg: null,
        maxWeightLb: null,
        maxSizeCm: null,
        maxSizeInch: null,
      },
      total: null,
      domesticPriceDetail: "",
      internationalPriceBreaks: "",
      intlServiceType: "",
      currency: "",
    },
    // validationSchema: BookingValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await ShipmentServices.updateShipment(
          id,
          updateData({ values: values })
        );
        toast.success("Shipment Edited Successfully!");
        navigate("/shipment-report");

        console.log("🚀 ~ onSubmit: ~ response:", response);
        // dispatch(setQuoteInput(""));

        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error?.response?.data);
        console.log(
          "🚀 ~ file: BookingPage.js:173 ~ handleProcessShipment ~ error:",
          error
        );
      }
    },
  });

  const breadcrumbItems = [
    { title: "Back to shipments list", link: "/shipment-report" },
  ];

  console.log("fomrik.valuess", formik.values);

  const intlServiceTypeOption = [
    {
      label: "Standard",
      value: "Standard",
    },
    {
      label: "StandardWithSign",
      value: "StandardWithSign",
    },
    {
      label: "Express",
      value: "Express",
    },
  ];

  return (
    <div className="page-content">
      <BreadCrumb
        title="Shipment Edit Page"
        pageTitle="Shipment Edit"
        breadcrumbItems={breadcrumbItems}
      />

      <form onSubmit={formik.handleSubmit}>
        <Container>
          <Row className="borders">
            <Col xs={4}>
              <FormGroup>
                <Label className="text-black mb-0">Service Code</Label>
                <Select
                  options={intlServiceTypeOption}
                  name="intlServiceType"
                  // value={filters.statusId}
                  value={formik.values.intlServiceType}
                  onChange={(e) => {
                    formik.setFieldValue("intlServiceType", e);
                  }}
                />
                {/* <Input
                  name={`intlServiceType`}
                  value={formik.values.intlServiceType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.intlServiceType &&
                    formik.errors.intlServiceType
                  }
                /> */}
                {formik.touched.intlServiceType &&
                  formik.errors.intlServiceType && (
                    <FormFeedback>{formik.errors.intlServiceType}</FormFeedback>
                  )}
              </FormGroup>
            </Col>
          </Row>
          <PickUpDetail
            value={formik.values}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            setFieldValue={formik.setFieldValue}
            setFieldTouched={formik.setFieldTouched}
          />
          <DeliveryDetail
            value={formik.values}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            setFieldValue={formik.setFieldValue}
            setFieldTouched={formik.setFieldTouched}
          />
          {
            (formik.values.delivery.country.value !== 39 ||
              formik.values.pickUp.country.value !== 39) && (
              <CustomsInformation
                value={formik.values}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
                currencyOptions={currencyOptions}
                countryOptions={countryOptions}
              />
            )
            // ) : (
            //   <Row>
            //     <Col xs={12} className="text-center">
            //       <img src="/blankdata.png" style={{ height: "240px" }} />
            //     </Col>
            //     <Col xs={12} className="text-center">
            //       <span className="text-muted">Nothing to Edit!</span>
            //     </Col>
            //   </Row>
            // )
          }
          <Row className="justify-content-center">
            <Col className="text-center px-0" xs={6}>
              <Button type="submit" className="w-100" disabled={loading}>
                {loading && (
                  <Spinner size={"sm"} color={"white"} className="me-2" />
                )}
                {loading ? "Submitting ..." : "Submit"}
              </Button>
            </Col>
          </Row>
        </Container>
      </form>
    </div>
  );
};

export default ShipmentEdit;
