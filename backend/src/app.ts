import express from "express";
import cors from "cors";
import mongoose from 'mongoose';

const { PORT = 3000, DB_ADDRESS='mongodb://127.0.0.1:27017/weblarek', UPLOAD_PATH, UPLOAD_PATH_TEMP } = process.env;

const app = express();

const db=mongoose.connect(DB_ADDRESS);

app.use(cors());

app.get("/product", (req, res) => {
  res.send([]);
});

app.listen(PORT, () => {
  console.log("listening on port 3000");
});
