import Form from "react-bootstrap/Form";

export function FileManagement() {
  return (
    <>
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>Please upload the files</Form.Label>
        <Form.Control type="file" multiple />
      </Form.Group>
    </>
  );
}
