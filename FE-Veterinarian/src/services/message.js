import { Api, Enums } from "utils";

class MessageService {
  #controllerName = "message";

  async findOwnerDiscussions(token) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/owners")
    );
  }

  async findVeterinarianDiscussions(token) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/veterinarians")
    );
  }

  async findById(id) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/find/" + id)
    );
  }

  async create(message) {
    return this.#handleResponse(
      await Api.post(this.#controllerName + "/", message)
    );
  }

  async update(id, message) {
    return this.#handleResponse(
      await Api.put(this.#controllerName + "/update/" + id, message)
    );
  }

  async delete(id, message) {
    return this.#handleResponse(
      await Api.delete(this.#controllerName + "/delete/" + id)
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
export default new MessageService();
