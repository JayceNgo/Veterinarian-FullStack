import React, { useEffect, useState } from "react";
import { useApp } from "contexts";
import { MedicationService, TreatmentService } from "services";
import { Link, useParams } from "react-router-dom";
import { Modal } from "components";
import { Enums, Helpers, Urls } from "utils";

import { Button, Card, Col, ListGroup, Row, Table } from "react-bootstrap";

export const Treatment = () => {
  const { isPetOwner, user } = useApp();
  const { id, petId } = useParams();
  const [medication, setMedication] = useState(null);
  const [treatment, setTreatment] = useState(null);
  const [dosageModal, setDosageModal] = useState(false);
  const [incrementComponent, setIncrementComponent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { payload } = await TreatmentService.findById(id, petId);
      setTreatment(payload);
    };
    fetchData();
  }, [incrementComponent]);

  async function handleDelete(medicationId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to delete this medication?")) {
      const { status } = await MedicationService.delete(
        id,
        petId,
        medicationId
      );
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
      }
    }
  }

  async function handleAddDosage() {
    const { status } = await MedicationService.add(id, petId, medication._id);
    if (status === Enums.Status.SUCCESS) {
      setIncrementComponent(incrementComponent + 1);
      handleDosageModalClose();
    }
  }

  async function handleRemoveDosage(dosageId) {
    const { status } = await MedicationService.remove(
      id,
      petId,
      medication._id,
      dosageId
    );
    if (status === Enums.Status.SUCCESS) {
      setIncrementComponent(incrementComponent + 1);
      handleDosageModalClose();
    }
  }

  const handleDosageModalOpen = (medication) => {
    setMedication(medication);
    setDosageModal(true);
  };
  const handleDosageModalClose = () => setDosageModal(false);

  const isReadOnly = treatment
    ? treatment.veterinarian.user._id !== user.id ||
      Helpers.hasValue(treatment.endDate)
    : true;

  return (
    <>
      <Row>
        <Col xs={12}>
          <h3>Treatment</h3>
        </Col>
      </Row>
      {treatment && (
        <Row>
          <Col xs={12}>
            <Card className="mb-3">
              <Card.Header>Treatment's information</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <b>Name:</b> {treatment.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Veterinarian:</b>{" "}
                  {`${treatment.veterinarian.user.firstName} ${treatment.veterinarian.user.lastName}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Start Date:</b> {Helpers.formatDate(treatment.startDate)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>End Date:</b>{" "}
                  {Helpers.hasValue(treatment.endDate)
                    ? Helpers.formatDate(treatment.endDate)
                    : "In progress"}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
      <Row>
        {!isReadOnly && (
          <Col xs={12}>
            <Link
              className="btn btn-primary btn-sm"
              to={Helpers.interpolateURL(Urls.Path.Page.Treatment.Manage, {
                id,
                petId,
                medicationId: "",
              })}
            >
              Add Medication
            </Link>
          </Col>
        )}
        <Col xs={12}>
          <div className="table-responsive">
            <Table striped bordered className="mt-3">
              <thead>
                <tr>
                  <th>Medication Name</th>
                  <th>Amount</th>
                  <th>Unit</th>
                  <th>Interval</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {treatment &&
                  treatment.medications &&
                  treatment.medications.map((medication) => {
                    return (
                      <tr key={medication._id}>
                        <td>
                          {!isReadOnly ? (
                            <Link
                              to={Helpers.interpolateURL(
                                Urls.Path.Page.Treatment.Manage,
                                {
                                  id,
                                  petId,
                                  medicationId: medication._id,
                                }
                              )}
                            >
                              {medication.name}
                            </Link>
                          ) : (
                            medication.name
                          )}
                        </td>
                        <td>{medication.amount}</td>
                        <td>{medication.unit}</td>
                        <td>{medication.interval}</td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDosageModalOpen(medication)}
                          >
                            View
                          </Button>
                          {!isReadOnly && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(medication._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Modal show={dosageModal} onClose={handleDosageModalClose} title="Dosage">
        {isPetOwner && (
          <Button variant="primary" type="submit" onClick={handleAddDosage}>
            Add Dosage
          </Button>
        )}
        <div className="table-responsive">
          <Table striped bordered className="mt-3">
            <thead>
              <tr>
                <th>Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medication &&
                medication.dosages.map((dosage) => {
                  return (
                    <tr key={dosage._id}>
                      <td>{Helpers.formatDateTime(dosage.administeredAt)}</td>
                      <td className="text-center">
                        {isPetOwner && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRemoveDosage(dosage._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </Modal>
    </>
  );
};
