/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import ClipboardList from "../../assets/icons/ClipboardList";
import PeopleIcon from "../../assets/icons/PeopleIcon";
import SearchIcon from "../../assets/icons/SearchIcon";
import TruckDeliverIcon from "../../assets/icons/TruckDeliver";
import TruckIcon from "../../assets/icons/TruckIcon";

const SystemList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [fromCountryText, setFromCountryText] = useState();
  const [toCountryText, setToCountryText] = useState();
  const [fromPostalCode, setFromPostalCode] = useState();
  const [fromPostalCodeText, setFromPostalCodeText] = useState();
  const [toPostalCodeText, setToPostalCodeText] = useState();
  // const [data, setData] = useState([]);
  const [countryList, setCountryList] = useState();
  const [filteredCountryList, setFilteredCountryList] = useState([]);
  const [filteredToList, setFilteredToList] = useState([]);
  const [filteredCodeList, setFilteredCodeList] = useState([]);
  const [filteredToCodeList, setFilteredToCodeList] = useState([]);

  const [fromLocation, setFromLocation] = useState();
  const [toLocation, setToLocation] = useState();

  const [formData, setFormData] = useState({
    items: [
      {
        reference: "",
        packageType: "",
        quantity: undefined,
        weightDead: undefined,
        length: undefined,
        width: undefined,
        height: undefined,
        satchelSize: undefined,
      },
    ],
  });
  const handleInputChange = (index, property, value) => {
    setFormData((prevData) => {
      const newItems = [...prevData.items];
      newItems[index][property] = value;
      return { items: newItems };
    });
  };

  const addNewItem = () => {
    setFormData((prevData) => ({
      items: [
        ...prevData.items,
        {
          reference: "",
          packageType: "",
          quantity: 0,
          weightDead: 0,
          length: 0,
          width: 0,
          height: 0,
          satchelSize: "",
        },
      ],
    }));
  };
  const [fromLocationData, setFromLocationData] = useState({
    streetAddress: "",
    additionalDetails: "",
    locality: "",
    stateOrProvince: "",
    postalCode: "",
    country: "",
  });

  const [toCountryData, setToCountryData] = useState({
    streetAddress: "",
    additionalDetails: "",
    locality: "",
    stateOrProvince: "",
    postalCode: "",
    country: "",
  });

  const removeItem = (index) => {
    setFormData((prevData) => {
      const newItems = [...prevData.items];
      newItems.splice(index, 1);
      return { items: newItems };
    });
  };
  const [selectedUnit, setSelectedUnit] = useState("kg/cm");
  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
  };
 

useEffect(() => {
    (() => {
      axios
        .get(
          `http://api.parcelcalculator.sebs.asia/api/auspost/general/country`
        )
        .then((res) => {
          setCountryList(res);
        });
    })();
  }, []);
  //   const fetchFromPostageData = async () => {
  //     if (fromPostalCode) {
  //       const response = await axios.get(
  //         `http://api.parcelcalculator.sebs.asia/api/auspost/general/postal-code?query=${fromPostalCode}`
  //         // `http://temp.rishanshrestha.com.np/api/PostalCode/search?query=${fromPostalCode}`
  //       );
  //       setFromPostageData(response);
  //     }
  //   };

  //   const fetchToPostageData = async () => {
  //     if (toPostalCode) {
  //       const response = await axios.get(
  //         // `http://api.parcelcalculator.sebs.asia/api/Country/get-country?countryCode=${toPostalCode}`
  //         `http://api.parcelcalculator.sebs.asia/api/auspost/general/country`

  //         // `http://temp.rishanshrestha.com.np/api/country/get-country`
  //       );
  //       setToPostageData(response.data);
  //     }
  //   };

  //   fetchFromPostageData();
  //   fetchToPostageData();
  // }, [fromPostalCode, toPostalCode]);

