import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Input, Select } from "components";
import { Enums, Helpers, Urls, Validation } from "utils";
import { MessageService, PetService } from "services";
import { useApp } from "contexts";

import { Button, Col, Form, Row } from "react-bootstrap";

export function Create() {
  const { isPetOwner, user } = useApp();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  const initForm = {
    user: { name: "user", value: user.id, ...Validation.none },
    text: { name: "text", value: "", ...Validation.long },
    pet: { name: "pet", value: "", ...Validation.none },
  };

  const [form, setForm] = useState(initForm);

  useEffect(() => {
    const fetchData = async () => {
      const { payload } = isPetOwner
        ? await PetService.findByOwner(user.id)
        : await PetService.findByVeterinarian(user.id);
      setPets(payload);
    };
    fetchData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      const { status, message } = await MessageService.create(data);
      if (status === Enums.Status.SUCCESS) {
        navigate(Urls.Path.Page.Discussion.Index);
      } else {
        setAlertMessage(message);
      }
    } else {
      setAlertMessage("Required Fields are not specified.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    form[name].value = value;
    setForm({ ...form });
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <h3>Create Discussion</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Alert message={alertMessage} />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Select
                label={"Pet"}
                name={form.pet.name}
                error={form.pet.errors}
                handleChange={handleChange}
                options={pets.map((item) => {
                  return {
                    value: item._id,
                    text: item.name,
                  };
                })}
              />
            </Row>
            <Row>
              <Input
                type={"textarea"}
                label={"Message *"}
                name={form.text.name}
                value={form.text.value}
                error={form.text.errors}
                handleInput={handleChange}
                placeholder="Enter the message"
              />
            </Row>
            <Form.Group className="d-flex flex-row-reverse">
              <Button variant="primary" type="submit">
                Create Discussion
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
}
