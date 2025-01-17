import "assets/styles/home.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppointmentService } from "services";
import { Constants, Enums, Helpers, Urls } from "utils";
import { useApp } from "contexts";

import { Button, Col, Row, Table } from "react-bootstrap";

export const Home = () => {
  const { isPetOwner, user } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [incrementComponent, setIncrementComponent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { payload } = isPetOwner
        ? await AppointmentService.findByPetOwnerTwoWeeks(user.id)
        : await AppointmentService.findByVeterinarianTwoWeeks(user.id);
      setAppointments(payload);
    };
    fetchData();
  }, [incrementComponent]);

  return (
    <>
      <Row>
        <Col xs={12}>
          <h3>Following Appointments</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="table-responsive">
            <Table striped bordered className="mt-3">
              <thead>
                <tr>
                  <th>Pet Name</th>
                  <th>Owner Name</th>
                  <th>Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments &&
                  appointments.map((appointment) => {
                    const formattedDate = Helpers.toTimezone(appointment.date);
                    return (
                      <tr key={appointment._id}>
                        <td>{appointment.pet?.name}</td>
                        <td>{appointment.pet?.owner.firstName}</td>
                        <td>
                          {formattedDate.toLocaleDateString("en", {
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </td>
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
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </>
  );
};
