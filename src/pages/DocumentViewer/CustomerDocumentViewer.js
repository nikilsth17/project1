import axios from "axios";
import React, { useEffect, useState } from "react";
import { Triangle } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";

const CustomerDocumentViewer = () => {
  const { id } = useParams();
  const [pdfData, setPdfData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("jwtToken");

        const response = await axios.get(
          `${window.APP_CONFIG.api1.baseapi}/shipment/${id}/customerlabel`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "arraybuffer",
          }
        );
        setPdfData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setLoading(false);
      }
    };
    fetchPdf();
  }, []);

  return (
    <div className="">
      {loading ? (
        <Row className="justify-content-center mt-5">
          <Col xs={2}>
            <Triangle
              visible={true}
              height="120"
              width="120"
              color="#5B71B9"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <h3 className="mt-1">Loading...</h3>
          </Col>
        </Row>
      ) : (
        <embed
          src={window.URL.createObjectURL(
            new Blob([pdfData], { type: "application/pdf" })
          )}
          type="application/pdf"
          style={{
            width: "100vw",
            height: "100vh",
          }}
        />
      )}
      {/* {pdfData && (
       
      )} */}
    </div>
  );
};

export default CustomerDocumentViewer;
