import { useState, useEffect, useMemo } from "react";
import apiClient from "../../../../service/api/api";
import { useDispatch } from "react-redux";
import { setBookingsCount } from "../../../../actions";
import JobsTable from "../../../../components/JobsTable";

export const BookingsTab = ({ id, toast }) => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBookingsCount(0));
    const fetchEvents = async () => {
      try {
        const result = await apiClient.get("/api/v1/customer_bookings/" + id);
        console.log("result");
        console.log(result);
        setData(result.data.data);
        dispatch(setBookingsCount(Object.keys(result.data.data).length));
      } catch (error) {
        toast.error(error);
      }
    };
    fetchEvents();
  }, []);
  return (
    <JobsTable data={data}/>
  );
};

export default BookingsTab;
