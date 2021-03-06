import { useState, useEffect, useMemo } from "react";
import apiClient from "../../../../service/api/api";
import { useDispatch } from "react-redux";
import { setHistoryEventsCount } from "../../../../actions";
import JobsTable from "../../../../components/JobsTable";

export const HistoryTab = ({ id, toast }) => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHistoryEventsCount(0));
    const fetchEvents = async () => {
      try {
        const result = await apiClient.get("/api/v1/asset_event_history/" + id);
        console.log("result");
        console.log(result);
        setData(result.data.data);
        dispatch(setHistoryEventsCount(Object.keys(result.data.data).length));
      } catch (error) {
        toast.error(error);
      }
    };
    fetchEvents();
  }, []);
  return (
    <div>
      <JobsTable data={data}></JobsTable>
    </div>
  );
};

export default HistoryTab;
