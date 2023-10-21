import * as dotenv from "dotenv";
dotenv.config();
export default () => ({
    jwtSecretKey: process.env.JWT_SECRET_KEY || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    provedor_email: process.env.EMAIL_HOST || '',
    email_username: process.env.EMAIL_USERNAME || '' ,
    email_password: process.env.EMAIL_PASSWORD || ''
  });
