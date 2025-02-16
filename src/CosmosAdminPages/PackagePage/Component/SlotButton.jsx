// src/components/SlotButton.js

import React from "react";
import { Button } from "reactstrap";
import "./Button.css";

const getButtonColor = (slot, selectedSlots) => {
  if (slot.is_booked) {
    return "#C1ECFF"; // Light blue color for booked slots
  } else if (!slot.is_available) {
    return "#A0A0A0"; // grey color for available slots when is_available is false
  } else if (selectedSlots[0]?.id === slot.id) {
    return "#FE7D29"; // Orange color for selected slot
  } else {
    return "#65a765"; // green color for other slots
  }
};

const getH6Class = (slot, selectedSlots) => {
  if (slot.is_booked) {
    return "text-black"; // Use text-black for booked slots
  } else if (!slot.is_available) {
    return "text-black"; // Use text-black for unavailable slots
  } else if (selectedSlots[0]?.id === slot.id) {
    return "text-white"; // Use text-white for selected slots
  } else {
    return "text-white"; // Use text-white for other slots
  }
};

const SlotButton = ({ slot, selectedSlots, onClick, selectedDate }) => {
  return (
    <div className="d-flex flex-wrap">
      <Button
        size="sm"
        className={selectedSlots?.id === slot.id ? "active" : ""}
        style={{
          backgroundColor: getButtonColor(slot, selectedSlots),
          border: "none",
          color: "white",
          textAlign: "center",
          minWidth: "98%",
        }}
        disabled={!slot.is_available || !selectedDate} // Disable when is_available is false or no date is selected
        onClick={() => onClick(slot)}
      >
        <h6 className={getH6Class(slot, selectedSlots)}>
          {slot.is_booked ? "Booked" : slot.label}
        </h6>
      </Button>
    </div>
  );
};

export default SlotButton;
