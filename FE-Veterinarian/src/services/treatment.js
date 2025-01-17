import { Api, Enums, Helpers } from "utils";

class TreatmentService {
  #controllerName = "treatment";

  async findById(id, petId) {
    return this.#handleResponse(
      await Api.get(
        Helpers.interpolateURL(this.#controllerName + "/:id/:petId", {
          id,
          petId,
        })
      )
    );
  }

  async create(id, petId, treatment) {
    return this.#handleResponse(
      await Api.post(
        Helpers.interpolateURL(this.#controllerName + "/:id/:petId", {
          id,
          petId,
        }),
        treatment
      )
    );
  }

  async complete(id, petId) {
    return this.#handleResponse(
      await Api.patch(
        Helpers.interpolateURL(this.#controllerName + "/update/:id/:petId", {
          id,
          petId,
        })
      )
    );
  }

  async delete(id, petId) {
    return this.#handleResponse(
      await Api.delete(
        Helpers.interpolateURL(this.#controllerName + "/delete/:id/:petId", {
          id,
          petId,
        })
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
export default new TreatmentService();
