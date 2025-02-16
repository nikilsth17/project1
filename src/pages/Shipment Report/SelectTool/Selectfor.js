// Selectfor.js
import React from 'react';
import Select from 'react-select';

const Selectfor = ({ name, id, value, onChange, options, className, onBlur }) => {
    return (
        <Select
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            className={className}
            onBlur={onBlur}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </Select>
    );
};

export default Selectfor;
