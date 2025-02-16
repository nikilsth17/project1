import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "reactstrap";

const Status = ({ events = [] }) => {
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Sync filteredEvents with events when events are updated
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  console.log(filteredEvents, "DATAAAA");

  const handleUpcoming = () => {
    const now = new Date();
    const upcomingEvents = events
      .filter(event => new Date(event.start) > now) // filter future events
      .sort((a, b) => new Date(a.start) - new Date(b.start)); // sort by nearest date
    setFilteredEvents(upcomingEvents);
  };

  const handlePaid = () => {
    setFilteredEvents(events.filter(event => event.status === "PAID"));
  };

  const handlePending = () => {
    setFilteredEvents(events.filter(event => event.status === "PENDING"));
  };

  return (
    <>
      <p className="text-muted fs-6 text-center mb-0">Select the status</p>
      <Row>
        <Button onClick={handleUpcoming} className="btn-soft-info mb-2">
          Upcoming
        </Button>
        <Button onClick={handlePaid} className="btn-soft-warning mb-2">
          Paid
        </Button>
        <Button onClick={handlePending} className="btn-soft-danger mb-2">
          Pending
        </Button>
      </Row>
      <Row>
        {filteredEvents.map(event => (
          <Col key={event.id} sm="12" md="6" lg="8">
            <div className="event-card">
              <h5>{event.title}</h5>
              <p>{event.description}</p>
              <p>{event.location}</p>
              <p>{event.start.toLocaleString()}</p>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Status;
