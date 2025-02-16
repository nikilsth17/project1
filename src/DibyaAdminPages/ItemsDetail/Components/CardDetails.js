import React from "react";
import { Container, Row, Card } from "reactstrap";
import { useContext } from "react";
import ladduImage from "../../img/Laddu.png";
import { ItemContext } from "../Details";

const CardDetails = ({ maxHeight, maxWidth }) => {
  const itemDetail = useContext(ItemContext);
  return (
    <div className="d-flex justify-content-center align-items-center">
      <Container>
        <Card
          style={{
            maxHeight,
            maxWidth,
            backgroundColor: "rgb(245, 244, 244)",
            borderRadius: "35px 35px 35px 35px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Row className="flex-grow-1">
            <p className="text-black fw-bold text-center fs-20 my-auto ">
              {itemDetail?.name}
            </p>
            <p className="text-black fw-bold text-center my-auto ">
              {" "}
              {itemDetail?.description}
            </p>
            <p className="text-black text-center pt-2"> {itemDetail?.price}</p>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default CardDetails;
