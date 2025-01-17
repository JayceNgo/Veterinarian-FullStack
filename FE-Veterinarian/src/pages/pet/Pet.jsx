import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "contexts";
import { PetService, UserService } from "services";
import { Code, Modal, Select } from "components";
import { Constants, Enums, Helpers, Urls, Validation } from "utils";

import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";

export const Pet = () => {
  const { isPetOwner, user } = useApp();
  const [pet, setPet] = useState({});
  const [pets, setPets] = useState([]);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeModal, setQrCodeModal] = useState(false);
  const [veterinarians, setVeterinarians] = useState([]);
  const [veterinarianModal, setVeterinarianModal] = useState(false);
  const [incrementComponent, setIncrementComponent] = useState(0);

  const initForm = {
    veterinarian: { name: "veterinarian", value: "", ...Validation.short },
  };

  const [form, setForm] = useState(initForm);

  useEffect(() => {
    const fetchData = async () => {
      const { payload } = isPetOwner
        ? await PetService.findByOwner(user.id)
        : await PetService.findByVeterinarian(user.id);
      setPets(payload);
    };
    fetchData();
  }, [incrementComponent]);

  async function vets() {
    const { status, payload } = await UserService.findVeterinarians();
    if (status === Enums.Status.SUCCESS) {
      setVeterinarians(payload);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (Helpers.isValid(form)) {
      const data = Helpers.toJSON(form);
      const { status, payload } = await PetService.share(
        data.veterinarian,
        pet._id
      );
      if (status === Enums.Status.SUCCESS) {
        handleVeterinarianModalClose();
      }
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    form[name].value = value;
    setForm({ ...form });
  }

  async function handleVeterinarianDelete(veterinarianId, petId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to delete this veterinarian?")) {
      const { status } = await PetService.unshare(veterinarianId, petId);
      if (status === Enums.Status.SUCCESS) {
        handleVeterinarianModalClose();
      }
    }
  }

  async function handlePetDelete(petId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to delete this pet?")) {
      const { status } = await PetService.delete(petId);
      if (status === Enums.Status.SUCCESS) {
        setIncrementComponent(incrementComponent + 1);
      }
    }
  }

  const handleQRCodeModalOpen = (id) => {
    const qrcode = Helpers.interpolateURL(
      Constants.ENV.FRONTEND_URL + Urls.Path.QRCode.Pet,
      {
        qrcode: id,
      }
    );
    setQrCode(qrcode);
    setQrCodeModal(true);
  };

  const handleQRCodeModalClose = () => {
    setIncrementComponent(incrementComponent + 1);
    setQrCodeModal(false);
  };

  const handleVeterinarianModalOpen = (pet) => {
    setPet(pet);
    vets();
    setVeterinarianModal(true);
  };

  const handleVeterinarianModalClose = () => {
    setForm(initForm);
    setIncrementComponent(incrementComponent + 1);
    setVeterinarianModal(false);
  };

  return (
    <>
      {" "}
      <Row>
        <Col xs={12}>
          <h3>Pets</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {isPetOwner ? (
            <Link
              className="btn btn-primary btn-sm"
              to={Helpers.interpolateURL(Urls.Path.Page.Pet.Manage, {
                id: "",
              })}
            >
              Add Pet
            </Link>
          ) : null}
          <div className="table-responsive">
            <Table striped bordered className="mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Breed</th>
                  <th>Species</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets
                  ? pets.map((pet) => {
                      return (
                        <tr key={pet._id}>
                          <td>
                            {isPetOwner ? (
                              <Link
                                to={Helpers.interpolateURL(
                                  Urls.Path.Page.Pet.Manage,
                                  {
                                    id: pet._id,
                                  }
                                )}
                              >
                                {pet.name}
                              </Link>
                            ) : (
                              pet.name
                            )}
                          </td>
                          <td>{pet.breed}</td>
                          <td>{pet.species}</td>
                          <td className="text-center">
                            <Link
                              className="btn btn-secondary btn-sm"
                              to={Helpers.interpolateURL(
                                Urls.Path.Page.Pet.View,
                                {
                                  id: pet._id,
                                }
                              )}
                            >
                              View
                            </Link>
                            {isPetOwner ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    handleVeterinarianModalOpen(pet)
                                  }
                                >
                                  Veterinarian
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleQRCodeModalOpen(pet._id)}
                                >
                                  QRCode
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handlePetDelete(pet._id)}
                                >
                                  Delete
                                </Button>
                              </>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      {isPetOwner ? (
        <>
          <Modal
            show={qrCodeModal}
            onClose={handleQRCodeModalClose}
            title="QRCode"
          >
            <Code value={qrCode} />
          </Modal>
          <Modal
            show={veterinarianModal}
            onClose={handleVeterinarianModalClose}
            title="Veterinarian"
          >
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Select
                  withGroup={false}
                  className="form-control"
                  name={form.veterinarian.name}
                  value={form.veterinarian.value}
                  error={form.veterinarian.errors}
                  handleChange={handleChange}
                  options={veterinarians.map((item) => {
                    return {
                      value: item.user._id,
                      text: `${item.user.firstName} ${item.user.lastName}`,
                    };
                  })}
                />
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </InputGroup>
            </Form>
            <div className="table-responsive">
              <Table striped bordered className="mt-3">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialty</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pet.veterinarians &&
                    pet.veterinarians.map((veterinarian) => {
                      return (
                        <tr key={veterinarian._id}>
                          <td>
                            {`${veterinarian.user.firstName} ${veterinarian.user.lastName}`}
                          </td>
                          <td>{veterinarian.specialty}</td>
                          <td className="text-center">
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleVeterinarianDelete(
                                  veterinarian._id,
                                  pet._id
                                )
                              }
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
          </Modal>
        </>
      ) : null}
    </>
  );
};
