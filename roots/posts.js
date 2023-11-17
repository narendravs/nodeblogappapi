import express from "express";
import { db } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM  posts WHERE cat = ?"
    : "SELECT * FROM posts";
  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

router.get("/:id", (req, res) => {
  const q =
    "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM blogapp.users u JOIN blogapp.posts p ON u.id = p.uid WHERE p.id = ? ";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
});

router.post("/", (req, res) => {
  console.log("in add post method");
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authnticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`title`, `desc`,`img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];
    console.log(values);

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
});

router.put("/:id", (req, res) => {
  console.log("updating the post");
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authnticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    // console.log(postId);
    // console.log(userInfo.id);

    const q =
      "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";

    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];
    console.log(values);
    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
});

router.delete("/:id", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authnticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json("you can delete nonly your post");
      return res.status(200).json("post has been deleted successfully!");
    });
  });
});

export default router;
