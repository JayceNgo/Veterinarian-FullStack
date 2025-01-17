export const Route = {
  Auth: {
    Path: "auth",
    Register: "register/:type?",
    ForgotPassword: "forgot-password",
    PasswordReset: "reset/:token",
  },
  Page: {
    Path: "/",
    Appointment: {
      Path: "appointment",
      MakeAppointment: "make-appointment/",
      View: "view/:id",
    },
    Discussion: {
      Path: "discussion",
      Create: "create",
      View: "view/:id?",
    },
    FileManagement: "file-management",
    Pet: {
      Path: "pet",
      Manage: "manage/:id?",
      View: "view/:id",
    },
    Treatment: {
      Path: "treatment/:id?/:petId?",
      Manage: "manage/:id?/:petId?/:medicationId?",
    },
    User: {
      Path: "user",
      Manage: "manage/:id?",
    },
  },
  QRCode: {
    Path: "redirect",
    Pet: "pet/:qrcode",
  },
};

export const Path = {
  Auth: {
    Index: "/auth",
    Register: "/auth/register/:type?",
    ForgotPassword: "/auth/forgot-password",
    PasswordReset: "/auth/reset/:token",
  },
  Page: {
    Home: "/",
    Appointment: {
      Index: "/appointment",
      MakeAppointment: "/appointment/make-appointment/",
      View: "/appointment/view/:id",
    },
    Discussion: {
      Index: "/discussion",
      Create: "/discussion/create",
      View: "/discussion/view/:id?",
    },
    FileManagement: {
      Index: "/file-management",
    },
    Pet: {
      Index: "/pet",
      Manage: "/pet/manage/:id?",
      View: "/pet/view/:id",
    },
    Treatment: {
      Index: "/treatment/:id/:petId",
      Manage: "/treatment/manage/:id/:petId/:medicationId?",
    },
    User: {
      Index: "/user",
      Manage: "/user/manage/:id?",
    },
  },
  QRCode: {
    Index: "/redirect",
    Pet: "/redirect/pet/:qrcode",
  },
};
