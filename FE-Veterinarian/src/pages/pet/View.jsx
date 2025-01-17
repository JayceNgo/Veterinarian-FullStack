import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Input, Modal } from "components";
import { Enums, Helpers, Urls, Validation } from "utils";
import {
  FileService,
  PetService,
  VaccineService,
  TreatmentService,
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
  const [incrementComponent, setIncrementComponent] = useState(0);

  const [pet, setPet] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { status, payload } = await PetService.view(id);
      if (status === Enums.Status.SUCCESS) {
        setPet(payload);
      } else if (status === Enums.Status.NOTFOUND) {
        navigate(Urls.Path.Page.Discussion.Index);
      }
    };
    fetchData();
  }, [incrementComponent]);

  async function handleCompleteTreatment(treatmentId) {
    const { status, payload } = await TreatmentService.complete(
      treatmentId,
      pet._id
    );
    if (status === Enums.Status.SUCCESS) {
      setIncrementComponent(incrementComponent + 1);
    }
  }

  async function handleDeleteFile(fileId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to delete this file?")) {
      const { status, payload } = await FileService.delete(fileId, pet._id);
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
        pet._id
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
        pet._id
      );
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
      }
    }
  }

  async function handleDownload(file) {
    const response = await FileService.download(file._id, pet._id);
    if (response) {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.originalName);
      document.body.appendChild(link);
      link.click();
    }
  }

  return (
    pet && (
      <>
        <Row>
          <Col xs={12}>
            <h3>View Pet</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card>
              <Card.Header>Pet's information</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <b>Name:</b> {pet.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Breed:</b> {pet.breed}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Species:</b> {pet.species}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Gender:</b> {pet.gender}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Age:</b> {Helpers.toAge(pet.birthdate)}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card className="mt-3">
              <Card.Header>Allergies</Card.Header>
              <Card.Body>
                <Card.Text>
                  {Helpers.hasValue(pet.allergies)
                    ? pet.allergies
                    : "Nothing to display"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card className="mt-3">
              <Card.Header>Veterinarians</Card.Header>
              {pet.veterinarians && pet.veterinarians.length > 0 ? (
                <ListGroup variant="flush">
                  {pet.veterinarians.map((veterinarian) => {
                    return (
                      <ListGroup.Item key={veterinarian._id}>
                        {`${veterinarian.user.firstName} ${veterinarian.user.lastName}`}{" "}
                        ({veterinarian.specialty})
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
              <Card.Header>Vaccines</Card.Header>
              {pet.vaccines && pet.vaccines.length > 0 ? (
                <ListGroup variant="flush">
                  {pet.vaccines.map((vaccine) => {
                    return (
                      <ListGroup.Item key={vaccine._id}>
                        {vaccine.vaccineName} at{" "}
                        {Helpers.formatDate(vaccine.givenAt)}
                        {!isPetOwner &&
                          vaccine.veterinarian.user === user.id && (
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
              <Card.Header>Treatments</Card.Header>
              {pet.treatments && pet.treatments.length > 0 ? (
                <ListGroup variant="flush">
                  {pet.treatments.map((treatment) => {
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
                              { id: treatment._id, petId: pet._id }
                            )}
                          >
                            View
                          </Link>
                          {!isPetOwner &&
                          !Helpers.hasValue(treatment.endDate) &&
                          treatment.veterinarian.user === user.id ? (
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
                          ) : null}
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
              <Card.Header>Files</Card.Header>
              {pet.files && pet.files.length > 0 ? (
                <ListGroup variant="flush">
                  {pet.files.map((file) => {
                    return (
                      <ListGroup.Item key={file._id}>
                        {file.originalName}
                        <ButtonGroup style={{ float: "right" }}>
                          {!isPetOwner &&
                          file.appointment.veterinarian.user === user.id ? (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteFile(file._id)}
                            >
                              Delete
                            </Button>
                          ) : null}
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
                <Card.Text>
                  {Helpers.hasValue(pet.notes)
                    ? pet.notes
                    : "Nothing to display"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    )
  );
}
