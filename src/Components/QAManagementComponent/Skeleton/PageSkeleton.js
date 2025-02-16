import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "reactstrap";
import "./CardSkeleton.css";


const PageSkeleton = () => {
  const skeletonCardStyle = {
    height: "100%" || height,
    borderRadius: "2px",
    backgroundColor: "#F2F1FB",
    transition: "transform 0.3s",
  };

  return (
    <Card className="text-center d-flex loading-skeleton" style={skeletonCardStyle}>
      <CardHeader className="p-0 bg-transparent border-0 px-2 pt-2">
        <div className="d-flex justify-content-end align-items-end">
          {/* Your header content */}
        </div>
      </CardHeader>
      <CardBody className=" d-flex flex-column">
        {/* Loading skeleton content */}


        <div className="d-flex skeleton-line py-2 my-2" />
        <div className="d-flex skeleton-line py-2 my-2" />
        <div className="d-flex skeleton-line py-2 my-2" />
        <div className="d-flex skeleton-line py-2 my-2" />
        <div className="d-flex skeleton-line py-2 my-2" />
        <div className="d-flex skeleton-line py-2 my-2" />
        <div className="d-flex skeleton-line py-2 my-2" />
        <div className="d-flex skeleton-line py-2 my-2" />
        <div className="d-flex skeleton-line py-2 my-2" />

      </CardBody>
      <CardFooter
        className="bg-transparent border-0"
        style={{ fontSize: "12px" }}
      >
        <div className=" justify-content-end align-items-end text-body-secondary">

        </div>
      </CardFooter>
    </Card>
  );
};

export default PageSkeleton;
