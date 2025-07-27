import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import productRouter from "./routes/product";
import orderRouter from "./routes/order";
import { requestLogger, errorLogger } from "./middlewares/logger";
import { errors } from 'celebrate';
import { errorHandler } from './middlewares/error-handler';

const {
  PORT = 3000,
  DB_ADDRESS = "mongodb://127.0.0.1:27017/weblarek",
} = process.env;

const app = express();

mongoose.connect(DB_ADDRESS);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(requestLogger);

app.use(productRouter);

app.use(orderRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
