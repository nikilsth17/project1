import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

const BreadCrumb = ({ title, pageTitle, breadcrumbItems }) => {
  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <div className="page-title-left">
              {pageTitle && (
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item ">
                    <Link to="#">{pageTitle}</Link>
                  </li>
                  <li className="breadcrumb-item active">{title}</li>
                </ol>
              )}
            </div>

            <div className="page-title-right">
              <div className="d-flex align-items-center justify-content-center">
                {breadcrumbItems &&
                  breadcrumbItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <div style={{ width: "2rem" }}>
                          {/* Adjust width to create gap */}
                        </div>
                      )}
                      <li
                        className={`breadcrumb-item ${
                          index === breadcrumbItems.length - 1 ? "active" : ""
                        }`}
                      >
                        {item.link ? (
                          <Link to={item.link} style={{ color: "blue" }}>
                            {item.title}
                          </Link>
                        ) : (
                          <span>{item.title}</span>
                        )}
                      </li>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;
