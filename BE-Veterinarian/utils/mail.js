import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

const params = {
  user: process.env.GMAIL_ACCOUNT,
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_SECRET,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN,
};

const oauth2Client = new OAuth2Client(
  params.clientId,
  params.clientSecret,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: params.refreshToken,
});

export const createTransporter = async () => {
  const accessToken = await oauth2Client.getAccessToken();

  const transport = {
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: params.user,
      accessToken,
      clientId: params.clientId,
      clientSecret: params.clientSecret,
      refreshToken: params.refreshToken,
    },
  };

  return nodemailer.createTransport(transport);
};
