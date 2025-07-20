import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/product';

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek', UPLOAD_PATH, UPLOAD_PATH_TEMP } = process.env;

const app = express();

mongoose.connect(DB_ADDRESS);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(productRouter);

app.listen(PORT, () => {
  console.log("listening on port 3000");
});
