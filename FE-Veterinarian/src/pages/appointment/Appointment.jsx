import React, { useEffect, useState } from "react";
import { useApp } from "contexts";
import { AppointmentService } from "services";
import { Link } from "react-router-dom";
import { Enums, Helpers, Urls } from "utils";

import { Button, Col, Row, Table } from "react-bootstrap";

export const Appointment = () => {
  const { user } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [incrementComponent, setIncrementComponent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { payload } = await AppointmentService.findByPetOwner(user.id);
      setAppointments(payload);
    };
    fetchData();
  }, [incrementComponent]);

  async function handleCancel(appointmentId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to cancel this appointment?")) {
      const { status } = await AppointmentService.cancel(appointmentId);
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
      }
    }
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
              <Link
                className="btn btn-primary btn-sm"
                to={Urls.Path.Page.Appointment.MakeAppointment}
              >
                Make an appointment
              </Link>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="table-responsive">
                <Table striped bordered className="mt-3">
                  <thead>
                    <tr>
                      <th>Pet Name</th>
                      <th>Vet Name</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments &&
                      appointments.map((appointment) => {
                        const formattedDate = Helpers.toTimezone(
                          appointment.date
                        );
                        return (
                          <tr key={appointment._id}>
                            <td>{appointment.pet.name}</td>
                            <td>
                              {`${appointment.veterinarian.user.firstName} ${appointment.veterinarian.user.lastName}`}
                            </td>
                            <td>
                              {formattedDate.toLocaleDateString("en", {
                                hour: "numeric",
                                minute: "numeric",
                              })}
                            </td>
                            <td>{appointment.status}</td>
                            <td className="text-center">
                              <Link
                                className="btn btn-secondary btn-sm"
                                to={Helpers.interpolateURL(
                                  Urls.Path.Page.Appointment.View,
                                  { id: appointment._id }
                                )}
                              >
                                View
                              </Link>
                              {new Date() <= formattedDate &&
                              appointment.status ===
                                Enums.AppointmentStatus.SCHEDULED ? (
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleCancel(appointment._id)}
                                >
                                  Cancel
                                </Button>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
