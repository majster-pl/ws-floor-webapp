import { useState, useEffect } from "react";
import apiClient from "../../../../service/api/api";
import { useDispatch } from "react-redux";
// add relevent action
import { setActiveEventsCount } from "../../../../actions";
import JobsTable from "../../../../components/JobsTable";

const ActiveJobs = ({ toast, uuid }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(setActiveEventsCount(0));
    const fetchEvents = async () => {
      try {
        const result = await apiClient.get(
          "/api/v1/asset_event_active/" + uuid
        );
        console.log("result");
        console.log(result);
        setData(result.data.data);
        dispatch(setActiveEventsCount(Object.keys(result.data.data).length));
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

export default ActiveJobs;
