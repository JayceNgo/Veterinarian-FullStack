import { Modal as BootstrapModal } from "react-bootstrap";
import { Helpers } from "utils";

export function Modal(props) {
  return (
    <BootstrapModal
      show={props.show ?? false}
      onHide={props.onClose}
      animation={false}
      centered
    >
      {Helpers.hasValue(props.title) ? (
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>{props.title}</BootstrapModal.Title>
        </BootstrapModal.Header>
      ) : null}
      <BootstrapModal.Body>{props.children}</BootstrapModal.Body>
    </BootstrapModal>
  );
}
