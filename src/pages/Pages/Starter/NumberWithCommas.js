import React from "react";

function NumberWithCommas({ number }) {
  if (typeof number !== 'number' || isNaN(number)) {
    return <span>Invalid number</span>; // Handle the case where number is not a valid number
  }

  const formattedNumber = number.toLocaleString();

  return <span>{formattedNumber}</span>;
}

export default NumberWithCommas;
