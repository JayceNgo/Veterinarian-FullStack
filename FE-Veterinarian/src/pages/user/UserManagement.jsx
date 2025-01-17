import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserService } from "services";
import { Constants, Enums, Helpers, Urls } from "utils";

import { Button, Col, Row, Table } from "react-bootstrap";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [incrementComponent, setIncrementComponent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { payload } = await UserService.findUsers();
      setUsers(payload);
    };
    fetchData();
  }, [incrementComponent]);

  async function handleDelete(id) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to delete this user?")) {
      const { status } = await UserService.delete(id);
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
      }
    }
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <h3>User Management</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Link
            to={Helpers.interpolateURL(Urls.Path.Page.User.Manage, {
              id: "",
            })}
          >
            Add User
          </Link>
          <div className="table-responsive">
            <Table striped bordered className="mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr key={user.id}>
                      <td>
                        <Link
                          to={Helpers.interpolateURL(
                            Urls.Path.Page.User.Manage,
                            {
                              id: user.id,
                            }
                          )}
                        >
                          {user.name}
                        </Link>
                      </td>
                      <td>{user.phone}</td>
                      <td>{user.email}</td>
                      <td>{user.userType}</td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
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
