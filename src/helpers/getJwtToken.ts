import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getJwtToken = (userId: string) : string => {
  return sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "1 day",
  });
};
