import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Input, Select } from "components";
import { Enums, Helpers, Urls, Validation } from "utils";
import { PetService } from "services";
import { useApp } from "contexts";

import { Button, Col, Form, Row } from "react-bootstrap";

export function Manage() {
  const { user } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const isUpdate = Helpers.hasValue(id);
  const [alertMessage, setAlertMessage] = useState("");

  const initForm = {
    name: { name: "name", value: "", ...Validation.short },
    breed: { name: "breed", value: "", ...Validation.short },
    species: { name: "species", value: "", ...Validation.short },
    gender: { name: "gender", value: "", ...Validation.short },
    birthdate: { name: "birthdate", value: "", ...Validation.short },
    allergies: { name: "allergies", value: "", ...Validation.none },
    notes: { name: "notes", value: "", ...Validation.none },
  };

  const [form, setForm] = useState(initForm);

  useEffect(() => {
    const fetchData = async () => {
      const { status, payload } = await PetService.findById(id);
      if (status === Enums.Status.SUCCESS) {
        payload.birthdate = Helpers.hasValue(payload.birthdate)
          ? payload.birthdate.split("T")[0]
          : "";
        setForm(Helpers.fromJSON(initForm, payload));
      } else if (status === Enums.Status.NOTFOUND) {
        navigate(Urls.Path.Page.Pet.Index);
      }
    };
    fetchData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      const { status, message } = isUpdate
        ? await PetService.update(id, data)
        : await PetService.create(user.id, data);

      if (status === Enums.Status.SUCCESS) {
        navigate(Urls.Path.Page.Pet.Index);
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
          <h3>{isUpdate ? "Update" : "Add"} Pet</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Alert message={alertMessage} />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Input
                type={"text"}
                label={"Name *"}
                name={form.name.name}
                value={form.name.value}
                error={form.name.errors}
                handleInput={handleChange}
                placeholder="Enter the name"
              />
            </Row>
            <Row>
              <Input
                type={"text"}
                label={"Breed *"}
                name={form.breed.name}
                value={form.breed.value}
                error={form.breed.errors}
                handleInput={handleChange}
                placeholder="Enter the breed"
              />
              <Input
                type={"text"}
                label={"Species *"}
                name={form.species.name}
                handleInput={handleChange}
                value={form.species.value}
                error={form.species.errors}
                placeholder="Enter the species"
              />
            </Row>
            <Row>
              <Select
                label={"Gender *"}
                name={form.gender.name}
                value={form.gender.value}
                error={form.gender.errors}
                handleChange={handleChange}
                options={[
                  { value: "Female", text: "Female" },
                  { value: "Male", text: "Male" },
                ]}
              />
              <Input
                type={"date"}
                label={"Birthdate *"}
                handleInput={handleChange}
                name={form.birthdate.name}
                value={form.birthdate.value}
                error={form.birthdate.errors}
                placeholder="Enter the birthdate"
              />
            </Row>
            <Row>
              <Input
                type={"textarea"}
                label={"Allergies"}
                handleInput={handleChange}
                name={form.allergies.name}
                value={form.allergies.value}
                error={form.allergies.errors}
                placeholder="Enter the allergies"
              />
              <Input
                type={"textarea"}
                label={"Notes *"}
                handleInput={handleChange}
                name={form.notes.name}
                value={form.notes.value}
                error={form.notes.errors}
                placeholder="Enter the notes"
              />
            </Row>
            <Form.Group className="d-flex flex-row-reverse">
              <Button variant="primary" type="submit">
                {isUpdate ? "Update" : "Add"} Pet
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
}
