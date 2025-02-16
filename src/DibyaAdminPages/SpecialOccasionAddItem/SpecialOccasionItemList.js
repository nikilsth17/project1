import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "reactstrap";
import SpecialOccasionServices from "../../services/DibyaServices/SpecialOccasionServices/SpecialOccasionServices";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";

const SpecialOccasionItemList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOccasion = async () => {
      try {
        const response = await SpecialOccasionServices.specialItems();
        setData(response);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchOccasion();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const breadcrumbItems = [
    {
      title: <Button className="btn btn-soft-success">+ Add New Item</Button>,

      link: "/specialoccasion-item/add",
    },
  ];

  return (
    <div className="page-content">
      <BreadCrumb
        title="Special Occasion Item List"
        pageTitle="Special Occasion Item "
        breadcrumbItems={breadcrumbItems}
      />
      <Row xs="1" md="2">
        {data.map((item) => (
          <Col key={item.id}>
            <Card className="p-3 rounded-4 mb-4">
              <Row>
                <div className="d-flex gap-5">
                  <p>Special Occasion ID: {item.specialOccasionId}</p>
                  <Link to={`/specialoccasion-item/edit/${item.id}`}>
                    <Button
                      color="btn btn-soft-warning"
                      className="btn-sm gap-1 text-end"
                    >
                      <i className="ri-edit-line" />
                    </Button>
                  </Link>
                </div>
                <Col lg={4} className="text-start">
                  <img src={item.item.image} alt={item.item.name} />
                  <span>{item.item.name}</span>
                </Col>

                <Col lg={4} className="text-center">
                  {item.item.description}
                </Col>
                <Col lg={4} className="text-center">
                  {item.item.price}
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SpecialOccasionItemList;
