import { Api, Enums } from "utils";

class TokenService {
  #controllerName = "token";

  async find(token) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/" + token)
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
export default new TokenService();
