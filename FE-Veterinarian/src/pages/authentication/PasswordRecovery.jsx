import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "services";
import { Enums, Helpers, Urls, Validation } from "utils";
import { Alert, Input } from "components";

import { Button, Col, Form, Row } from "react-bootstrap";

export function PasswordRecovery() {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");

  const initForm = {
    email: { name: "email", value: "", ...Validation.email },
  };

  const [form, setForm] = useState(initForm);

  async function handleSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      const { status, message } = await AuthService.forgotPassword(data.email);
      if (status === Enums.Status.SUCCESS) {
        navigate(Urls.Path.Auth.Index);
      } else {
        setAlertMessage(message);
      }
    } else {
      setAlertMessage("Required Fields are not specified.");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    form[name].value = value;
    setForm({ ...form });
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <h3>Account Recover</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Alert message={alertMessage} />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Input
                required
                type={"email"}
                label={"Email *"}
                name={form.email.name}
                error={form.email.errors}
                handleChange={handleChange}
                placeholder="Enter email"
              />
            </Row>
            <div className="d-grid">
              <Button type="submit" variant="primary">
                Recover
              </Button>
            </div>
            <p className="forgot-password text-right">
              <Link to={Urls.Path.Auth.Index}>Sign In</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </>
  );
}
