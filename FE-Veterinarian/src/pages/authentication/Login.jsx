import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Input } from "components";
import { AuthService } from "services";
import { useApp } from "contexts";
import { Enums, Helpers, Urls, Validation } from "utils";

import { Button, Col, Form, Row } from "react-bootstrap";

export function Login() {
  const { setUser } = useApp();
  const [alertMessage, setAlertMessage] = useState("");

  const initForm = {
    email: { name: "email", value: "", ...Validation.email },
    password: { name: "password", value: "", ...Validation.password },
  };

  const [form, setForm] = useState(initForm);

  async function handleSubmit(event) {
    event.preventDefault();
    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      const { status, payload, message } = await AuthService.signin(
        data.email,
        data.password
      );
      if (status === Enums.Status.SUCCESS) {
        setUser(payload);
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
          <h3>Sign In</h3>
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
                handleChange={handleChange}
                error={form.email.errors}
                placeholder="Enter email"
              />
              <Input
                required
                type={"password"}
                label={"Password *"}
                handleChange={handleChange}
                name={form.password.name}
                error={form.password.errors}
                placeholder="Enter password"
              />
            </Row>
            <div className="d-grid">
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </div>
            <p className="forgot-password text-center">
              Don't have an account?{" "}
              <Link
                to={Helpers.interpolateURL(Urls.Path.Auth.Register, {
                  type: Enums.UserType.PET_OWNER,
                })}
              >
                Pet Owner
              </Link>{" "}
              or{" "}
              <Link
                to={Helpers.interpolateURL(Urls.Path.Auth.Register, {
                  type: Enums.UserType.VETERINARIAN,
                })}
              >
                Veterinarian
              </Link>
            </p>
            <p className="forgot-password text-center">
              <Link to={Urls.Path.Auth.ForgotPassword}>Forgot password?</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </>
  );
}
