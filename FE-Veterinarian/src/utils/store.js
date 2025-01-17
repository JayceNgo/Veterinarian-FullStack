import { Enums } from "utils";

const sessionStorage = {
  get: () => {
    return window.sessionStorage.petwallet
      ? JSON.parse(window.sessionStorage.petwallet)
      : {};
  },

  set: (values) => {
    window.sessionStorage.petwallet =
      Object.keys(values).length === 0
        ? ""
        : JSON.stringify({ ...sessionStorage.get(), ...values });
  },

  clear: () => {
    window.sessionStorage.petwallet = "";
  },

  isAuthenticated: () => {
    return (
      window.sessionStorage.petwallet && window.sessionStorage.petwallet !== ""
    );
  },

  isPetOwner: () => {
    return sessionStorage.get().userType === Enums.UserType.PET_OWNER;
  },

  isVeterinarian: () => {
    return sessionStorage.get().userType === Enums.UserType.VETERINARIAN;
  },

  isAdmin: () => {
    return sessionStorage.get().userType === Enums.UserType.ADMIN;
  },
};

export { sessionStorage };
