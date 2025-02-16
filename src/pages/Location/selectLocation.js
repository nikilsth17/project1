/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PostageEditor = () => {
  const [users, setUsers] = useState([]);
  const [text, setText] = useState();
  const [fromPostalCode, setFromPostalCode] = useState();
  const [toPostalCode, setToPostalCode] = useState();
  const [tousers, setToUsers] = useState([]);
  const [totext, setToText] = useState();
  const navigate = useNavigate();
  // const [data, setData] = useState([]);
  const [countryList, setCountryList] = useState();
  const [fromLocation, setFromLocation] = useState();
  const [fromPostageData, setFromPostageData] = useState({});
  const [toPostageData, setToPostageData] = useState({});

  useEffect(() => {
    (() => {
      axios
        .post(`http://temp.rishanshrestha.com.np/api/country/get-country`)
        .then((res) => setCountryList(res?.data));
    })();
    const fetchFromPostageData = async () => {
      if (fromPostalCode) {
        const response = await axios.get(
          // `http://api.parcelcalculator.sebs.asia/PostalCode/search?query=${fromPostalCode}`
          `http://temp.rishanshrestha.com.np/api/PostalCode/search?query=${fromPostalCode}`
        );
        setFromPostageData(response.data);
      }
    };

    const fetchToPostageData = async () => {
      if (toPostalCode) {
        const response = await axios.get(
          // `http://api.parcelcalculator.sebs.asia/api/Country/get-country?countryCode=${toPostalCode}`
          `http://temp.rishanshrestha.com.np/api/country/get-country`
        );
        setToPostageData(response.data);
      }
    };

    fetchFromPostageData();
    fetchToPostageData();
  }, [fromPostalCode, toPostalCode]);

  const loadUser = async (query, isFromCode) => {
    const response = await axios.get(
      // `http://api.parcelcalculator.sebs.asia/PostalCode/search?query=${query}`
      `http://temp.rishanshrestha.com.np/api/PostalCode/search?query=${query}`
    );
    console.log(response);
    isFromCode ? setUsers(response.data) : setToUsers(response.data);
  };

  const onUserHandler = (location, isFromCode) => {
    let simplifiedLocation =
      location.location + " " + location.state + " " + location.postCode;
    if (isFromCode) {
      setFromPostalCode(location.postCode);
      setText(simplifiedLocation);
      setFromLocation(location);
    } else {
      setToPostalCode(location.postCode);
      setToText(simplifiedLocation);
    }

    isFromCode ? setUsers([]) : setToUsers([]);
  };

  const OnChnageHandler = (text, isFromCode) => {
    setText(text);
    if (text.length >= 3) {
      loadUser(text, isFromCode);
    } else {
      isFromCode ? setUsers([]) : setToUsers([]);
    }
  };

  const handleReportClick = () => {
    navigate(`/postage-display/${fromPostalCode}/${totext}`, {
      state: { fromLocation },
    });
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fromPostage"
              className="block text-sm font-medium text-gray-600"
            >
              From Postage
            </label>
            <input
              type="text"
              className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => OnChnageHandler(e.target.value, true)}
              value={text}
            />
            {!!users.length && (
              <div className="mt-2 overflow-y-auto max-h-32">
                {users?.map((user, i) => (
                  <div
                    key={i}
                    className="cursor-pointer"
                    onClick={() => onUserHandler(user, true)}
                  >
                    {user.location} {user.state}
                    {user.postCode}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="toPostage"
              className="block text-sm font-medium text-gray-600"
            >
              To Country
            </label>
            <select
              // type="text"
              className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              // onChange={(e) => OnChnageHandler(e.target.value, false)}
              onChange={(e) => setToText(e.target.value)}
              value={totext}
            >
              <option value={""}>Select Country</option>
              {countryList?.map(({ name, code }) => {
                return (
                  <option value={code} key={code}>
                    {name}
                  </option>
                );
              })}
            </select>

            {!!tousers.length && (
              <div className="mt-2 overflow-y-auto max-h-32">
                {tousers?.map((user, i) => (
                  <div
                    key={i}
                    className="cursor-pointer"
                    onClick={() => onUserHandler(user, false)}
                  >
                    {user.location} {user.state}
                    {user.postCode}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <button
            disabled={!fromPostalCode || !totext}
            className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer"
            onClick={handleReportClick}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostageEditor;
