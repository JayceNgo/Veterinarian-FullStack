import { Api, Enums, Store } from "utils";

class AuthService {
  #controllerName = "auth";

  async signup(data) {
    return this.#handleResponse(
      data.userType === Enums.UserType.VETERINARIAN
        ? await Api.post(this.#controllerName + "/sign-up/veterinarian", data)
        : await Api.post(this.#controllerName + "/sign-up/pet-owner", data)
    );
  }

  async signin(email, password) {
    return this.#handleResponse(
      await Api.post(this.#controllerName + "/sign-in", {
        email,
        password,
      })
    );
  }

  async signout() {
    Store.sessionStorage.clear();
  }

  async forgotPassword(email) {
    return this.#handleResponse(
      await Api.post(this.#controllerName + "/forgot-password", {
        email,
      })
    );
  }

  async resetPassword(token, password) {
    return this.#handleResponse(
      await Api.patch(this.#controllerName + "/reset-password", {
        token,
        password,
      })
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
export default new AuthService();
