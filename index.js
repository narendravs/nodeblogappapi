import express from "express";
import postRouter from "./roots/posts.js";
import authRouter from "./roots/Auth.js";
import userRouter from "./roots/users.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../blogapp/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/user", userRouter);

app.listen(8000, () => {
  console.log("API Server Connected...");
});
