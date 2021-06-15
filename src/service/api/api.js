import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  // baseURL: "https://api-ws-floor.waliczek.org/",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
  },
  withCredentials: true,
});

const redirectToLogin = () => {
  // if (window.location.pathname !== "/login") {
  //   window.location.href = "/login";
  // }
  console.log("ERROR!!!");
};

apiClient.interceptors.response.use(
  function (response) {
    sessionStorage.setItem("errorMessage", "");

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    sessionStorage.setItem("errorMessage", "");
    // check if server responding... if so check for errors
    if (typeof error.response === "object") {
      if (typeof error.response.status !== "undefined") {
        if (sessionStorage.getItem("isLoggedIn") === "true") {
          sessionStorage.setItem("isLoggedIn", "false");
          if (error.response.status === 401) {
            sessionStorage.setItem(
              "errorMessage",
              "You are no longer logged in, please log in again."
            );
          } else {
            sessionStorage.setItem(
              "errorMessage",
              error.response.status + " - " + error.response.statusText
            );
          }
          redirectToLogin();
        } else {
          sessionStorage.removeItem("isLoggedIn");
          // sessionStorage.removeItem("loginError");
          // sessionStorage.setItem(
          //   "loginError",
          //   "You are no longer logged in, please log in again."
          // );
          redirectToLogin();
        }
      }
    } else {
      // console.log("oooo error!!");
      sessionStorage.setItem("isLoggedIn", "false");
      sessionStorage.setItem("error", error);
      sessionStorage.setItem(
        "loginError",
        "Error: API Network Error, please try again again later."
      );
      redirectToLogin();
      // error = new Error("connection error!")
    }
    return Promise.reject(error);
  }
);

export default apiClient;
