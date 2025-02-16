import React, { useState } from "react";
import { Row, Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import { useParams } from "react-router-dom";
import OrderServices from "../../../services/DibyaServices/OrderServices/OrderServices";
import toast from "react-hot-toast";

const OrderEdit = ({ orderId, onClose, onStatusUpdate,setOrder }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusOptions = [
    // { label: "Ongoing", value: 1 },
    // { label: "Received", value: 2 },
    { label: "Processing", value: 3 },
    { label: "Ready", value: 4 },
    { label: "Delivering", value: 5 },
    { label: "Cancelled", value: 6 },
    {label:"Completed",value:7}
  ];

  const handleSubmit = async () => {
    try {
      if (selectedStatus) {
        await OrderServices.updateOrder(orderId, selectedStatus.value);
        toast.success("Status updated successfully");
        onClose(); 
        onStatusUpdate(selectedStatus); // Pass the updated status to the callback
      
      } else {
        alert("Please select a status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
   
    }
  };

  return (
    <div>
      <Row className="mt-4">
        <Col lg={12}>
          <FormGroup className="po">
            <Label className="mb-0"> Change Order Status</Label>
            <Select
              options={statusOptions}
              isClearable
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <button
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={!selectedStatus} // Disable button if no status is selected
          >
            Update Status
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default OrderEdit;
