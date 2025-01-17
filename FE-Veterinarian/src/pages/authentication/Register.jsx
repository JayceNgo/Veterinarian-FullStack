import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Input } from "components";
import { Enums, Helpers, Urls, Validation } from "utils";
import { AuthService } from "services";
import { useApp } from "contexts";

import { Button, Col, Container, Form, Row } from "react-bootstrap";

export function Register() {
  const { setUser } = useApp();
  const { type } = useParams();
  const [alertMessage, setAlertMessage] = useState("");

  const userType = [
    Enums.UserType.PET_OWNER,
    Enums.UserType.VETERINARIAN,
  ].includes(type)
    ? type
    : Enums.UserType.PET_OWNER;

  const initForm = {
    firstName: { name: "firstName", value: "", ...Validation.short },
    lastName: { name: "lastName", value: "", ...Validation.short },
    email: { name: "email", value: "", ...Validation.email },
    phone: { name: "phone", value: "", ...Validation.phone },
    password: { name: "password", value: "", ...Validation.password },
    confirmPassword: {
      name: "confirmPassword",
      value: "",
      ...Validation.none,
    },
    userType: { name: "userType", value: userType, ...Validation.none },
    address: { name: "address", value: "", ...Validation.none },
    specialty: { name: "specialty", value: "", ...Validation.none },
  };

  const [form, setForm] = useState(initForm);

  async function handleSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      if (data.password === data.confirmPassword) {
        delete data.confirmPassword;
        const { status, payload, message } = await AuthService.signup(data);
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
      <Row>
        <Col xs={12}>
          <h3>Register</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Alert message={alertMessage} />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Input
                required
                type={"text"}
                label={"First Name *"}
                name={form.firstName.name}
                handleChange={handleChange}
                error={form.firstName.errors}
                placeholder="Enter First Name"
              />
              <Input
                required
                type={"text"}
                label={"Last Name *"}
                name={form.lastName.name}
                handleChange={handleChange}
                error={form.lastName.errors}
                placeholder="Enter Last Name"
              />
            </Row>
            <Row>
              <Input
                required
                type={"text"}
                label={"Phone *"}
                name={form.phone.name}
                handleChange={handleChange}
                error={form.phone.errors}
                placeholder="Enter Phone"
              />
            </Row>
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
            </Row>
            <Row>
              <Input
                required
                type={"password"}
                handleChange={handleChange}
                label={"Password *"}
                name={form.password.name}
                error={form.password.errors}
                placeholder="Enter password"
              />
              <Input
                type={"password"}
                handleChange={handleChange}
                label={"Confirm Password"}
                name={form.confirmPassword.name}
                error={form.confirmPassword.errors}
                placeholder="Confirm password"
              />
            </Row>
            {userType === Enums.UserType.VETERINARIAN ? (
              <Row>
                <Input
                  type={"text"}
                  label={"Specialty"}
                  handleInput={handleChange}
                  name={form.specialty.name}
                  value={form.specialty.value}
                  error={form.specialty.errors}
                  placeholder="Enter the specialty"
                />
                <Input
                  type={"text"}
                  label={"Address"}
                  handleInput={handleChange}
                  name={form.address.name}
                  value={form.address.value}
                  error={form.address.errors}
                  placeholder="Enter the address"
                />
              </Row>
            ) : null}
            <Form.Group className="d-flex flex-row-reverse">
              <Button variant="primary" type="submit">
                Register
              </Button>
            </Form.Group>
            <p className="forgot-password text-right">
              <Link to={Urls.Path.Auth.Index}>Sign In</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </>
  );
}
