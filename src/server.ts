import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import router from "./routes";
import prisma from "../prisma";
dotenv.config();
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Middleware
app.use(cookieParser());

async function main() {
  // Connect the client
  await prisma.$connect();
}

main().then(() => {
  console.log("db connected")
})
.catch(async (e) => {
  console.error(e);

  await prisma.$disconnect();

  process.exit(1);
});

app.use("/api", router);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on PORT", process.env.PORT);
});
