import { Constants } from "utils";

export function toJSON(form) {
  return Object.keys(form).reduce(
    (acc, item) => ({ ...acc, [item]: form[item].value }),
    {}
  );
}

export function isValid(form) {
  let isValid = true;
  for (const input in form) {
    const field = form[input];
    field.errors = validate(field.name, field.value, field.validations);
    if (field.errors.length !== 0) {
      isValid = false;
    }
  }
  return isValid;
}

export function validate(name, value, validations) {
  const errors = [];
  if (value) {
    if (validations.minLength) {
      if (value.length < validations.minLength) {
        errors.push(
          `${name} must be longer than ${validations.minLength} characters`
        );
      }
    }
    if (validations.maxLength) {
      if (value.length > validations.maxLength) {
        errors.push(
          `${name} must be less than ${validations.maxLength} characters`
        );
      }
    }
    if (validations.pattern) {
      if (!validations.pattern?.regex.test(value)) {
        for (const error of validations.pattern.error) {
          errors.push(error);
        }
      }
    }
  } else if (validations.required) {
    errors.push(`${name} is required`);
  }

  return errors;
}

export function hasValue(...params) {
  for (const value of params) {
    if (
      !!!(
        value !== null &&
        value !== undefined &&
        value.toString().trim().length > 0
      )
    ) {
      return false;
    }
  }
  return true;
}

export function interpolateURL(url, obj) {
  return Object.keys(obj).reduce((previousValue, currentValue) => {
    return previousValue.replaceAll(`:${currentValue}`, obj[currentValue]);
  }, url);
}

export function fromJSON(obj, values) {
  const form = { ...obj };
  Object.keys(values).forEach((item) => {
    if (item in form) {
      form[item].value = values[item];
    }
  });
  return form;
}

export function pad(value, size = 2) {
  return !isNaN(Number.parseFloat(value))
    ? "0".repeat(Math.max(0, size - Math.abs(value).toString().length)) +
        Math.abs(value)
    : "";
}

export function isObject(value) {
  return !!value && Object.prototype.toString.call(value) === "[object Object]";
}

export function time(value) {
  if (value <= 0) return value;
  else {
    const day = Math.floor(value / 86400);
    const hour = Math.floor((value - day * 86400) / 3600);
    const min = Math.floor((value - day * 86400 - hour * 3600) / 60);
    const sec = Math.floor(value - day * 86400 - hour * 3600 - min * 60);
    return hour > 0 ? { hour, min, sec } : min > 0 ? { min, sec } : { sec };
  }
}

export function compareTo(a, b) {
  return !a || !b
    ? false
    : a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear();
}

export function toSeconds(value) {
  if (!value) return 0;
  const hours = value.getHours();
  const minutes = value.getMinutes();
  const seconds = value.getSeconds();
  return hours * 3600 + minutes * 60 + seconds;
}

export function toMinutes(value, am = "AM") {
  if (!value) return 0;
  const array = value.toUpperCase().split(" ");
  const time = array[0].split(":");
  const ampm = time.length === 2;
  const period = ampm ? array[1].toUpperCase() : null;
  const hour = Number(time[0]);
  const hours = hour * 60 + Number(time[1]);
  const extra = !ampm || period === am || hour === 12 ? 0 : 12 * 60;
  return hours + extra;
}

export function toTimeString(value, seconds = true) {
  const response = time(value);
  if (isObject(response)) {
    const length = Object.keys(response).length;
    const mapped = Object.values(response)
      .map((item) => pad(item))
      .join(":");
    return length === 1
      ? "00:" + mapped
      : length === 3 && !seconds
      ? mapped.slice(0, 5)
      : mapped;
  }
  return "00:00:00";
}

export function toTimeAmPmString(value, seconds = true, am = "am", pm = "pm") {
  const timeString = toTimeString(value, seconds);
  const time = timeString.split(":");
  const hour = Number(time.shift());
  if (hour >= 12) {
    const diff = 12 - Number(hour);
    return (
      pad(Math.abs(diff === 0 ? 12 : diff)) +
      ":" +
      time.map((item) => pad(item)).join(":") +
      " " +
      pm
    );
  }
  return timeString + " " + am;
}

export function toISOString(date, time) {
  if (!date) return "";
  const dateISO = date.toISOString();
  const dateString = dateISO.split("T")[0];
  const newTime = hasValue(time) ? time : toTimeString(toSeconds(date));
  return `${dateString}T${newTime}.000Z`;
}

export function addHours(date, hours) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date;
}

export function toTimezone(date) {
  date = new Date(date);
  return addHours(date, Constants.TIMEZONE.DIFF);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date) {
  return new Date(date).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toAge(date) {
  const today = new Date();
  const birthdateObj = new Date(date);
  let ageYears = today.getFullYear() - birthdateObj.getFullYear();
  let ageMonths = today.getMonth() - birthdateObj.getMonth();
  let ageDays = today.getDate() - birthdateObj.getDate();
  if (
    ageMonths < 0 ||
    (ageMonths === 0 && today.getDate() < birthdateObj.getDate())
  ) {
    ageYears--;
    ageMonths += 12;
  }
  let ageStr = "";
  if (ageYears > 0) {
    ageStr += ageYears + (ageYears === 1 ? " year" : " years");
  }
  if (ageMonths > 0) {
    ageStr +=
      (ageStr ? " " : "") +
      ageMonths +
      (ageMonths === 1 ? " month" : " months");
  }
  if (ageMonths < 1) {
    ageStr += ageDays + (ageMonths === 1 ? " day" : " days");
  }
  return ageStr;
}
