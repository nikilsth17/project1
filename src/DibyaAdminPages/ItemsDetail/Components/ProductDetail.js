import React, { useContext } from "react";

import { ItemContext } from "../Details";
import { Row } from "reactstrap";

const ProductDetail = () => {
  const itemDetail = useContext(ItemContext);
  console.log("🚀 ~ itemDetail:", itemDetail);

  return (
    <div>
      <Row className="flex-grow-1">
        <p className="text-black fw-bold text-start my-auto fs-18  ">
          {" "}
          {itemDetail?.name}-{itemDetail?.description}
        </p>

        <span className="text-success fw-bold text-end pt-2 fs-16">
          {" "}
          Total Price:{itemDetail?.price}
        </span>
      </Row>
      {/* <Row className="flex-grow-1">
        <p className="text-black fw-bold text-start my-auto fs-18 ">
          Menu Details
        </p>
        <p className="text-muted fs-16">
          {" "}
          {itemDetail.category?.name}-{itemDetail.category?.category_type}-
          {itemDetail.category?.categoryName}
        </p>
      </Row> */}

      <p>
        <span className="fw-bold fs-16" style={{ color: "black" }}>
          More Info:
        </span>
      </p>
      <table
        style={{
          backgroundColor: "#F3F9FF",
          width: "700px",
          height: "150px",
        }}
      >
        <tbody>
          <tr>
            <td className="fw-bold text-black px-2 fs-16">Ingredients:</td>
            <td className="text-black fs-16">{itemDetail?.ingredients}</td>
          </tr>
          <tr>
            <td className="fw-bold text-black px-2 fs-16">Shelf life:</td>
            <td className="text-black fs-16">{itemDetail?.shelfLife}</td>
          </tr>
          <tr>
            <td className="fw-bold text-black px-2 fs-16">Energy:</td>
            <td className="text-black fs-16">{itemDetail?.energy}</td>
          </tr>
          <tr>
            <td className="fw-bold text-black px-2 fs-16">Per serve:</td>
            <td className="text-black fs-16">{itemDetail?.unit}</td>
          </tr>
          <tr>
            <td className="fw-bold text-black px-2 fs-16">Bulk Price:</td>
            <td className="text-black fs-16">{itemDetail?.bulkPrice}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetail;
