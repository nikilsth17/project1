import React from "react";

function SelectOption({ name, value, onChange, options, placeholder }) {
  return (
    <select
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="form-control"
    >
      <option value="">{placeholder}</option>
      {options.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  );
}

export default SelectOption;
