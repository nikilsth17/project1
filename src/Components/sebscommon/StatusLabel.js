import React from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const StatusLabel = ({ text, isTaxable }) => {
  const badgeColor = isTaxable ? 'bg-success' : 'bg-danger';

  return (
    <span className={`badge ${badgeColor}-subtle text-uppercase text-dark`}>
      {text}
    </span>
  );
};
 export default StatusLabel;
