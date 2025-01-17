import { Api, Enums, Helpers } from "utils";

class MedicationService {
  #controllerName = "medication";

  async find(id, petId, medicationId) {
    return this.#handleResponse(
      await Api.get(
        Helpers.interpolateURL(
          this.#controllerName + "/:id/:petId/:medicationId",
          {
            id,
            petId,
            medicationId,
          }
        )
      )
    );
  }

  async create(id, petId, medication) {
    return this.#handleResponse(
      await Api.post(
        Helpers.interpolateURL(this.#controllerName + "/:id/:petId", {
          id,
          petId,
        }),
        medication
      )
    );
  }

  async update(id, petId, medicationId, medication) {
    return this.#handleResponse(
      await Api.patch(
        Helpers.interpolateURL(
          this.#controllerName + "/update/:id/:petId/:medicationId",
          {
            id,
            petId,
            medicationId,
          }
        ),
        medication
      )
    );
  }

  async delete(id, petId, medicationId) {
    return this.#handleResponse(
      await Api.delete(
        Helpers.interpolateURL(
          this.#controllerName + "/delete/:id/:petId/:medicationId",
          {
            id,
            petId,
            medicationId,
          }
        )
      )
    );
  }

  async add(id, petId, medicationId) {
    return this.#handleResponse(
      await Api.patch(
        Helpers.interpolateURL(
          this.#controllerName + "/add/:id/:petId/:medicationId",
          { id, petId, medicationId }
        )
      )
    );
  }

  async remove(id, petId, medicationId, dosageId) {
    return this.#handleResponse(
      await Api.delete(
        Helpers.interpolateURL(
          this.#controllerName + "/remove/:id/:petId/:medicationId/:dosageId",
          {
            id,
            petId,
            medicationId,
            dosageId,
          }
        )
      )
    );
  }

  #handleResponse(response) {
    try {
      if (response && response.data) return response.data;
    } catch (err) {
      return { status: Enums.Status.ERROR };
    }
    return { status: Enums.Status.NONE };
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new MedicationService();
