import React from "react";
import withRouter from "../../Components/Common/withRouter";
import { Col, Row } from "reactstrap";
import image1 from "../../assets/project1/Ministeriu_Finansas.png";
import image2 from "../../assets/project1/Reublica.png";
import image3 from "../../assets/project1/Logo-INETL.png";

const ParticlesAuth = ({ children }) => {
  return (
    <React.Fragment>
      <div className="auth-page-wrapper py-4">
        <div className="container">
          {/* <div className="bg-overlay"></div> */}

          {/* <div className="shape">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 1440 120"
            >
              <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
            </svg>
          </div> */}
          <Row className="mb-4">
            <Col md={3}>
              <div className="d-flex justify-content-center align-content-center">
                <img src={image1} className="object-fit-contain w-50" />
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex flex-column gap-3 justify-content-center align-content-center align-items-center">
                <img src={image2} className="object-fit-contain w-25" />
                <div class="text-center">
                  <h6 class="fw-semibold m-0">
                    REPÚBLICA DEMOCRÁTICA DE TIMOR-LESTE <br />
                    MINISTÉRIO DO PLANO E FINANÇAS <br />
                    INSTITUTE OF NATIONAL STATISTICS TIMOR LESTE (INETL)
                  </h6>
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div className="d-flex justify-content-center align-content-center">
                <img src={image3} className="object-fit-contain w-50" />
              </div>
            </Col>
          </Row>
          <div className="d-flex flex-column text-center justify-content-center align-align-items-center align-content-center">
            <h4>Civil Registration Vital Statistics(CRVS)</h4>
            <h5>Data Collection and Monitoring System</h5>
          </div>
        </div>

        {/* pass the children */}
        {children}

        {/* <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    &copy; {new Date().getFullYear()} Cosmos Driving
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer> */}
      </div>
    </React.Fragment>
  );
};

export default withRouter(ParticlesAuth);
