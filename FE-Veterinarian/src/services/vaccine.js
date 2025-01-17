import { Api, Enums, Helpers } from "utils";

class VaccineService {
  #controllerName = "vaccine";

  async create(id, petId, vaccine) {
    return this.#handleResponse(
      await Api.post(
        Helpers.interpolateURL(this.#controllerName + "/:id/:petId", {
          id,
          petId,
        }),
        vaccine
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
export default new VaccineService();
