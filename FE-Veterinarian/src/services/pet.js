import { Api, Enums, Helpers } from "utils";

class PetService {
  #controllerName = "pet";

  async findByOwner(id) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/owner/" + id)
    );
  }

  async findByVeterinarian(id) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/veterinarian/" + id)
    );
  }

  async findById(id) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/find/" + id)
    );
  }

  async view(id) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/view/" + id)
    );
  }

  async create(id, pet) {
    return this.#handleResponse(
      await Api.post(this.#controllerName, { owner: id, ...pet })
    );
  }

  async update(id, pet) {
    return this.#handleResponse(
      await Api.put(this.#controllerName + "/update/" + id, pet)
    );
  }

  async delete(id) {
    return this.#handleResponse(
      await Api.delete(this.#controllerName + "/delete/" + id)
    );
  }

  async share(userId, petId) {
    return this.#handleResponse(
      await Api.get(
        Helpers.interpolateURL(this.#controllerName + "/share/:userId/:petId", {
          userId,
          petId,
        })
      )
    );
  }

  async unshare(veterinarianId, petId) {
    return this.#handleResponse(
      await Api.get(
        Helpers.interpolateURL(
          this.#controllerName + "/unshare/:veterinarianId/:petId",
          { veterinarianId, petId }
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
export default new PetService();
