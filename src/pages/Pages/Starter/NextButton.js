import React from "react";

function NextButton({ onClick, isDisabled }) {
  return (
    <button
      className="page-item pagination-next"
      onClick={onClick}
      disabled={isDisabled}
    >
      Next
    </button>
  );
}

export default NextButton;
