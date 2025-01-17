import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Input, Select } from "components";
import { Enums, Helpers, Urls, Validation } from "utils";
import { UserService } from "services";
import { useApp } from "contexts";

import { Button, Col, Form, Row } from "react-bootstrap";

export function Manage() {
  const { user } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const isUpdate = Helpers.hasValue(id);
  const [alertMessage, setAlertMessage] = useState("");

  const initForm = {
    firstName: { name: "firstName", value: "", ...Validation.short },
    lastName: { name: "lastName", value: "", ...Validation.short },
    email: { name: "email", value: "", ...Validation.email },
    phone: { name: "phone", value: "", ...Validation.phone },
    password: { name: "password", value: "", ...Validation.none },
    userType: { name: "userType", value: "", ...Validation.short },
    address: { name: "address", value: "", ...Validation.none },
    specialty: { name: "specialty", value: "", ...Validation.none },
  };

  const [form, setForm] = useState(initForm);

  useEffect(() => {
    const fetchData = async () => {
      const { status, payload } = await UserService.findById(id);
      if (status === Enums.Status.SUCCESS) {
        setForm(Helpers.fromJSON(initForm, payload));
      } else if (status === Enums.Status.NOTFOUND) {
        navigate(Urls.Path.Page.User.Index);
      }
    };
    fetchData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      const { status, message } = isUpdate
        ? await UserService.update(id, data)
        : await UserService.create(user.id, data);

      if (status === Enums.Status.SUCCESS) {
        navigate(Urls.Path.Page.User.Index);
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
          <h3>{isUpdate ? "Update" : "Add"} User</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Alert message={alertMessage} />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Input
                type={"text"}
                label={"First Name *"}
                name={form.firstName.name}
                value={form.firstName.value}
                error={form.firstName.errors}
                handleInput={handleChange}
                placeholder="Enter the first name"
              />
              <Input
                type={"text"}
                label={"Last Name *"}
                name={form.lastName.name}
                value={form.lastName.value}
                error={form.lastName.errors}
                handleInput={handleChange}
                placeholder="Enter the last name"
              />
            </Row>
            <Row>
              <Input
                type={"text"}
                label={"Phone *"}
                name={form.phone.name}
                handleInput={handleChange}
                value={form.phone.value}
                error={form.phone.errors}
                placeholder="Enter the phone"
              />
              <Input
                type={"email"}
                label={"Email *"}
                name={form.email.name}
                handleInput={handleChange}
                value={form.email.value}
                error={form.email.errors}
                placeholder="Enter the email"
              />
            </Row>
            {!isUpdate ? (
              <Row>
                <Input
                  type={"password"}
                  label={"Password"}
                  handleInput={handleChange}
                  name={form.password.name}
                  value={form.password.value}
                  error={form.password.errors}
                  placeholder="Enter the password"
                />
              </Row>
            ) : null}
            <Row>
              <Select
                label={"User Type *"}
                name={form.userType.name}
                value={form.userType.value}
                error={form.userType.errors}
                handleChange={handleChange}
                options={[
                  { value: Enums.UserType.PET_OWNER, text: "Pet Owner" },
                  { value: Enums.UserType.VETERINARIAN, text: "Veterinarian" },
                  { value: Enums.UserType.ADMIN, text: "Admin" },
                ]}
              />
            </Row>
            {form.userType.value === Enums.UserType.VETERINARIAN ? (
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
                {isUpdate ? "Update" : "Add"} User
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
}
