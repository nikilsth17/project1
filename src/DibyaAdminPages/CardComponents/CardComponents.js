import React from "react";
import { Container, Row, Card } from "reactstrap";

const CardComponent = ({
  imageName,
  name,
  maxHeight,
  maxWidth,
  subtitle,
  description,
  price,
  title,
}) => {
  return (
    <div className="d-flex justify-content-center align-items-center p-0">
      <Container>
        <Card
          style={{
            maxHeight,
            maxWidth,
            backgroundColor: "rgb(245, 244, 244)",
            borderRadius: "35px 18px 18px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <img src={imageName} alt={name} className="w-full rounded-4" />

          <Row>
            <p className="text-black fw-bold text-center my-auto pt-2">
              {name}
            </p>

            <p className="text-black fw-bold text-center my-auto ">
              {" "}
              {subtitle}
            </p>
            <p className="text-black fw-bold text-center my-auto "> {title}</p>
            <p className="text-black mb-0">{description}</p>
            <em className="text-color text-center mt-0 mb-2">{price}</em>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default CardComponent;
