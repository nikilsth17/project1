// StatusRadioButtons.js

import React from 'react';
import { FormGroup, Label, Input, Col } from 'reactstrap';

const StatusRadioButtons = ({ formik }) => {
    const handleRadioChange = (value) => {
        formik.handleChange({
          target: {
            name: 'status',
            value: value,
            type: 'radio'
          },
        });
      };
  return (
    <FormGroup className="status-radio-buttons">
    <span>
      <Label check>
        <Input
          type="radio"
          name="status"
        className='ms-1'
          value={true}
          checked={formik.values.status === true}
          onChange={() => handleRadioChange(true)}
        />
       <span className='ms-2'>Active</span> 
      </Label>
    </span>
    <span className='ms-4'>
      <Label check>
        <Input
          type="radio"
          name="status"
        
          value={false}
          checked={formik.values.status === false}
          onChange={() => handleRadioChange(false)}
        />
         <span className='ms-2'>Inactive</span> 
      </Label>
    </span>
  </FormGroup>
  );
};

export default StatusRadioButtons;
