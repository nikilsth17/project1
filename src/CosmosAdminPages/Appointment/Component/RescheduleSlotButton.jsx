import React from "react";
import { Button } from "reactstrap";
import "./Button.css";

// Function to get button color based on slot state
const getButtonColor = (slot, selectedSlots) => {
  if (slot.is_booked) {
    return "#C1ECFF"; // Light blue for booked slots
  } else if (!slot.is_available) {
    return "#A0A0A0"; // Grey for unavailable slots
  } else if (selectedSlots?.id === slot.id) {
    return "#FE7D29"; // Orange for selected slots
  } else {
    return "#65a765"; // Green for available slots
  }
};

// Function to determine the text color class based on slot state
const getH6Class = (slot, selectedSlots) => {
  if (slot.is_booked || !slot.is_available) {
    return "text-black"; // Black text for booked/unavailable slots
  } else if (selectedSlots?.id === slot.id) {
    return "text-white"; // White text for selected slots
  } else {
    return "text-white"; // White text for other slots
  }
};

// RescheduleSlotButton component
const RescheduleSlotButton = ({ slot, selectedSlots, onClick, selectedDate, totalSelectedSlots }) => {
  // Determine if the slot is already in totalSelectedSlots
  const isSlotDisabled = totalSelectedSlots.some(
    (selectedSlot) => selectedSlot.id === slot.id
  );
  const isAlreadySelected = selectedSlots?.id === slot.id;


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
        disabled={!slot.is_available || !selectedDate || isSlotDisabled || isAlreadySelected} // Disable if slot is unavailable or already selected
        onClick={() => onClick(slot)} // Handle click event
      >
        <h6 className={getH6Class(slot, selectedSlots)}>
          {slot.is_booked ? "Booked" : slot.label} {/* Display 'Booked' for booked slots, else show the label */}
        </h6>
      </Button>
    </div>
  );
};

export default RescheduleSlotButton;
