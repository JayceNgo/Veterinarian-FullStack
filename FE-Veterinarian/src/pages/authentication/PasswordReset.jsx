import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Input } from "components";
import { AuthService, TokenService } from "services";
import { Enums, Helpers, Urls, Validation } from "utils";
import { useApp } from "contexts";

import { Button, Col, Form, Row } from "react-bootstrap";

export function PasswordReset() {
  const { setUser } = useApp();
  const { token } = useParams();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");

  const initForm = {
    password: { name: "password", value: "", ...Validation.password },
    confirmPassword: {
      name: "confirmPassword",
      value: "",
      ...Validation.none,
    },
  };

  const [form, setForm] = useState(initForm);

  useEffect(() => {
    const fetchData = async () => {
      const { status } = await TokenService.find(token);
      if (status === Enums.Status.NOTFOUND) {
        navigate(Urls.Path.Auth.Index);
      }
    };
    fetchData();
  });

  async function handleSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      if (data.password === data.confirmPassword) {
        const { status, payload, message } = await AuthService.resetPassword(
          token,
          data.password
        );
        if (status === Enums.Status.SUCCESS) {
          setUser(payload);
        } else {
          setAlertMessage(message);
        }
      } else {
        setAlertMessage("Password does not match.");
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
      {" "}
      <Row>
        <Col xs={12}>
          <h3>Password Reset</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Alert message={alertMessage} />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Input
                required
                type={"password"}
                label={"Password *"}
                name={form.password.name}
                handleChange={handleChange}
                error={form.password.errors}
                placeholder="Enter password"
              />
              <Input
                type={"password"}
                label={"Confirm Password"}
                handleChange={handleChange}
                name={form.confirmPassword.name}
                error={form.confirmPassword.errors}
                placeholder="Re-type password"
              />
            </Row>
            <div className="d-grid">
              <Button type="submit" variant="primary">
                Reset password
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
}
