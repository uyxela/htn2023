import express from "express";
import { verifyJWT } from "utils/jwt";
import prisma from "utils/prisma";

export const tokenAuthenticator = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers["Authorization"] as string;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send({ error: "Unauthorized" });

  const decodedToken = verifyJWT(token) as { _id: string };

  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken._id,
    },
  });

  if (!user) return res.status(400).send({ error: "User not found" });

  req.user = user;

  next();
};

export const logger = (
  req: express.Request,
  _: express.Response,
  next: express.NextFunction
) => {
  console.log(`${req.method} ${req.path}`);
  next();
};
