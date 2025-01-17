import Form from "react-bootstrap/Form";

export function Select(props) {
  const withGroup = props.withGroup ?? true;
  return withGroup ? (
    <Form.Group className="mb-3">
      <Form.Label htmlFor={props.name}>{props.label}</Form.Label>
      <Form.Select
        id={props.name}
        name={props.name}
        value={props?.value}
        onChange={props.handleChange}
      >
        <option key={0}>Select an option</option>
        {props.options.map((item, i) => {
          return (
            <option key={i} value={item.value}>
              {item.text}
            </option>
          );
        })}
      </Form.Select>
    </Form.Group>
  ) : (
    <Form.Select
      id={props.name}
      name={props.name}
      value={props?.value}
      onChange={props.handleChange}
    >
      <option key={0}>Select an option</option>
      {props.options.map((item, i) => {
        return (
          <option key={i} value={item.value}>
            {item.text}
          </option>
        );
      })}
    </Form.Select>
  );
}
