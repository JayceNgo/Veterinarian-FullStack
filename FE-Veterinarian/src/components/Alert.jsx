import { Alert as BootstrapAlert } from "react-bootstrap";
import { Helpers } from "utils";

export function Alert(props) {
  if (!props.message) return "";
  return Helpers.hasValue(props.message) ? (
    <BootstrapAlert variant="secondary">
      <p>{props.message}</p>
    </BootstrapAlert>
  ) : null;
}
