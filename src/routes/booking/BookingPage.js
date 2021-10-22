import React from 'react'
import { useParams } from "react-router-dom";

const BookingPage = () => {
  const { id } = useParams(); // parameter from url

  return <div>Booking page for event id: {id}</div>;
};

export default BookingPage