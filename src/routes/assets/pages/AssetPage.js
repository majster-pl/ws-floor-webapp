import { useParams } from "react-router-dom";
import { Container, Button, Tabs, Tab, Badge } from "react-bootstrap";
import IsLoggedInLogic from "../../../components/IsLoggedInLogic";
import { useState, useEffect, Fragment } from "react";
import apiClient from "../../../service/api/api";
import moment from "moment";
import { useHistory } from "react-router-dom";
import GeneralTab from "./tabs/GeneralTab";
import HistoryTab from "./tabs/HistoryTab";
import OpenJobs from "./tabs/ActiveJobs";
import { useSelector } from "react-redux";

function AssetPage({
  isLoading,
  setIsLoading,
  setLoggedIn,
  setLoginErrorMsg,
  toast,
}) {
  // when page oppened check if user logged in, if not redirect to login page
  const {} = IsLoggedInLogic(setLoginErrorMsg, setIsLoading, setLoggedIn);
  const history = useHistory();
  const eventsHistoryCount = useSelector((state) => state.events_history_count);
  const eventsActiveCount = useSelector((state) => state.events_active_count);

  const [valid, setValid] = useState(true);

  const { uuid } = useParams(); // parameter from url

  const [formGeneral, setFormGeneral] = useState({
    id: "",
    reg: "",
    status: "",
    model: "",
    make: "",
    created_by_name: "",
    belongs_to: "",
    customer_name: "",
    customer_id: "",
    created_at: "",
    updated_at: "",
    uuid: "",
  });
  const [toggleEditForm, setToggleEditForm] = useState(true); // state of edit/save button
  const [key, setKey] = useState("general"); // current tab state

  // fech data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.get("/api/v1/assets/" + uuid);
        console.log(result.data.data);
        setFormGeneral({ ...result.data.data });
        // setIsLoading(false);
      } catch (error) {
        toast.error(error.data.message);
        setValid(false);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="scroll">
      {isLoading == true ? (
        <Container></Container>
      ) : (
        <Container className="py-3">
          <Container className="my-2 mb-4">
            <div className="row justify-content-between">
              <div className="col-12 col-md-4  mb-3">
                <Button
                  className="mt-1"
                  variant="light"
                  onClick={() => history.goBack()}
                >
                  Back
                </Button>
              </div>
              {valid ? (
                <div className="col-12 col-md-6">
                  <div className="row mx-auto my-2">
                    <div className="col-5 mx-auto bg-info rounded text-center">
                      <div className="fs-2 my-auto fw-bold text-uppercase disable-select text-sendary-extra ">
                        &nbsp;{formGeneral.reg}&nbsp;
                      </div>
                    </div>
                  </div>
                  <div className="col text-center mt-3 h4">
                    <div className="row ">
                      <div className="col-auto mx-auto">
                        <div>
                          Added
                          <span className="fs-3 mx-2 text-success fw-bold">
                            {moment(formGeneral.created_at).format(
                              "DD/MM/YYYY"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="col-auto mx-auto">
                        Status
                        <label
                          className={`fs-3 mx-2 text-capitalize fw-bold text-${
                            formGeneral.status === "active" ? "success" : "info"
                          } `}
                        >
                          {formGeneral.status.replace("_", " ")}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </Container>

          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
          >
            {/* General */}
            <Tab
              eventKey="general"
              title="General"
              style={{ minHeight: "30rem" }}
              className="bg-darker border-start border-end border-bottom shadow"
              disabled={!valid}
            >
              {valid ? (
                <GeneralTab
                  id={uuid}
                  toast={toast}
                  formGeneral={formGeneral}
                  setFormGeneral={setFormGeneral}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setToggleEditForm={setToggleEditForm}
                  toggleEditForm={toggleEditForm}
                />
              ) : (
                <Container className="py-3">No data availabe</Container>
              )}
            </Tab>

            {/* Active Jobs */}
            <Tab
              eventKey="bookings"
              title={
                <Fragment>
                  Active Jobs
                  <Badge className="ms-1" bg="secondary" text="white">
                    {eventsActiveCount}
                  </Badge>
                </Fragment>
              }
              style={{ minHeight: "30rem" }}
              className="bg-darker border-start border-end border-bottom shadow"
              disabled={!valid}
            >
              {valid ? (
                <OpenJobs uuid={uuid} toast={toast} />
              ) : (
                <Container className="py-3">No data availabe</Container>
              )}
            </Tab>
            <Tab
              eventKey="history"
              title={
                <Fragment>
                  History
                  <Badge className="ms-1" bg="secondary" text="white">
                    {eventsHistoryCount}
                  </Badge>
                </Fragment>
              }
              style={{ minHeight: "30rem" }}
              className="bg-darker border-start border-end border-bottom shadow"
              disabled={!valid}
            >
              {valid ? (
                <HistoryTab id={uuid} toast={toast} />
              ) : (
                <Container className="py-3">No data availabe</Container>
              )}
            </Tab>
          </Tabs>
        </Container>
      )}
    </div>
  );
}

export default AssetPage;
