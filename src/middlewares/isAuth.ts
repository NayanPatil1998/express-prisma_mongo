import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import prisma from "../../prisma";

export const isAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Not Authenticated",
      });
    }

    const decoded = verify(token, process.env.JWT_SECRET);

    res.locals.user = await prisma.user.findUniqueOrThrow({
      // @ts-ignore
      where: { id: decoded.userId },
    });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
