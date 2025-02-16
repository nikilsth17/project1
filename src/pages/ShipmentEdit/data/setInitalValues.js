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

const setInitialValues = ({
  setFieldValue,
  shipment,
  values,
  selectedQuote,
  currencyOptions,
  countryOptions,
}) => {
  setFieldValue("totalVolume", shipment?.totalVolume);
  setFieldValue("totalQty", shipment?.totalQuantity);
  setFieldValue("totalWeight", shipment?.totalWeight);

  setFieldValue("total", shipment?._total);

  setFieldValue("serviceProvider", shipment?.serviceProviderName);
  setFieldValue("serviceTypeCodeName", shipment?.serviceTypeCodeName);

  setFieldValue("serviceTypeCode", shipment?.enumServiceTypeCode);
  setFieldValue("serviceCode", shipment?.serviceCode ?? "Economy");
  setFieldValue("serviceDisplayCode", shipment?.serviceTypeDescription),
    setFieldValue("sla", shipment?.sla);
  setFieldValue("serviceDescription", shipment?.serviceTypeDescription);

  setFieldValue("packageUnit", shipment?._unit);

  setFieldValue("eta", shipment?.eta);
  setFieldValue("tax", shipment?.tax);

  //About Your Package
  setFieldValue("goodDescription", shipment?.descriptionOfGoods ?? "");
  setFieldValue("internalReference", shipment?.internalReferenceNumber ?? "");

  //Nearest Depots
  setFieldValue("nearestDepot", shipment?.nearestCPDepots);

  if (shipment?.nearestCPDepots) {
    setFieldValue("parcelInfo", "drop");
  } else {
    setFieldValue("parcelInfo", "pickUp");
  }

  //PickUp Address
  setFieldValue("pickUp.companyName", shipment?.pickUpCompanyName ?? "");
  setFieldValue("pickUp.firstName", shipment?.pickUpFirstName ?? "");
  setFieldValue("pickUp.lastName", shipment?.pickUpLastName ?? "");
  setFieldValue("pickUp.email", shipment?.pickUpEmail ?? "");
  setFieldValue("pickUp.addressLine1", shipment?.pickUpAddress1 ?? "");
  setFieldValue("pickUp.addressLine2", shipment?.pickUpAddress2 ?? "");
  setFieldValue("pickUp.phone", shipment?.pickUpPhone ?? "");
  setFieldValue("pickUp.instruction", shipment?.pickUpInstruction ?? "");
  setFieldValue("pickUp.city", shipment?.pickUpSuburb);

  setFieldValue("pickUp.addressType.label", shipment?.pickUpAddressType?.name);
  setFieldValue("pickUp.addressType.value", shipment?.pickUpAddressType?.id);
  setFieldValue("pickUp.country.label", shipment?.pickUpCountry?.name);
  setFieldValue("pickUp.country.value", shipment?.pickUpCountry?.id);

  setFieldValue("pickUp.state", shipment?.pickUpState);
  setFieldValue("pickUp.postCode", shipment?.pickUpPostcode);

  //Deilvery Address
  setFieldValue("delivery.companyName", shipment?.destinationCompanyName ?? "");
  setFieldValue("delivery.firstName", shipment?.destinationFirstName ?? "");
  setFieldValue("delivery.lastName", shipment?.destinationLastName ?? "");
  setFieldValue("delivery.email", shipment?.destinationEmail ?? "");
  setFieldValue("delivery.addressLine1", shipment?.destinationAddress1 ?? "");
  setFieldValue("delivery.addressLine2", shipment?.destinationAddress2 ?? "");
  setFieldValue("delivery.instruction", shipment?.destinationInstruction ?? "");
  setFieldValue("delivery.phone", shipment?.destinationPhone ?? "");

  setFieldValue("delivery.city", shipment?.destinationSuburb);

  setFieldValue("delivery.country.label", shipment?.destinationCountry.name);
  setFieldValue("delivery.country.value", shipment?.destinationCountry.id);
  setFieldValue("deliveryCountryId", shipment?.destinationCountry.id);
  setFieldValue("delivery.state", shipment?.destinationState);
  setFieldValue("delivery.postCode", shipment?.destinationPostcode);
  setFieldValue(
    "delivery.addressType.label",
    shipment?.destinationAddressType?.name
  );
  setFieldValue(
    "delivery.addressType.value",
    shipment?.destinationAddressType?.id
  );

  //Package Details
  setFieldValue("chargeableWeight", shipment?.chargeableWeight);
  setFieldValue(
    "packageDetails",
    shipment?.items.map((item) => {
      return {
        ...item,
        unusualShape: item.itemTypes.find((i) => i === "Unusual Shape")
          ? true
          : false,
        liquid: item.itemTypes.find((i) => i === "Liquid") ? true : false,
        fragile: item.itemTypes.find((i) => i === "Fragile") ? true : false,
        volume:
          shipment._unit === 1
            ? ((item.height * item.length * item.width) / 1000000).toFixed(3)
            : ((item.height * item.length * item.width) / 1728).toFixed(3),
      };
    })
  );

  setFieldValue(
    "shipmentPriceBreakdowns",
    shipment?.displayShipmentPriceBreakDowns
  );
  setFieldValue("calculatedFreightCharge", shipment?.calculatedFreightCharge);
  setFieldValue("calculatedFuelCharge", shipment?.calculatedFuelCharge);

  setFieldValue("auPostServiceType", shipment?.auPostServiceType);

  setFieldValue("domesticServiceProvider", shipment?.domesticServiceProvider);

  setFieldValue("intlServiceProvider", shipment?.intlServiceProvider);
  setFieldValue(
    "importReason",
    importReasons.filter((item) => item.value === shipment?.itemContentType)[0]
  );

  setFieldValue(
    "customsInformation.invoiceDetails",
    shipment?.itemContent.map((item) => {
      return {
        itemType: item.description,
        countryOfOrigin: countryOptions.filter(
          (temp) => temp.value === item.country_of_origin
        )[0],
        valueOfGoods: item.value,
        qty: item.quantity,
        total: Number(item.value) * Number(item.quantity),
        tariffCode: item.tariff_code,
      };
    })
  );

  setFieldValue(
    "domesticPriceDetail",
    selectedQuote?.domesticPriceDetail ?? shipment?.domesticPriceDetail
  );
  setFieldValue(
    "internationalPriceBreaks",
    selectedQuote?.internationalPriceBreaks ??
      shipment?.internationalPriceBreaks
  );

  setFieldValue(
    "intlServiceType",

    intlServiceTypeOption.filter(
      (item) => item.value === shipment?.intlServiceType
    )[0]
  );
  //
  setFieldValue(
    "currency",

    currencyOptions.filter((item) => item.value === shipment?.currency)
  );
  // setFieldValue("collectionDate", localDateTime);
};

export { setInitialValues };

// collectionDate: "",
// collectionDateUTC: "",
// collectionTime: {
//   from: "",
//   to: "",
// },
// collectionTimeUTC: {
//   from: "",
//   to: "",
// },
