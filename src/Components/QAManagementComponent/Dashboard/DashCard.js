import React from "react";
import { Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

export default function Dashcard(props) {
  const IconComponent = () => {
    // Check if the icon prop is provided and is a non-empty string
    if (props.icon && typeof props.icon === "string") {
      // Split the icon string to get the icon prefix and name
      const [iconPrefix, iconName] = props.icon.split(" ");

      // Render the icon component dynamically
      switch (iconPrefix) {
        case "bx":
          return <i className={`${iconPrefix} ${iconName}`}></i>;
        default:
          return null;
      }
    } else {
      return null;
    }
  };

  return (
    <Col xl={3} md={6}>
      <Link to={props.to}>
        <Card className={"card-animate"}>
          <CardBody>
            <div className="d-flex justify-content-between">
              <div>
                <p className={"fw-semibold mb-0 text-muted fs-15"}>{props.title}</p>
                <h2 className={"mt-4 ff-secondary fw-bold "}>{props.count}</h2>
                {/* <p className={"mb-0 text-b"}>
                  <span className="mb-0 badge bg-light text-success">15%</span>
                  vs. previous month
                </p> */}
              </div>
              <div>
                <div className="avatar-sm rounded-circle flex-shrink-0 ">
                  <span className={`avatar-title bg-secondary rounded-circle fs-2`} style={{ backgroundColor: '#3d78e3' }}>


                    <IconComponent />
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Link>
    </Col>
  );
}
