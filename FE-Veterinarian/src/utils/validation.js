// eslint-disable-next-line import/no-anonymous-default-export
export default {
  none: {
    errors: [],
    validations: {},
  },
  short: {
    errors: [],
    validations: {
      required: true,
      maxLength: 100,
    },
  },
  long: {
    errors: [],
    validations: {
      required: true,
      maxLength: 500,
    },
  },
  email: {
    errors: [],
    validations: {
      required: true,
      pattern: {
        regex: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        error: ["Email is not valid"],
      },
    },
  },
  phone: {
    errors: [],
    validations: {
      required: true,
      pattern: {
        regex: /^\d{10}$/,
        error: ["Phone is not valid"],
      },
    },
  },
  password: {
    errors: [],
    validations: {
      required: true,
      pattern: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        error: [
          "Minimum password length is eight characters.",
          "Password must contain at least one letter and one number",
        ],
      },
    },
  },
};
