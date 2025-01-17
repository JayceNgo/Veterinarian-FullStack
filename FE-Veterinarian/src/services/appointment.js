import { Api, Constants, Enums, Helpers } from "utils";

class AppointmentService {
  #controllerName = "appointment";

  async findById(id) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/find/" + id)
    );
  }

  async findByPetOwner(id) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/owner/" + id)
    );
  }

  async findByVeterinarianAndDate(id, date) {
    return this.#handleResponse(
      await Api.get(
        Helpers.interpolateURL(this.#controllerName + "/check/:id/:date", {
          id,
          date,
        })
      )
    );
  }

  async findByPetOwnerTwoWeeks(id) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/owner-two-weeks/" + id)
    );
  }

  async findByVeterinarianTwoWeeks(id) {
    return this.#handleResponse(
      await Api.get(this.#controllerName + "/veterinarian-two-weeks/" + id)
    );
  }

  async create(data) {
    const newDate = Helpers.toISOString(
      new Date(data.date),
      Helpers.toTimeString(Helpers.toMinutes(data.time) * 60)
    );
    delete data.time;
    return this.#handleResponse(
      await Api.post(this.#controllerName + "/", {
        ...data,
        date: newDate,
        status: "Scheduled",
      })
    );
  }

  async update(id, data) {
    return this.#handleResponse(
      await Api.patch(
        Helpers.interpolateURL(this.#controllerName + "/update/:id", { id }),
        data
      )
    );
  }

  async cancel(id) {
    return this.#handleResponse(
      await Api.patch(
        Helpers.interpolateURL(this.#controllerName + "/cancel/:id", { id })
      )
    );
  }

  async availability(id, date) {
    if (!date) return [];
    const { payload } = await this.findByVeterinarianAndDate(id, date);
    const reduced = this.#reduceArray(payload ?? []);
    const slots = [];

    const min = Helpers.compareTo(new Date(date), new Date())
      ? Helpers.toSeconds(
          new Date(new Date(date).setTime(new Date().getTime()))
        ) / 60
      : 0;

    for (
      let i = Constants.APPOINTMENT_TIME.START;
      i <= Constants.APPOINTMENT_TIME.END;
      i += Constants.APPOINTMENT_TIME.LENGTH
    ) {
      if (i > min) {
        const ampm = Helpers.toTimeAmPmString(i);
        const time = Helpers.toTimeString(i * 60);
        const iso = Helpers.toISOString(new Date(date), time);
        if (!reduced.includes(iso)) {
          slots.push(ampm);
        }
      }
    }
    return slots;
  }

  #reduceArray(events, appointmentLength = Constants.APPOINTMENT_TIME.LENGTH) {
    if (!events || (events && events.length === 0)) return [];
    /**
     * only the start time is considered due to the necessity of allowing the overlap of the end time
     * only the times that overlaps the possible slots (considering the length) are included to enhance performance
     */
    return events
      .map((item) => {
        const busy = [];

        let date = new Date(item.date);
        // it converts time to string e.g. x timestamp => 10:00:00
        const timeString = Helpers.toTimeString(date.getTime() / 1000);
        // it converts the time string to minutes e.g. 10:00:00 => 600
        const minutes = Helpers.toMinutes(timeString);
        // it verifies if the minutes are multiple of the timespan defined
        if (minutes % appointmentLength === 0) {
          busy.push(Helpers.toISOString(date, timeString));
        }
        date.setMinutes(date.getMinutes() + 1);

        return busy.join();
      })
      .join();
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
export default new AppointmentService();
