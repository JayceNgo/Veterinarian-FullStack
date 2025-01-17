export const Status = {
  NONE: 0,
  SUCCESS: 200,
  BADREQUEST: 401,
  NOTFOUND: 404,
  ERROR: 500,
};

export const UserType = {
  PET_OWNER: "PetOwner",
  VETERINARIAN: "Veterinarian",
  ADMIN: "SysAdmin",
};

export const AppointmentStatus = {
  COMPLETED: "Completed",
  SCHEDULED: "Scheduled",
  CANCELLED: "Cancelled",
};

export const MedicationDosageUnit = {
  MILLIGAMS: "milligrams (mg)",
  GRAMS: "grams (g)",
  MILLILITERS: "milliliters (ml)",
  TEASPOONS: "teaspoons (tsp)",
  TABLESPOONS: "tablespoons (tbsp)",
  DROPS: "drops",
  PIIL: "pill",
  CAPSULES: "capsules",
};
