import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { useDispatch } from "react-redux";
import PickupService from "../../../services/PickupService/PickupService";
import { setAddressOptions } from "../../../slices/address/addressSlice";

const AddressSelect = ({ address, setAddress, addressDetails }) => {
  // console.log("🚀 ~ AddressSelect ~ address:", address);
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();

  // const loadAddressOptions = async (inputValue, callback) => {
  //   try {
  //     if (inputValue.length < 3) {
  //       callback([]);
  //       return;
  //     }

  //     const response = await PickUpService.pickUp(inputValue);
  //     const options = response?.data?.map((address) => ({
  //       value: address,
  //       label: address,
  //     }));

  //     // const options = response?.data?.map((item) => ({
  //     //   value: item.description, // Set value to the description
  //     //   label: item.description, // Display the description as the label
  //     // }));

  //     callback(options);
  //     dispatch(setAddressOptions(options));
  //   } catch (error) {
  //     console.error("Error fetching address options:", error);
  //   }
  // };
  const [selectedValue, setSelectedValue] = useState(
    address ? { value: address, label: address } : null
  );

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption); // Update local state
    setAddress(selectedOption); // Update the parent state
  };

  const loadAddressOptions = async (inputValue, callback) => {
    try {
      if (inputValue.length < 3) {
        callback([]);
        return;
      }

      const response = await PickupService.pickUp(inputValue);
      console.log("REsponse is", response);
      // Map response to use 'description' as both the label and value
      const options = response?.map((address) => ({
        value: address.place_id,
        label: address.description,
      }));

      // Pass the options to the AsyncSelect callback
      callback(options);

      // Dispatch options to Redux if needed
      dispatch(setAddressOptions(options));
    } catch (error) {
      console.error("Error fetching address options:", error);
    }
  };

  const customComponents = {
    DropdownIndicator: () => (
      <span style={{ margin: "0 8px", color: "#6c757d", fontSize: "20px" }}>
        <i className="bx bx-map" />
      </span>
    ),
  };
  const handleClear = () => {
    setAddress(null); // Clear parent state
    setSelectedValue(null);
  };
  return (
    <div className=" form-floating1 mb-1">
      <AsyncSelect
        name="address"
        id="floatingInput1"
        className="py-0 select-custom"
        // defaultValue={address}
        value={selectedValue} // Address object or null if not selected
        onChange={handleChange} // Set the entire selected object
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        loadOptions={loadAddressOptions}
        // placeholder={isFocused || address ? address || "" : "Pickup address"} // Display label if address exists
        // placeholder="Enter pickup address in [unit xx x street  suburb state] format"
        placeholder="Enter the full address"
        isClearable={true}
        onClear={handleClear} // Handle clear manually
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "#CED4DA" : "#CED4DA",
            padding: "0.4rem",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 1050,
          }),
        }}
        components={customComponents}
      />
      {(address?.label || isFocused) && (
        <label htmlFor="floatingInput1" className="label-floating1">
          Pickup address
        </label>
      )}
    </div>
  );
};

export default AddressSelect;

// import React, { useState } from "react";
// import AsyncSelect from "react-select/async";
// import { useDispatch } from "react-redux";
// import { setAddressOptions } from "src/slices/addressSlice";
// import PickUpService from "src/services/PickupService/PipckupService";

// const AddressSelect = ({ address, setAddress }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const dispatch = useDispatch();

//   const loadAddressOptions = async (inputValue, callback) => {
//     try {
//       if (inputValue.length < 3) {
//         callback([]);
//         return;
//       }

//       const response = await PickUpService.pickUp(inputValue);
//       console.log("Response is", response);

//       // Map response to use 'description' as both the label and value
//       const options = response?.map((address) => ({
//         value: address.place_id,
//         label: address.description,
//       }));

//       // Pass the options to the AsyncSelect callback
//       callback(options);
//       dispatch(setAddressOptions(options));
//     } catch (error) {
//       console.error("Error fetching address options:", error);
//     }
//   };

//   const handleAddressChange = async (selectedOption) => {
//     if (selectedOption) {
//       // Set the selected address
//       setAddress(selectedOption);

//       // Call the addressDetail API with the selected place_id
//       const addressDetail = await PickUpService.addressDetail(
//         selectedOption.value
//       );
//       console.log("Address detail is:", addressDetail);

//       // Handle address detail response as needed (e.g., save to state, dispatch, etc.)
//       // For example, if you need to set it to another piece of state:
//       // setSelectedAddressDetail(addressDetail);
//     }
//   };

//   const customComponents = {
//     DropdownIndicator: () => (
//       <span style={{ margin: "0 8px", color: "#6c757d", fontSize: "20px" }}>
//         <i className="bx bx-map" />
//       </span>
//     ),
//   };

//   return (
//     <div className="mb-3 form-floating1">
//       <AsyncSelect
//         name="address"
//         id="floatingInput1"
//         className="py-0 select-custom"
//         value={address || null} // Address object or null if not selected
//         onChange={handleAddressChange} // Updated onChange handler
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         loadOptions={loadAddressOptions}
//         placeholder={
//           isFocused || address ? address?.label || "" : "Pickup address"
//         } // Display label if address exists
//         isClearable
//         styles={{
//           control: (baseStyles, state) => ({
//             ...baseStyles,
//             borderColor: state.isFocused ? "#CED4DA" : "#CED4DA",
//           }),
//         }}
//         components={customComponents}
//       />
//       {(address?.label || isFocused) && (
//         <label htmlFor="floatingInput1" className="label-floating1">
//           Pickup address
//         </label>
//       )}
//     </div>
//   );
// };

// export default AddressSelect;
