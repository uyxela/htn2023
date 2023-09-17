import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { logger } from "./middleware";
import authRouter from "./routers/auth";
import extensionRouter from "./routers/extension";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/auth", authRouter);
app.use("/extension", extensionRouter);

const port = process.env.PORT ?? 9000;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
