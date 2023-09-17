import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "backend/utils/prisma";
import { signJWT } from "backend/utils/jwt";
import { generateUuid } from "backend/utils/uuid";

const authRouter = Router();

authRouter.get("/login", async (req, res) => {
  const { email, password }: { email: string | null; password: string | null } =
    req.body;

  if (!email || !password)
    return res.status(400).send({ error: "Missing fields" });

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) return res.status(400).send({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).send({ error: "Incorrect password" });

  res.status(200).send({
    user,
    token: signJWT({
      id: user.id,
    }),
  });
});

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (
    !name ||
    typeof name !== "string" ||
    !email ||
    typeof email !== "string" ||
    !password
  ) {
    res.status(400).send("Missing fields");
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    res.status(400).send({ error: "User already exists" });
    return;
  }

  const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));

  await prisma.user.create({
    data: {
      id: generateUuid(),
      name,
      email,
      password: hash,
    },
  });

  res.status(200).send({ message: "User successfully registered." });
});

export default authRouter;
