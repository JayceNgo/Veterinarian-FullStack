import { Api, Enums, Helpers } from "utils";

class UserService {
  #controllerName = "user";

  async findUsers() {
    return this.#handleResponse(await Api.get(this.#controllerName + "/users"));
  }

  async findById(id) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/find/" + id)
    );
  }

  async findVeterinarians() {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/veterinarians")
    );
  }

  async create(id, user) {
    return this.#handleResponse(
      await Api.post(this.#controllerName, { owner: id, ...user })
    );
  }

  async update(id, user) {
    delete user.password;
    return this.#handleResponse(
      await Api.put(this.#controllerName + "/update/" + id, user)
    );
  }

  async delete(id) {
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
export default new UserService();
