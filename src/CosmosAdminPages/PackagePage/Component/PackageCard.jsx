import React from "react";
import PropTypes from "prop-types";
import {
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from "reactstrap";
import { useNavigate} from "react-router-dom";
import save from "../../../assets/images/Group9.png";
import { useDispatch } from "react-redux";

const PackageCard = ({
  rate,
  type,
  show,
  FreePickup,

  per,
  id,
  planButtonClassname,
  is_popular,
  showButton,
  discount,
  discountIcon,
  show_promotion,
  promotion_text,
  details,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Conditionally set card background color based on the ribbon prop
  const backgroundColor = is_popular
    ? "rgba(255, 244, 236, 1)" // color when ribbon is true
    : "rgba(235, 252, 255, 1)"; // color when ribbon is false


  return (
    <Card
      className="pricing-box ribbon-box right"
      style={{ borderRadius: 10, backgroundColor }}
    >
      {is_popular ? (
        <div className="ribbon-two ribbon-two-orange">
          <span>Popular</span>
        </div>
      ) : null}
      <CardTitle style={{ marginLeft: 20 }}>
        <div className="pt-4">
          <h2 className="fs-30">
            <sup className="fw-light">
              <small>$ </small>
            </sup>
            <span className="fs-30 fw-bold">{rate}</span>
            <sup className="fw-light">
              <small>.00 </small>
            </sup>
            <span
              className="fs-10 text-muted "
              style={{ textTransform: "uppercase" }}
            >
              {per}
            </span>
          </h2>
        </div>
      </CardTitle>
      {show === true ? (
        <CardSubtitle>
          <div
            className="d-flex align-items-center bg-white gap-3"
            style={{ paddingLeft: 20, height: "60px" }}
          >
            <div className="d-flex flex-wrap w-50">
              <h5 className="mb-1 fw-bold fs-16">{type}</h5>
            </div>
            {show_promotion && (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img src={save} alt="icon" style={{ width: "100%" }} />
                <h6
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#fff", // Change the text color to contrast with the image
                    padding: "5px", // Optional: Add padding for spacing
                  }}
                >
                  SAVE
                  <span className="fw-bold">${promotion_text}</span>
                </h6>
              </div>
            )}
          </div>
        </CardSubtitle>
      ) : null}

      <CardBody className="m-2">
        <div>
          <ul className="list-unstyled vstack gap-1 fs-12">
            {details?.map((item) => (
              <React.Fragment key={item.id}>
                <li className="d-flex justify-content-between">
                  <span>{item.title}</span>
                  <span className="fw-bold">{item.value}</span>
                </li>
                <hr className="my-0 text-muted" />
              </React.Fragment>
            ))}
            <li className="d-flex flex-column gap-1">
              <span>Free Pickup & Drop Off</span>
              <span>{FreePickup}</span>
            </li>
          </ul>
          {showButton && (
            <div className="mt-4">
              <button
                type="button"
                className={`btn btn-outline-primary ${planButtonClassname}`}
                // onClick={() => navigate(`/book-driving-lesson/${id}`)}
                onClick={handleBookNew}
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

PackageCard.propTypes = {
  rate: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  show_promotion: PropTypes.bool,
  Instruction: PropTypes.string,
  Lessons: PropTypes.string,
  CarType: PropTypes.string.isRequired,
  FreePickup: PropTypes.string,
  TheoryPractice: PropTypes.string,
  Time: PropTypes.string,
  Duration: PropTypes.string,
  popular: PropTypes.bool,
  cardColorClassName: PropTypes.string,
  per: PropTypes.string,
  id: PropTypes.string.isRequired,
  planButtonClassname: PropTypes.string.isRequired,
  is_popular: PropTypes.bool,
  showButton: PropTypes.bool,
  promotion_text: PropTypes.string,
  discountIcon: PropTypes.string,
  details: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      value: PropTypes.string,
    })
  ).isRequired,
  show: PropTypes.string,
};

export default PackageCard;
