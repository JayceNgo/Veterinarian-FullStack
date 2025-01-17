import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Input, Modal } from "components";
import { Enums, Helpers, Urls, Validation } from "utils";
import { MessageService } from "services";
import { useApp } from "contexts";

import { Button, Card, Col, Form, Row } from "react-bootstrap";

export function View() {
  const { user } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [replyModal, setReplyModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [incrementComponent, setIncrementComponent] = useState(0);

  const initForm = {
    text: { name: "text", value: "", ...Validation.long },
    user: { name: "user", value: user.id, ...Validation.none },
    parent: { name: "parent", value: id, ...Validation.none },
  };

  const [info, setInfo] = useState(null);
  const [form, setForm] = useState(initForm);

  const handleReplyModalOpen = () => setReplyModal(true);
  const handleReplyModalClose = () => setReplyModal(false);

  useEffect(() => {
    const fetchData = async () => {
      const { status, payload } = await MessageService.findById(id);
      if (status === Enums.Status.SUCCESS) {
        setInfo(payload);
      } else if (status === Enums.Status.NOTFOUND) {
        navigate(Urls.Path.Page.Discussion.Index);
      }
    };
    fetchData();
  }, [incrementComponent]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      const { status, message } = await MessageService.create(data);
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
        handleReplyModalClose();
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

  async function handleDelete(id) {
    const { status } = await MessageService.delete(id);
    if (status === Enums.Status.SUCCESS) {
      setIncrementComponent(incrementComponent + 1);
    }
  }

  return (
    <>
      {info && (
        <Row>
          <Col xs={12}>
            <h3>View Discussion</h3>
          </Col>
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Card.Title>
                  {info.user?.firstName}{" "}
                  {info.pet && (
                    <small>
                      (
                      <Link
                        to={Helpers.interpolateURL(Urls.Path.Page.Pet.View, {
                          id: info.pet._id,
                        })}
                      >
                        view pet
                      </Link>
                      )
                    </small>
                  )}
                </Card.Title>
                <Card.Text>{info.text}</Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted">
                {user.id !== info.user._id && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleReplyModalOpen}
                  >
                    Reply
                  </Button>
                )}
                <span style={{ float: "right", lineHeight: 1.75 }}>
                  at {Helpers.formatDate(info.date)}
                </span>
              </Card.Footer>
            </Card>
          </Col>
          {info.replies ? (
            <Row>
              <Col xs={{ span: 11, offset: 1 }}>
                {info.replies.map((message) => {
                  return (
                    <Card className="mt-3" key={message._id}>
                      <Card.Body>
                        <Card.Text>{message.text}</Card.Text>
                      </Card.Body>
                      <Card.Footer className="text-muted">
                        {user.id === message.user ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(message._id)}
                          >
                            Delete
                          </Button>
                        ) : null}
                        <span style={{ float: "right", lineHeight: 2.25 }}>
                          {`at ${Helpers.formatDate(message.date)}`}
                        </span>
                      </Card.Footer>
                    </Card>
                  );
                })}
              </Col>
            </Row>
          ) : null}
        </Row>
      )}
      <Modal show={replyModal} onClose={handleReplyModalClose} title="Reply">
        <Alert message={alertMessage} />
        <Form onSubmit={handleSubmit}>
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
              Send Message
            </Button>
          </Form.Group>
        </Form>
      </Modal>
    </>
  );
}
