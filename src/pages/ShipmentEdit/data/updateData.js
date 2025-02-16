const updateData = ({ values }) => {
  return {
    pickUpFirstName: values?.pickUp.firstName,
    pickUpLastName: values?.pickUp.lastName,
    pickUpCompanyName: values?.pickUp.companyName,
    pickUpCountryId: values?.pickUp.country?.value,
    pickUpEmail: values?.pickUp.email,
    pickUpAddress1: values?.pickUp.addressLine1,
    pickUpAddress2: values?.pickUp.addressLine2,
    pickUpSuburb: values?.pickUp.city,
    pickUpState: values?.pickUp.state,
    pickUpPostcode: values?.pickUp.postCode,
    pickUpPhone: values?.pickUp.phone,
    pickUpInstruction: values?.pickUp.instruction,
    pickUpAddressTypeId: values?.pickUp.addressType.value,
    destinationAddressTypeId: values?.delivery.addressType.value,
    destinationFirstName: values?.delivery.firstName,
    destinationLastName: values?.delivery.lastName,
    destinationCompanyName: values?.delivery.companyName,
    destinationEmail: values?.delivery.email,
    destinationCountryId: values?.delivery.country.value,
    destinationAddress1: values?.delivery.addressLine1,
    destinationAddress2: values?.delivery.addressLine1,
    destinationSuburb: values?.delivery.city,
    destinationState: values?.delivery.state,
    destinationPostcode: values?.delivery.postCode,
    destinationPhone: values?.delivery.phone,
    destinationInstruction: values?.delivery.instruction,
    itemContentType: values?.importReason?.value,
    intlServiceType: values?.intlServiceType.value,
    serviceTypeDescription: values?.serviceDescription,
    itemContent: values?.customsInformation?.invoiceDetails?.map((item) => {
      return {
        country_of_origin: item.countryOfOrigin?.value,
        description: item.itemType,
        // sku: "ABC1234567",
        quantity: Number(item.qty),
        tariff_code: item.tariffCode,
        value: Number(item.valueOfGoods),
        // weight: null,
        // item_contents_reference: "IC123456",
        countryName: item.countryOfOrigin.label,
      };
    }),
  };
};

export default updateData;
