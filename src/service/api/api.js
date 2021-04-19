import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  //   baseURL: "https://api-ws-floor.waliczek.org/",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    sessionStorage.setItem("loginError", "");
    if (typeof error.response === "object") {
      if (typeof error.response.status !== "undefined") {
        if (sessionStorage.getItem("isLoggedIn") === "true") {
          if (error.response.status === 401) {
            sessionStorage.setItem("isLoggedIn", "false");
            sessionStorage.setItem(
              "loginError",
              "You've been logged out, please log back in again."
            );
          } else {
            sessionStorage.setItem(
              "loginError",
              "Error [" +
                error.response.status +
                "] occurred, please try again again."
            );
          }
          window.location.href = "/login";
        }
      }
    } else {
      console.log("oooo error!!");
      sessionStorage.setItem("isLoggedIn", "false");
      sessionStorage.setItem(
        "loginError",
        "Error: API Network Error, please try again again later."
      );
      // error = new Error("connection error!")
    }
    return Promise.reject(error);
  }
);

export default apiClient;
