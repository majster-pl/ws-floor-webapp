import { Modal } from "react-bootstrap";

const MainModal = ({ show, handleClose, form }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      {form}
    </Modal>
  );
};

export default MainModal;
