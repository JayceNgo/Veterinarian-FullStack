import { Enums, File, Mail } from "../utils/index.js";

export async function forgetPassword(email, token) {
  try {
    const options = {
      mail: {
        from: "contadesenvolvedor@gmail.com",
        to: email,
        subject: "Reset Password",
      },
      content: {
        header: "You have requested to reset your password.",
        subheader:
          "We cannot just send you the old password, however, a link was provided for you in order to choose a new one, click on the link below and follow the instructions.",
        button: "Click here",
        href: `${process.env.FRONTEND_URL}/auth/reset/${token}`,
        description:
          "If you did not request it, ignore this email. There is no need to panic, only those who have access to this email can ever change the password.",
      },
    };

    const html = File.readAndReplace(options.content);
    return await send({
      ...options.mail,
      html,
    });
  } catch (err) {
    return { status: Enums.Status.ERROR };
  }
}

async function send(options) {
  try {
    const transporter = await Mail.createTransporter();
    await transporter.sendMail(options);
    transporter.close();
    return { status: Enums.Status.SUCCESS };
  } catch (err) {
    return { status: Enums.Status.ERROR };
  }
}
