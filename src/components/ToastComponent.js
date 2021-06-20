import { Toast, Button } from "react-bootstrap";

const ToastComponent = ({ show, setShow, variant, title, body, autoHide }) => {
  return (
    <Toast
      className={`position-fixed top-0 end-0 m-4 toast-main bg-${variant}`}
      onClose={() => setShow(false)}
      delay={2000}
      show={show}
      autohide={autoHide}
    >
      <Toast.Header className="" closeButton={false}>
        <strong className="me-auto">{title}</strong>
        <Button
          variant="dark"
          className="btn-close"
          onClick={() => setShow(false)}
        />
      </Toast.Header>
      <Toast.Body>{body}</Toast.Body>
    </Toast>
  );
};

export default ToastComponent;
