import * as dotenv from 'dotenv';

dotenv.config();

export const appPort = process.env.APP_PORT || 3000;
export const jwtSecret = process.env.JWT_SECRET;
