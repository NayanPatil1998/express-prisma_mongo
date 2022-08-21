import { hash } from "argon2";
import { Request, Response } from "express";
import { cookieToken } from "../utis/cookieToken";
import prisma from "../../prisma/";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(501).json({
        message: "Please provide all fields",
      });
    }

    const hashedPassword = await hash(password);

    
    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        },
    });
    
    console.log("user ", user);
    cookieToken(user, res)

  } catch (error) {
    console.log(error)
     res.status(501).json({
        message: error.message,
      });
  }
};
