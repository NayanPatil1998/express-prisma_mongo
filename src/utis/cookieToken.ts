import { CookieOptions, Response } from "express";
import { getJwtToken } from "../helpers/getJwtToken";
import { __prod } from "./constants";

export const cookieToken = (user: any, res: Response) => {
  const token = getJwtToken(user.id);
  const options: CookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: __prod,
  };
  user.password = undefined;

  console.log(token)

  return res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
