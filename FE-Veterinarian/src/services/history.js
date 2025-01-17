import { Api, Enums } from "utils";

class HistoryService {
  #controllerName = "pet";

  async getPetHistory(petName) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/history/" + petName)
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
export default new HistoryService();
