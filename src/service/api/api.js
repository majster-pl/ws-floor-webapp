import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://localhost:8000",
  baseURL: "https://api-ws-floor.waliczek.org/",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  function (response) {
    // console.log(response);
    if (window.location.pathname !== "/login") {
      sessionStorage.setItem("redirect_path", window.location.pathname);
    }
    return response;
  },
  function (error) {
    // check if response in error, if not put error in data object
    if (typeof error.response === "object") {
      if (window.location.pathname !== "/login") {
        console.log("running code from API!!...");
        sessionStorage.setItem("redirect_path", window.location.pathname);
      }
      return Promise.reject(error.response);
    } else {
      return Promise.reject({ data: error });
    }
  }
);

export default apiClient;
