import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Input, Select } from "components";
import { Enums, Helpers, Urls, Validation } from "utils";
import { PetService, MedicationService } from "services";
import { useApp } from "contexts";

import { Button, Col, Form, Row } from "react-bootstrap";

export function Manage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const { id, petId, medicationId } = useParams();
  const isUpdate = Helpers.hasValue(medicationId);
  const [alertMessage, setAlertMessage] = useState("");

  const initForm = {
    name: { name: "name", value: "", ...Validation.short },
    unit: { name: "unit", value: "", ...Validation.short },
    amount: { name: "amount", value: "", ...Validation.short },
    interval: { name: "interval", value: "", ...Validation.short },
  };

  const [form, setForm] = useState(initForm);

  useEffect(() => {
    const fetchData = async () => {
      const { status, payload } = await MedicationService.find(
        id,
        petId,
        medicationId
      );
      if (status === Enums.Status.SUCCESS) {
        setForm(Helpers.fromJSON(initForm, payload));
      } else if (status === Enums.Status.NOTFOUND) {
        navigate(
          Helpers.interpolateURL(Urls.Path.Page.Treatment.Index, { id, petId })
        );
      }
    };
    fetchData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      const { status, message } = isUpdate
        ? await MedicationService.update(id, petId, medicationId, data)
        : await MedicationService.create(id, petId, data);

      if (status === Enums.Status.SUCCESS) {
        navigate(
          Helpers.interpolateURL(Urls.Path.Page.Treatment.Index, { id, petId })
        );
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
          <h3>{isUpdate ? "Update" : "Add"} Medication</h3>
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
              <Input
                type={"text"}
                label={"Amount *"}
                name={form.amount.name}
                value={form.amount.value}
                error={form.amount.errors}
                handleInput={handleChange}
                placeholder="Enter the amount"
              />
            </Row>
            <Row>
              <Select
                label={"Unit *"}
                name={form.unit.name}
                value={form.unit.value}
                error={form.unit.errors}
                handleChange={handleChange}
                options={[
                  {
                    value: Enums.MedicationDosageUnit.MILLILITERS,
                    text: Enums.MedicationDosageUnit.MILLILITERS,
                  },
                  {
                    value: Enums.MedicationDosageUnit.MILLIGAMS,
                    text: Enums.MedicationDosageUnit.MILLIGAMS,
                  },
                  {
                    value: Enums.MedicationDosageUnit.GRAMS,
                    text: Enums.MedicationDosageUnit.GRAMS,
                  },
                  {
                    value: Enums.MedicationDosageUnit.PIIL,
                    text: Enums.MedicationDosageUnit.PIIL,
                  },
                  {
                    value: Enums.MedicationDosageUnit.TABLESPOONS,
                    text: Enums.MedicationDosageUnit.TABLESPOONS,
                  },
                  {
                    value: Enums.MedicationDosageUnit.TEASPOONS,
                    text: Enums.MedicationDosageUnit.TEASPOONS,
                  },
                  {
                    value: Enums.MedicationDosageUnit.DROPS,
                    text: Enums.MedicationDosageUnit.DROPS,
                  },
                  {
                    value: Enums.MedicationDosageUnit.CAPSULES,
                    text: Enums.MedicationDosageUnit.CAPSULES,
                  },
                ]}
              />
              <Input
                type={"text"}
                label={"Interval *"}
                name={form.interval.name}
                value={form.interval.value}
                error={form.interval.errors}
                handleInput={handleChange}
                placeholder="Enter the interval"
              />
            </Row>
            <Form.Group className="d-flex flex-row-reverse">
              <Button variant="primary" type="submit">
                {isUpdate ? "Update" : "Add"} Medication
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
}
