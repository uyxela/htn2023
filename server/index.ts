import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 9000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/test", (_req: Request, res: Response) => {
  res.send(prisma.user.findMany());
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
