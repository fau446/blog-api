const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

router.get("/posts", postController.posts);

router.get("/posts/:id", postController.post_detail);

router.post("/posts/:id", commentController.add_comment);

module.exports = router;
