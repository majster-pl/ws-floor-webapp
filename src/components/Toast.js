import { Toast } from "react-bootstrap";
import { useState } from "react";
// import IsLoggedInLogic from "../../components/IsLoggedInLogic";
// import apiClient from "../../service/api/api";
// import "./Dashboard.css";

const ToastComponent = ({
  showToast,
  setShowToast,
  toastData,
}) => {
  // const [showToast, setShowToast] = useState(false);

  return (
    <Toast
      className={`position-fixed top-0 end-0 m-4 toast-main bg-${toastData.variant}`}
      onClose={() => setShowToast(false)}
      delay={2000}
      show={showToast}
      autohide
    >
      <Toast.Header className="" closeButton={false}>
        {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" /> */}
        <strong className="me-auto">{toastData.title}</strong>
        <small>now</small>
      </Toast.Header>
      <Toast.Body>{toastData.body}</Toast.Body>
    </Toast>
  );
};

export default ToastComponent;