const loadUser = async (query, isFromCode) => {
    const response = await axios.get(
      `http://api.parcelcalculator.sebs.asia/api/auspost/general/postal-code?query=${query}`
      // `http://temp.rishanshrestha.com.np/api/PostalCode/search?query=${query}`
    );
    console.log(response);
    isFromCode
      ? setFilteredCodeList(response)
      : setFilteredToCodeList(response);
  };

   const onCountrySearch = (text, flag) => {
     const temp = countryList?.filter((item) =>
       item?.name?.toLowerCase()?.includes(text?.toLowerCase())
     );
     if (!text?.length) {
       setFilteredCountryList(countryList);
       setFilteredToList(countryList);
     }
     if (flag) {
       setFromCountryText(text);
       if (text?.length < 2) {
         return;
       }
       setFilteredCountryList(temp);
     } else {
       setToCountryText(text);
       if (text?.length < 2) return;
       setFilteredToList(temp);
     }
   };

    const onCountrySelect = (location, isFromCode) => {
      if (isFromCode) {
        setFromCountryText(location.name);
        setFromLocationData((prevData) => ({
          ...prevData,
          country: location.code,
        }));
        setFromLocation(location);
        setFilteredCountryList([]);
      } else {
        setToCountryText(location.name);
        setToCountryData((prevData) => ({
          ...prevData,
          country: location.code,
        }));
        setToLocation(location);
        setFilteredToList([]);
      }
    };

      const onPostalCodeSearch = (text, flag) => {
        if (!text?.length) {
          setFilteredCodeList([]);
          setFilteredToList([]);
        }
        if (flag) {
          setFromPostalCodeText(text);
        } else {
          setToPostalCodeText(text);
        }
        if (text?.length < 3) return;
        loadUser(text, flag);
      };

        const onPostalCodeSelect = (location, flag) => {
          let simplifiedLocation =
            location.location + " " + location.state + " " + location.postCode;
          if (flag) {
            setFromLocationData((prevData) => ({
              ...prevData,
              postalCode: location.code,
            }));
            setFromPostalCodeText(simplifiedLocation);
            setFilteredCodeList([]);
          } else {
            setToCountryData((prevData) => ({
              ...prevData,
              postalCode: location.code,
            }));
            setToPostalCodeText(simplifiedLocation);
            setFilteredToCodeList([]);
          }
        };

         const handleReportClick = () => {
           navigate(
             `/postage-display/${fromLocationData?.postalCode}/${toLocation?.name}`,
             {
               state: {
                 fromLocation,
                 formData,
                 toLocation,
                 fromLocationData,
                 toCountryData,
               },
             }
           );
         };

  // const onUserHandler = (location, isFromCode) => {
  //   let simplifiedLocation =
  //     location.location + " " + location.state + " " + location.postCode;
  //   if (isFromCode) {
  //     setFromPostalCode(location.postCode);
  //     setText(simplifiedLocation);
  //     setFromLocation(location);
  //   } else {
  //     setToPostalCode(location.postCode);
  //     setToText(simplifiedLocation);
  //   }

  //   isFromCode ? setUsers([]) : setToUsers([]);
  // };

  // const onToUserHandler = (location, isToCode) => {
  //   let simplifiedLocation =
  //     location.location + " " + location.state + " " + location.postCode;
  //   if (isToCode) {
  //     setFromPostalCode(location.postCode);
  //     setText(simplifiedLocation);
  //     setFromLocation(location);
  //   } else {
  //     setToPostalCode(location.postCode);
  //     setToText(simplifiedLocation);
  //   }

  //   isToCode ? setUsers([]) : setToUsers([]);
  // };

  // const OnChnageHandler = (text, isFromCode) => {
  //   setNewText(text);
  //   if (text.length >= 3) {
  //     loadUser(text, isFromCode);
  //   } else {
  //     isFromCode ? setUsers([]) : setToUsers([]);
  //   }
  // };

  // const OnToChangeHandler = (text, isToCode) => {
  //   setNewText(text);
  //   if (text.length >= 3) {
  //     loadUser(text, isToCode);
  //   } else {
  //     isToCode ? setUsers([]) : setToUsers([]);
  //   }
  // };

  
  console.log(users);
  return (
    // <Container className="mt-5">
    <div className="p-2 px-5 bg-black color-white mb-5 ">
      <b>
        <h2 style={{ marginTop: "100px" }}>
          <TruckIcon /> Begin your quote
        </h2>
      </b>
      <Row
        className="mb-4 square border border-white rounded-2"
        style={{ width: "70%", paddingLeft: "40px" }}
      >
        <Col>
          <FormGroup>
            <h3 className="mt-4">
              <PeopleIcon />
              Pick Up
            </h3>

            {/* <Label
              for="toPostage"
              className="text-sm font-medium text-gray-600"
            >
              Country
            </Label> */}
            <Input
              type="text"
              className="mt-1 p-2 block w-full border rounded-md"
              onFocus={() => setFilteredCountryList(countryList)}
              onChange={(e) => onCountrySearch(e.target.value, true)}
              value={fromCountryText}
              style={{ width: "300px" }}
            >
              {/* <option value={""}>Select Country</option>
              {countryList?.map(({ name, code }) => (
                <option value={code} key={code}>
                  {name}
                </option>
              ))} */}
            </Input>

            {!!filteredCountryList.length && (
              <div
                className="mt-2 overflow-y-auto max-h-32"
                style={{
                  maxHeight: "160px",
                  overflowY: "auto",
                  position: "absolute",
                  background: "white",
                }}
              >
                {filteredCountryList.map((user, i) => (
                  <div
                    key={i}
                    className="cursor-pointer"
                    onClick={() => onCountrySelect(user, true)}
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Label
              for="fromPostage"
              className="text-sm font-medium text-gray-60 mt-2"
            >
              <SearchIcon /> Search By <br /> Postal Code
            </Label>
            <Input
              type="text"
              className="mt-1 p-2 block w-full border rounded-md"
              onChange={(e) => onPostalCodeSearch(e.target.value, true)}
              value={fromPostalCodeText}
              style={{ width: "300px" }}
            />
            {!!filteredCodeList?.length && (
              <div
                className="mt-2 overflow-y-auto max-h-32"
                style={{
                  maxHeight: "160px",
                  overflowY: "auto",
                  position: "absolute",
                  background: "white",
                }}
              >
                {filteredCodeList?.map((user, i) => (
                  <div
                    key={i}
                    className="cursor-pointer"
                    onClick={() => onPostalCodeSelect(user, true)}
                  >
                    {user.location} {user.state}
                    {user.postCode}
                  </div>
                ))}
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="streetAddress">Street Address:</Label>
            <Input
              type="text"
              id="streetAddress"
              value={fromLocationData.streetAddress}
              onChange={(e) =>
                setFromLocationData((prevData) => ({
                  ...prevData,
                  streetAddress: e.target.value,
                }))
              }
              style={{ width: "300px" }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="locality">Locality</Label>
            <Input
              type="text"
              id="locality"
              value={fromLocationData.locality}
              onChange={(e) =>
                setFromLocationData((prevData) => ({
                  ...prevData,
                  locality: e.target.value,
                }))
              }
              style={{ width: "300px" }}
            />
          </FormGroup>
        </Col>

        <Col className="">
          <FormGroup>
            <h3 className="mt-4">
              <TruckDeliverIcon />
              Delivery
            </h3>
            {/* <Label
              for="toPostage"
              className="text-sm font-medium text-gray-600 mt-2"
            >
              Country
            </Label> */}
            <Input
              type="text"
              className="mt-1 p-2 block w-full border rounded-md"
              onChange={(e) => onCountrySearch(e.target.value, false)}
              value={toCountryText}
              onFocus={() => setFilteredToList(countryList)}
              style={{ width: "300px" }}
            >
              {/* <option value={""}>Select Country</option>
              {countryList?.map(({ name, code }) => (
                <option value={code} key={code}>
                  {name}
                </option>
              ))} */}
            </Input>

            {!!filteredToList.length && (
              <div
                className="mt-2"
                style={{
                  maxHeight: "160px",
                  overflowY: "auto",
                  position: "absolute",
                  background: "white",
                }}
              >
                {filteredToList.map((user, i) => (
                  <div
                    key={i}
                    className="cursor-pointer"
                    onClick={() => onCountrySelect(user, false)}
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Label
              for="fromPostage"
              className="text-sm font-medium text-gray-60 mt-2 "
            >
              <SearchIcon /> Search By <br /> Postal Code
            </Label>
            <Input
              type="text"
              className="mt-1 p-2 block w-full border rounded-md"
              onChange={(e) => onPostalCodeSearch(e.target.value, false)}
              value={toPostalCodeText}
              style={{ width: "300px" }}
            />
            {!!filteredToCodeList?.length && (
              <div
                className="mt-2 overflow-y-auto max-h-32"
                style={{
                  maxHeight: "160px",
                  overflowY: "auto",
                  position: "absolute",
                  background: "white",
                }}
              >
                {filteredToCodeList?.map((user, i) => (
                  <div
                    key={i}
                    className="cursor-pointer"
                    onClick={() => onPostalCodeSelect(user, false)}
                  >
                    {user.location} {user.state}
                    {user.postCode}
                  </div>
                ))}
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="streetAddress">Street Address:</Label>
            <Input
              type="text"
              id="streetAddress"
              value={fromLocationData.streetAddress}
              onChange={(e) =>
                setFromLocationData((prevData) => ({
                  ...prevData,
                  streetAddress: e.target.value,
                }))
              }
              style={{ width: "300px" }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="locality">Locality</Label>
            <Input
              type="text"
              id="locality"
              value={fromLocationData.locality}
              onChange={(e) =>
                setFromLocationData((prevData) => ({
                  ...prevData,
                  locality: e.target.value,
                }))
              }
              style={{ width: "300px" }}
            />
          </FormGroup>
        </Col>
      </Row>
      <h2>
        <ClipboardList />
        Package Details
        <span style={{ marginLeft: "20px" }}>
          <label>
            <input
              type="radio"
              name="unitRadio"
              value="kg/cm"
              checked={selectedUnit === "kg/cm"}
              onChange={handleUnitChange}
              style={{ transform: "scale(1.5)", marginRight: "5px" }}
            />
            kg/cm
          </label>
        </span>
        <span style={{ marginLeft: "20px" }}>
          <label>
            <input
              type="radio"
              name="unitRadio"
              value="lb/in"
              checked={selectedUnit === "lb/in"}
              onChange={handleUnitChange}
              style={{ transform: "scale(1.5)", marginRight: "5px" }}
            />
            lb/in
          </label>
        </span>
      </h2>
      <Row>
        {formData.items.map((item, index) => (
          <Col key={index} md={6}>
            <Card className="mb-3 bg-black">
              <CardBody>
                <CardTitle>{`Item ${index + 1}`}</CardTitle>
                <FormGroup>
                  <Label for={`packageType-${index}`}>Package Type:</Label>
                  <Input
                    className="w-25"
                    type="text"
                    id={`packageType-${index}`}
                    value={item.packageType}
                    onChange={(e) =>
                      handleInputChange(index, "packageType", e.target.value)
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label for={`quantity-${index}`}>Quantity:</Label>
                  <Input
                    className="w-25"
                    type="text"
                    id={`quantity-${index}`}
                    value={item.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for={`weightDead-${index}`}>Weight:</Label>
                  <Input
                    className="w-25"
                    type="text"
                    id={`weightDead-${index}`}
                    value={item.weightDead}
                    onChange={(e) =>
                      handleInputChange(index, "weightDead", e.target.value)
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for={`length-${index}`}>Length:</Label>
                  <Input
                    className="w-25"
                    type="text"
                    id={`length-${index}`}
                    value={item.length}
                    onChange={(e) =>
                      handleInputChange(index, "length", e.target.value)
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for={`width-${index}`}>Width:</Label>
                  <Input
                    className="w-25"
                    type="text"
                    id={`width-${index}`}
                    value={item.width}
                    onChange={(e) =>
                      handleInputChange(index, "width", e.target.value)
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for={`height-${index}`}>Height:</Label>
                  <Input
                    className="w-25"
                    type="text"
                    id={`height-${index}`}
                    value={item.height}
                    onChange={(e) =>
                      handleInputChange(index, "height", e.target.value)
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for={`satchelSize-${index}`}>Satchel Size:</Label>
                  <Input
                    className="w-25"
                    type="text"
                    id={`satchelSize-${index}`}
                    value={item.satchelSize}
                    onChange={(e) =>
                      handleInputChange(index, "satchelSize", e.target.value)
                    }
                  />
                </FormGroup>
                <div className="">
                  <Button color="danger" onClick={() => removeItem(index)}>
                    Remove Item
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Button color="primary" className="w-25 ml-5" onClick={addNewItem}>
          Add Item
        </Button>
        <Button
          disabled={!fromPostalCode || !totext}
          className="bg-primary text-white py-2 px-4 rounded-md cursor-pointer w-25"
          onClick={handleReportClick}
        >
          Go
        </Button>
      </Row>

      {/* Display the formData for testing purposes */}
      {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
    </div>
    // </Container>
  );
};

export default SystemList;
