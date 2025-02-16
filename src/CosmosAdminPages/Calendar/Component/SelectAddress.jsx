// import React, { useState } from "react";
// import AsyncSelect from "react-select/async";
// import { useDispatch } from "react-redux";
// import { setAddressOptions } from "../../../slices/address/addressSlice";
// import PickupService from "../../../services/PickupService/PickupService";
// import { Label } from "reactstrap";

// const AddressSelect = ({ address, setAddress, selectedPackage }) => {
//   console.log("🚀 ~ AddressSelect ~ address:", address)

//   const [isFocused, setIsFocused] = useState(false);
//   const dispatch = useDispatch();
//   const [selectedValue, setSelectedValue] = useState(
//     address ? { value: address, label: address } : null 
//   );
//   const handleChange = (selectedOption) => {
//     setSelectedValue(selectedOption); // Update local state
//     setAddress(selectedOption); // Update the parent state
//   };
 
//   const loadAddressOptions = async (inputValue, callback) => {
//     try {
//       if (inputValue.length < 3) {
//         callback([]);
//         return;
//       }

//       const response = await PickupService.pickUp(inputValue);
//       console.log("REsponse is", response);
//       // Map response to use 'description' as both the label and value
//       const options = response?.map((address) => ({
//         value: address.place_id,
//         label: address.description,
//       }));

//       // Pass the options to the AsyncSelect callback
//       callback(options);

//       // Dispatch options to Redux if needed
//       dispatch(setAddressOptions(options));
//     } catch (error) {
//       console.error("Error fetching address options:", error);
//     }
//   };


//   const customComponents = {
//     DropdownIndicator: () => (
//       <span style={{ margin: "0 8px", color: "#6c757d", fontSize: "20px" }}>
//         <i className="bx bx-map" />
//       </span>
//     ),
//   };
  
//   const handleClear = () => {
//     setAddress(null); // Clear parent state
//     setSelectedValue(null)
//   };
//   return (
//     <div className=" form-floating1 mb-1">
//       <AsyncSelect
//         name="address"
//         id="floatingInput1"
//         className="py-0 select-custom"
//         // defaultValue={address}
//         value={selectedValue} // Address object or null if not selected
//         onChange={handleChange} // Set the entire selected object
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         loadOptions={loadAddressOptions}
//         // placeholder={isFocused || address ? address || "" : "Pickup address"} // Display label if address exists
//         // placeholder="Enter pickup address in [unit xx x street  suburb state] format"
//         placeholder="Enter the full address"
//         isClearable={true}
//         onClear={handleClear} // Handle clear manually

//         styles={{
//           control: (baseStyles, state) => ({
//             ...baseStyles,
//             borderColor: state.isFocused ? "#CED4DA" : "#CED4DA",
//             padding:"0.4rem"
//           }),
//           menu: (base) => ({
//             ...base,
//             zIndex: 1050, // Adjust as needed
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


import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { useDispatch } from "react-redux";
import { setAddressOptions } from "../../../slices/address/addressSlice";
import PickupService from "../../../services/PickupService/PickupService";
import { Label } from "reactstrap";

const AddressSelect = ({ address, setAddress, selectedPackage }) => {
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();
  
  // Initialize selectedValue based on address prop
  const [selectedValue, setSelectedValue] = useState(null);

  // Update selectedValue when address prop changes
  useEffect(() => {
    if (address) {
      // Handle both string and object formats of address
      if (typeof address === 'string') {
        setSelectedValue({ value: address, label: address });
      } else if (typeof address === 'object' && address.label) {
        setSelectedValue(address);
      } else if (typeof address === 'object' && address.value) {
        setSelectedValue({ value: address.value, label: address.value });
      }
    } else {
      setSelectedValue(null);
    }
  }, [address]);

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption);
    setAddress(selectedOption);
  };

  const loadAddressOptions = async (inputValue, callback) => {
    try {
      if (inputValue.length < 3) {
        callback([]);
        return;
      }

      const response = await PickupService.pickUp(inputValue);
      const options = response?.map((address) => ({
        value: address.place_id,
        label: address.description,
      }));

      callback(options);
      dispatch(setAddressOptions(options));
    } catch (error) {
      console.error("Error fetching address options:", error);
      callback([]);
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
    setAddress(null);
    setSelectedValue(null);
  };

  // If there's an initial address but no options loaded yet, create a default option
  const defaultOptions = selectedValue ? [selectedValue] : [];

  return (
    <div className="form-floating1 mb-1">
      <AsyncSelect
        name="address"
        id="floatingInput1"
        className="py-0 select-custom"
        value={selectedValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        loadOptions={loadAddressOptions}
        defaultOptions={defaultOptions}
        placeholder="Enter the full address"
        isClearable={true}
        onClear={handleClear}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "#CED4DA" : "#CED4DA",
            padding: "0.4rem"
          }),
          menu: (base) => ({
            ...base,
            zIndex: 1050,
          }),
        }}
        components={customComponents}
      />
      {(selectedValue?.label || isFocused) && (
        <label htmlFor="floatingInput1" className="label-floating1">
          Residential address
        </label>
      )}
    </div>
  );
};

export default AddressSelect;