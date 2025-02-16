import React from "react";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const CreateButton = ({ to, text, value }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };
  return (
    <div>
      <div className="d-flex align-items-center">
        <h5 className="card-title mb-0 flex-grow-1 fs-17">{value}</h5>
        <div className="flex-shrink-0">
          <div className="d-flex gap-2 flex-wrap">
            <Button color="btn btn-soft-success mb-3" onClick={handleClick}>
              {text}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateButton;
