import { Form } from "react-bootstrap";

const FormInput = ({
  _label,
  _touched,
  _errors,
  _maxLength = 8,
  _disabled = false,
  _type = "text",
  _placeholder,
  _value,
  _onChange,
}) => {
  return (
    <>
      <Form.Label>{_label}</Form.Label>
      <Form.Control
        isInvalid={_touched && _errors}
        maxLength={_maxLength}
        plaintext={_disabled}
        disabled={_disabled}
        type={_type}
        placeholder={_placeholder}
        // onChange={props.handleChange("reg")}
        onChange={_onChange}
        defaultValue={_value === null ? "" : _value}
      />
      <Form.Control.Feedback type="invalid" className="d-block">
        {_touched && _errors}
      </Form.Control.Feedback>
    </>
  );
};

export default FormInput;
