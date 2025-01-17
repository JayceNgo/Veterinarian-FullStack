import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Input, Select } from "components";
import { Enums, Helpers, Urls, Validation } from "utils";
import { AppointmentService, PetService, UserService } from "services";
import { useApp } from "contexts";

import { Button, Col, Form, Row } from "react-bootstrap";

export function MakeAppointment() {
  const { isPetOwner, user } = useApp();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");

  const initSearch = {
    date: { name: "date", value: "", ...Validation.short },
    veterinarian: { name: "veterinarian", value: "", ...Validation.short },
  };

  const initForm = {
    pet: { name: "pet", value: "", ...Validation.short },
    time: { name: "time", value: "", ...Validation.short },
    reason: { name: "reason", value: "", ...Validation.long },
  };

  const [form, setForm] = useState(initForm);
  const [search, setSearch] = useState(initSearch);

  const [pets, setPets] = useState([]);
  const [slots, setSlots] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);

  useEffect(() => {
    findVeterinarians();
  }, []);

  async function findPets() {
    const { status, payload } = isPetOwner
      ? await PetService.findByOwner(user.id)
      : await PetService.findByVeterinarian(user.id);
    if (status === Enums.Status.SUCCESS) {
      setPets(payload);
    }
  }

  async function findVeterinarians() {
    const { status, payload } = await UserService.findVeterinarians();
    if (status === Enums.Status.SUCCESS) {
      setVeterinarians(payload);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    if (Helpers.isValid(search)) {
      const data = Helpers.toJSON(search);
      const slots = await AppointmentService.availability(
        data.veterinarian,
        data.date
      );
      if (slots.length > 0) {
        await findPets();
      } else {
        setAlertMessage("No slots available");
      }
      setSlots(slots);
    } else {
      setAlertMessage("Required Fields are not specified.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(search) && Helpers.isValid(form)) {
      const data = { ...Helpers.toJSON(form), ...Helpers.toJSON(search) };
      const { status, message } = await AppointmentService.create(data);
      if (status === Enums.Status.SUCCESS) {
        navigate(Urls.Path.Page.Appointment.Index);
      } else {
        setAlertMessage(message);
      }
    } else {
      setAlertMessage("Required Fields are not specified.");
    }
  }

  function handleSearchChange(e) {
    const { name, value } = e.target;
    search[name].value = value;
    setSearch({ ...search });
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    form[name].value = value;
    setForm({ ...form });
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <h3>Make an Appointment</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={12}>
              <Alert message={alertMessage} />
              <Form onSubmit={handleSearch}>
                <Row>
                  <Select
                    label={"Veterinarian *"}
                    name={search.veterinarian.name}
                    error={search.veterinarian.errors}
                    handleChange={handleSearchChange}
                    options={veterinarians.map((item) => {
                      return {
                        value: item._id,
                        text: `${item.user.firstName} ${item.user.lastName}`,
                      };
                    })}
                  />
                  <Input
                    type={"date"}
                    label={"Date *"}
                    name={search.date.name}
                    error={search.date.errors}
                    handleInput={handleSearchChange}
                    placeholder="Enter the date"
                  />
                </Row>
                <Form.Group className="d-flex flex-row-reverse">
                  <Button variant="primary" type="submit">
                    Check Availability
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {slots.length > 0 && pets.length > 0 ? (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Select
                      label={"Pet *"}
                      name={form.pet.name}
                      error={form.pet.errors}
                      handleChange={handleFormChange}
                      options={pets.map((item) => {
                        return {
                          value: item._id,
                          text: item.name,
                        };
                      })}
                    />
                    <Select
                      label={"Time *"}
                      name={form.time.name}
                      error={form.time.errors}
                      handleChange={handleFormChange}
                      options={slots.map((item) => {
                        return {
                          value: item,
                          text: item,
                        };
                      })}
                    />
                    <Input
                      type={"textarea"}
                      label={"Reason *"}
                      name={form.reason.name}
                      error={form.reason.errors}
                      handleInput={handleFormChange}
                      placeholder="Enter the reason"
                    />
                  </Row>
                  <Form.Group className="d-flex flex-row-reverse">
                    <Button variant="primary" type="submit">
                      Make Appointment
                    </Button>
                  </Form.Group>
                </Form>
              ) : null}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
