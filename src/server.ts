import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from 'cookie-parser'

dotenv.config();
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Middleware
app.use(cookieParser())


// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on PORT ", process.env.PORT);
});
