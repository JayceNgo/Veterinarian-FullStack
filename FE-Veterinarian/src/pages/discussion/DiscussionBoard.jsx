import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "contexts";
import { MessageService } from "services";
import { Code, Modal } from "components";
import { Constants, Enums, Helpers, Urls } from "utils";

import { Button, Col, Row, Table } from "react-bootstrap";

export const DiscussionBoard = () => {
  const { isPetOwner, user } = useApp();
  const [messages, setMessages] = useState([]);
  const [incrementComponent, setIncrementComponent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { payload } = isPetOwner
        ? await MessageService.findOwnerDiscussions()
        : await MessageService.findVeterinarianDiscussions();
      setMessages(payload);
    };
    fetchData();
  }, [incrementComponent]);

  async function handleDelete(messageId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to delete this discussion?")) {
      const { status } = await MessageService.delete(messageId);
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
      }
    }
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <h3>Discussion Board</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Link
            className="btn btn-primary btn-sm"
            to={Urls.Path.Page.Discussion.Create}
          >
            Create Discussion
          </Link>
        </Col>
        <Col xs={12}>
          <div className="table-responsive">
            <Table striped bordered className="mt-3">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Replies</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => {
                  return (
                    <tr key={message._id}>
                      <td>
                        <Link
                          to={Helpers.interpolateURL(
                            Urls.Path.Page.Discussion.View,
                            {
                              id: message._id,
                            }
                          )}
                        >
                          {message.text.substring(0, 50)}...
                        </Link>
                      </td>
                      <td>{Helpers.formatDate(message.date)}</td>
                      <td>{message.user.firstName}</td>
                      <td>{message.replies.length ?? 0}</td>
                      <td className="text-center">
                        {user.id === message.user._id ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(message._id)}
                          >
                            Delete
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
    </>
  );
};
