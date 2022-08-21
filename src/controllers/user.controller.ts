import { hash, verify } from "argon2";
import { Request, Response } from "express";
import { cookieToken } from "../utis/cookieToken";
import prisma from "../../prisma/";
import validator from "validator";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(501).json({
        message: "Please provide all fields",
      });
    }

    const hitUser = await prisma.user.findUnique({
      where: { email },
    });

    if (hitUser) {
      return res.status(501).json({
        message: `A user with email ${email} already exist`,
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

    cookieToken(user, res);
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (
      validator.isEmpty(email) ||
      !validator.isEmail(email) ||
      validator.isEmpty(password)
    ) {
      return res.status(501).json({
        message: "Please provide correct fields",
      });
    }

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    const isPasswordCorrect = await verify(user.password, password);

    if (!isPasswordCorrect) {
      return res.status(501).json({
        message: "Email or password fields is incorrect",
      });
    }
    cookieToken(user, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
