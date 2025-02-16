import React from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

const CustomInput = (props) => {
  return (
    <FormGroup>
      <Label className="mb-2">{props.label}:</Label>
      <Input {...props} />
      {props.invalid && <FormFeedback>{props.errors}</FormFeedback>}
    </FormGroup>
  );
};

export default CustomInput;
