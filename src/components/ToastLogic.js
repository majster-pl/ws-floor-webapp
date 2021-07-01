//racfe
import { useState } from "react";

const ToastLogic = () => {
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState();
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [autoHide, setAutoHide] = useState(true);

  const showToast = (variant, title, body, autoHide = true) => {
    setTitle(title);
    setBody(body);
    setVariant(variant);
    setShow(true);
    setAutoHide(autoHide);
  };

  return { show, setShow, variant, title, body, showToast, autoHide };
};

export default ToastLogic;
