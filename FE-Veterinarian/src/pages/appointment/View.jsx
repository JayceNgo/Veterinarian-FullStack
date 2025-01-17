import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Input, Modal, Upload } from "components";
import { Enums, Helpers, Urls, Validation } from "utils";
import {
  AppointmentService,
  FileService,
  TreatmentService,
  VaccineService,
} from "services";
import { useApp } from "contexts";

import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";

export function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPetOwner, user } = useApp();
  const [appointment, setAppointment] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [incrementComponent, setIncrementComponent] = useState(0);

  const initForm = {
    notes: { name: "notes", value: "", ...Validation.long },
  };

  const initVaccineForm = {
    vaccineName: { name: "vaccineName", value: "", ...Validation.short },
    nextAt: { name: "nextAt", value: "", ...Validation.short },
    notes: { name: "notes", value: "", ...Validation.long },
  };

  const initTreatmentForm = {
    name: { name: "name", value: "", ...Validation.short },
  };

  const [form, setForm] = useState(initForm);
  const [treatmentForm, setTreatmentForm] = useState(initTreatmentForm);
  const [vaccineForm, setVaccineForm] = useState(initVaccineForm);

  const [vaccineModal, setVaccineModal] = useState(false);
  const [treatmentModal, setTreatmentModal] = useState(false);

  const handleVaccineModalOpen = () => setVaccineModal(true);
  const handleVaccineModalClose = () => setVaccineModal(false);

  const handleTreatmentModalOpen = () => setTreatmentModal(true);
  const handleTreatmentModalClose = () => setTreatmentModal(false);

  useEffect(() => {
    const fetchData = async () => {
      const { status, payload } = await AppointmentService.findById(id);
      if (status === Enums.Status.SUCCESS) {
        setForm(Helpers.fromJSON(initForm, payload));
        setAppointment(payload);
      } else if (status === Enums.Status.NOTFOUND) {
        navigate(Urls.Path.Page.Appointment.Index);
      }
    };
    fetchData();
  }, [incrementComponent]);

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      const { status, payload } = await AppointmentService.update(id, data);
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
      }
    }
  }

  async function handleVaccineFormSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(vaccineForm)) {
      const data = Helpers.toJSON(vaccineForm);
      const { status, payload } = await VaccineService.create(
        user.id,
        appointment.pet._id,
        { ...data, appointment: id }
      );
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
        handleVaccineModalClose();
        setVaccineForm(initVaccineForm);
      }
    }
  }

  async function handleTreatmentFormSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(treatmentForm)) {
      const data = Helpers.toJSON(treatmentForm);
      const { status, payload } = await TreatmentService.create(
        user.id,
        appointment.pet._id,
        data
      );
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
        handleTreatmentModalClose();
        setTreatmentForm(initTreatmentForm);
      }
    }
  }

  async function handleCompleteAppointment(appointmentId) {
    const { status, payload } = await AppointmentService.update(appointmentId, {
      status: Enums.AppointmentStatus.COMPLETED,
    });
    if (status === Enums.Status.SUCCESS) {
      setIncrementComponent(incrementComponent + 1);
    }
  }

  async function handleCancelAppointment(appointmentId) {
    const { status, payload } = await AppointmentService.cancel(appointmentId, {
      status: Enums.AppointmentStatus.COMPLETED,
    });
    if (status === Enums.Status.SUCCESS) {
      setIncrementComponent(incrementComponent + 1);
    }
  }

  async function handleCompleteTreatment(treatmentId) {
    const { status, payload } = await TreatmentService.complete(
      treatmentId,
      appointment.pet._id
    );
    if (status === Enums.Status.SUCCESS) {
      setIncrementComponent(incrementComponent + 1);
    }
  }

  async function handleDownload(file) {
    const response = await FileService.download(file._id, appointment.pet._id);
    if (response) {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.originalName);
      document.body.appendChild(link);
      link.click();
    }
  }

  async function handleDeleteFile(fileId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to delete this file?")) {
      const { status, payload } = await FileService.delete(
        fileId,
        appointment.pet._id
      );
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
      }
    }
  }

  async function handleDeleteVaccine(vaccineId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to delete this vaccine?")) {
      const { status, payload } = await VaccineService.delete(
        vaccineId,
        appointment.pet._id
      );
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
      }
    }
  }

  async function handleDeleteTreatment(treatmentId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to delete this treatment?")) {
      const { status, payload } = await TreatmentService.delete(
        treatmentId,
        appointment.pet._id
      );
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
      }
    }
  }

  async function handleUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    const { status, payload } = await FileService.upload(
      id,
      appointment.pet._id,
      formData
    );
    if (status === Enums.Status.SUCCESS) {
      setIncrementComponent(incrementComponent + 1);
    }
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    form[name].value = value;
    setForm({ ...form });
  }

  function handleVaccineFormChange(event) {
    const { name, value } = event.target;
    vaccineForm[name].value = value;
    setVaccineForm({ ...vaccineForm });
  }

  function handleTreatmentFormChange(event) {
    const { name, value } = event.target;
    treatmentForm[name].value = value;
    setTreatmentForm({ ...treatmentForm });
  }

  const isReadOnly = appointment
    ? appointment.status !== Enums.AppointmentStatus.SCHEDULED || isPetOwner
    : false;

  const vaccines =
    appointment && appointment.pet && appointment.pet.vaccines
      ? appointment.pet.vaccines.filter((item) => item.appointment === id)
      : [];
  const files =
    appointment && appointment.pet && appointment.pet.files
      ? appointment.pet.files.filter((item) => item.appointment === id)
      : [];
  const treatments =
    appointment && appointment.pet && appointment.pet.treatments
      ? appointment.pet.treatments.filter((item) => {
          return item.veterinarian.user === user.id;
        })
      : [];

  return appointment ? (
    <>
      <Row>
        <Col xs={12}>
          <h3>View Appointment</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={appointment.pet ? 6 : 12}>
          <Card>
            <Card.Header>Appointment's information</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <b>Status:</b> {appointment.status}
                {!isReadOnly && (
                  <ButtonGroup style={{ float: "right" }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCompleteAppointment(appointment._id)}
                    >
                      Completed
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancelled
                    </Button>
                  </ButtonGroup>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Date:</b> {Helpers.formatDate(appointment.date)}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Veterinarian:</b>{" "}
                {`${appointment.veterinarian.user.firstName} ${appointment.veterinarian.user.lastName}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Email:</b> {`${appointment.veterinarian.user.email}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Location:</b> {`${appointment.veterinarian.address}`}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        {appointment.pet && (
          <Col xs={12} sm={6}>
            <Card>
              <Card.Header>Pet's information</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <b>Name:</b> {appointment.pet.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Breed:</b> {appointment.pet.breed}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Species:</b> {appointment.pet.species}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Gender:</b> {appointment.pet.gender}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Age:</b> {Helpers.toAge(appointment.pet.birthdate)}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        )}
      </Row>
      <Row>
        <Col xs={12}>
          <Card className="mt-3">
            <Card.Header>Reason</Card.Header>
            <Card.Body>
              <Card.Text>
                {Helpers.hasValue(appointment.reason)
                  ? appointment.reason
                  : "Nothing to display"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {appointment.pet && (
        <Row>
          <Col xs={12}>
            <Card className="mt-3">
              <Card.Header>Allergies</Card.Header>
              <Card.Body>
                <Card.Text>
                  {Helpers.hasValue(appointment.pet.allergies)
                    ? appointment.pet.allergies
                    : "Nothing to display"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={12}>
          <Card className="mt-3">
            <Card.Header>
              Vaccines
              {!isReadOnly && (
                <Button
                  size="sm"
                  variant="secondary"
                  style={{ float: "right" }}
                  onClick={handleVaccineModalOpen}
                >
                  Add Vaccine
                </Button>
              )}
            </Card.Header>
            {vaccines && vaccines.length > 0 ? (
              <ListGroup variant="flush">
                {vaccines.map((vaccine) => {
                  return (
                    <ListGroup.Item key={vaccine._id}>
                      {vaccine.vaccineName} at{" "}
                      {Helpers.formatDate(vaccine.givenAt)}
                      {!isReadOnly && (
                        <ButtonGroup style={{ float: "right" }}>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteVaccine(vaccine._id)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      )}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ) : (
              <Card.Body>
                <Card.Text>Nothing to display</Card.Text>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card className="mt-3">
            <Card.Header>
              Treatments
              {!isReadOnly && (
                <Button
                  size="sm"
                  variant="secondary"
                  style={{ float: "right" }}
                  onClick={handleTreatmentModalOpen}
                >
                  Add Treatment
                </Button>
              )}
            </Card.Header>
            {treatments && treatments.length > 0 ? (
              <ListGroup variant="flush">
                {treatments.map((treatment) => {
                  return (
                    <ListGroup.Item key={treatment._id}>
                      {treatment.name}
                      {` from ${Helpers.formatDate(treatment.startDate)} ${
                        Helpers.hasValue(treatment.endDate)
                          ? " to " + Helpers.formatDate(treatment.endDate)
                          : ""
                      }`}
                      <ButtonGroup style={{ float: "right" }}>
                        <Link
                          className="btn btn-secondary btn-sm"
                          to={Helpers.interpolateURL(
                            Urls.Path.Page.Treatment.Index,
                            { id: treatment._id, petId: appointment.pet._id }
                          )}
                        >
                          View
                        </Link>
                        {!isReadOnly && (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                handleCompleteTreatment(treatment._id)
                              }
                            >
                              Completed
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleDeleteTreatment(treatment._id)
                              }
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </ButtonGroup>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ) : (
              <Card.Body>
                <Card.Text>Nothing to display</Card.Text>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card className="mt-3">
            <Card.Header>
              Files
              {!isReadOnly && <Upload onUpload={handleUpload} />}
            </Card.Header>
            {files.length > 0 ? (
              <ListGroup variant="flush">
                {files.map((file) => {
                  return (
                    <ListGroup.Item key={file._id}>
                      {file.originalName}
                      <ButtonGroup style={{ float: "right" }}>
                        {!isReadOnly && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteFile(file._id)}
                          >
                            Delete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownload(file)}
                        >
                          Download
                        </Button>
                      </ButtonGroup>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ) : (
              <Card.Body>
                <Card.Text>Nothing to display</Card.Text>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card className="mt-3">
            <Card.Header>Notes</Card.Header>
            <Card.Body>
              {isReadOnly ? (
                <Card.Text>
                  {Helpers.hasValue(appointment.notes)
                    ? appointment.notes
                    : "Nothing to display"}
                </Card.Text>
              ) : (
                <Form onSubmit={handleFormSubmit}>
                  <Row>
                    <Input
                      type={"textarea"}
                      name={form.notes.name}
                      value={form.notes.value}
                      error={form.notes.errors}
                      handleInput={handleFormChange}
                      placeholder="Enter the notes"
                    />
                  </Row>
                  {appointment.status === Enums.AppointmentStatus.SCHEDULED && (
                    <Form.Group className="d-flex flex-row-reverse">
                      <Button variant="primary" type="submit">
                        Update
                      </Button>
                    </Form.Group>
                  )}
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal
        show={treatmentModal}
        onClose={handleTreatmentModalClose}
        title="Treatment"
      >
        <Alert message={alertMessage} />
        <Form onSubmit={handleTreatmentFormSubmit}>
          <Row>
            <Input
              type={"text"}
              label={"Name *"}
              name={treatmentForm.name.name}
              value={treatmentForm.name.value}
              error={treatmentForm.name.errors}
              handleInput={handleTreatmentFormChange}
              placeholder="Enter the treatment name"
            />
          </Row>
          <Form.Group className="d-flex flex-row-reverse">
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form.Group>
        </Form>
      </Modal>
      <Modal
        show={vaccineModal}
        onClose={handleVaccineModalClose}
        title="Vaccine"
      >
        <Alert message={alertMessage} />
        <Form onSubmit={handleVaccineFormSubmit}>
          <Row>
            <Input
              type={"text"}
              label={"Vaccine Name *"}
              name={vaccineForm.vaccineName.name}
              value={vaccineForm.vaccineName.value}
              error={vaccineForm.vaccineName.errors}
              handleInput={handleVaccineFormChange}
              placeholder="Enter the name of the vaccine"
            />
            <Input
              type={"date"}
              label={"Follow up Date"}
              name={vaccineForm.nextAt.name}
              value={vaccineForm.nextAt.value}
              error={vaccineForm.nextAt.errors}
              handleInput={handleVaccineFormChange}
              placeholder="Enter the follow up date"
            />
            <Input
              type={"textarea"}
              label={"Notes"}
              name={vaccineForm.notes.name}
              value={vaccineForm.notes.value}
              error={vaccineForm.notes.errors}
              handleInput={handleVaccineFormChange}
              placeholder="Enter the notes"
            />
          </Row>
          <Form.Group className="d-flex flex-row-reverse">
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form.Group>
        </Form>
      </Modal>
    </>
  ) : null;
}
