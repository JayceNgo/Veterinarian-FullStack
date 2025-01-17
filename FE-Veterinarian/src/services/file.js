import { Api, Enums, Helpers } from "utils";

class FileService {
  #controllerName = "file";

  async download(id, petId) {
    return this.#handleResponse(
      await Api.get(
        Helpers.interpolateURL(this.#controllerName + "/download/:id/:petId", {
          id,
          petId,
        })
      )
    );
  }

  async upload(id, petId, file) {
    return this.#handleResponse(
      await Api.post(
        Helpers.interpolateURL(this.#controllerName + "/upload/:id/:petId", {
          id,
          petId,
        }),
        file
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
export default new FileService();
