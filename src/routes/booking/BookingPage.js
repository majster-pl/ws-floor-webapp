import React from 'react'
import { useParams } from "react-router-dom";
import { Container } from 'react-bootstrap';

const BookingPage = () => {
  const { uuid } = useParams(); // parameter from url

  return (
    <Container className="scroll py-3">
      <h2>
        Booking details:     
      </h2>
      Booking page for event id: {uuid}
    </Container>
  );
};

export default BookingPage