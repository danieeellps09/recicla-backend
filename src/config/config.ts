import * as dotenv from "dotenv";
dotenv.config();
export default () => ({
    jwtSecretKey: process.env.JWT_SECRET_KEY || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || ''
  });
