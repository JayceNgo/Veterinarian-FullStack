import Form from "react-bootstrap/Form";
import { Helpers } from "utils";

export function Input(props) {
  const isTextarea = props.type === "textarea";

  return (
    <Form.Group className="mb-3">
      {Helpers.hasValue(props.label) ? (
        <Form.Label>{props.label}</Form.Label>
      ) : null}
      <Form.Control
        name={props.name}
        value={props.value}
        onBlur={props.handleBlur}
        onInput={props.handleInput}
        onChange={props.handleChange}
        placeholder={props.placeholder}
        rows={isTextarea ? 3 : undefined}
        as={isTextarea ? "textarea" : undefined}
        type={isTextarea ? undefined : props.type}
      />
      {props.error ? (
        <Form.Text className="error">
          {props.error.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </Form.Text>
      ) : null}
    </Form.Group>
  );
}
