import { useParams } from "react-router-dom";
import { Container, Button, Tabs, Tab, Badge } from "react-bootstrap";
import { Fragment } from "react";
import IsLoggedInLogic from "../../../components/IsLoggedInLogic";
import { useState, useEffect } from "react";
import apiClient from "../../../service/api/api";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import BookingsTab from "./tabs/BookingsTab";
import AssetsTab from "./tabs/AssetsTab";
import GeneralTab from "./tabs/GeneralTab";

function CustomerPage({ setIsLoading, setLoggedIn, setLoginErrorMsg, toast }) {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );
  const history = useHistory();

  const [valid, setValid] = useState(true);
  const bookingsCount = useSelector((state) => state.bookings_count);

  const { id } = useParams(); // parameter from url

  const [formGeneral, setFormGeneral] = useState({
    id: "",
    customer_name: "",
    email: "",
    status: "",
    assets_total: "",
    created_at: "",
    asset_id: "",
    customer_contact: "",
    created_by_name: "",
    updated_at: "",
    uuid: "",
  });

  const [toggleEditForm, setToggleEditForm] = useState(true); // state of edit/save button
  const [key, setKey] = useState("general"); // current tab state

  // fech data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.get("/api/v1/customers/" + id);
        console.log(result.data.data);
        setFormGeneral(result.data.data);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.data.message);
        setValid(false);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toggleEditForm]);

  return (
    <div className="scroll">
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
            <div className="col-12 col-md-6">
              {valid ? (
                <div className="row mx-auto my-2">
                  <div className="col-auto my-auto">
                    <div className="number-circle-large fs-2 text-pink text-uppercase disable-select">
                      {formGeneral.customer_name !== ""
                        ? formGeneral.customer_name
                            .match(/\b(\w)/g)
                            .join("")
                            .substring(0, 2)
                        : ""}
                    </div>
                  </div>
                  <div className="col text-start">
                    <div className="fs-2">{formGeneral.customer_name}</div>
                    <div className="row ">
                      <div className="col-auto">
                        <div>
                          <span className="fs-3 me-2 text-success">
                            {formGeneral.assets_total}
                          </span>
                          Assets
                        </div>
                      </div>
                      <div className="col-auto">
                        <div>
                          Since
                          <span className="fs-3 mx-2 text-success">
                            {moment(formGeneral.created_at).format("MMM-YYYY")}
                          </span>
                        </div>
                      </div>
                      <div className="col-auto">
                        <span
                          className={
                            "fs-3 text-capitalize " +
                            (formGeneral.status == "on_hold"
                              ? "text-info"
                              : "text-success")
                          }
                        >
                          {formGeneral.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
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
                id={id}
                toast={toast}
                formGeneral={formGeneral}
                setIsLoading={setIsLoading}
                toggleEditForm={toggleEditForm}
                setToggleEditForm={setToggleEditForm}
              />
            ) : (
              <Container className="py-3">No data availabe</Container>
            )}
          </Tab>

          {/* Assents */}
          <Tab
            eventKey="assets"
            title={
              <Fragment>
                Assets
                <Badge className="ms-1" bg="secondary" text="white">
                  {formGeneral.assets_total}
                </Badge>
              </Fragment>
            }
            style={{ minHeight: "30rem" }}
            className="bg-darker border-start border-end border-bottom shadow"
            disabled={!valid}
          >
            {valid ? (
              <AssetsTab setIsLoading={setIsLoading} id={id} toast={toast} />
            ) : (
              <Container className="py-3">No data availabe</Container>
            )}
          </Tab>

          {/* Bookings */}
          <Tab
            eventKey="bookings"
            title={
              <Fragment>
                Bookings
                <Badge className="ms-1" bg="secondary" text="white">
                  {bookingsCount}
                </Badge>
              </Fragment>
            }
            style={{ minHeight: "30rem" }}
            className="bg-darker border-start border-end border-bottom shadow"
            disabled={!valid}
          >
            {valid ? (
              <BookingsTab id={id} toast={toast} />
            ) : (
              <Container className="py-3">No data availabe</Container>
            )}
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default CustomerPage;
