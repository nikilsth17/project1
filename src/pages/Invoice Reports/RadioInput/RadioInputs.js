import React from "react";
import { Label, Input, FormGroup } from "reactstrap";

const RadioInputs = ({ name, options, selectedOption, onChange }) => {
  const handleNoneOption = () => {
    onChange(""); // Reset selected option
  };

  return (
    <FormGroup>
      {options.map((option) => (
        <div key={option.value} className="form-check form-check-inline">
          <Label check>
            <Input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedOption === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="form-check-input"
            />
            {option.label}
          </Label>
        </div>
      ))}
      {/* Add a "None" option */}
      <div className="form-check form-check-inline">
        <Label check>
          <Input
            type="radio"
            name={name}
            value=""
            checked={!selectedOption} // Checked if no option is selected
            onChange={handleNoneOption} // Handle the "None" option selection
            className="form-check-input"
          />
          None
        </Label>
      </div>
    </FormGroup>
  );
};

export default RadioInputs;
