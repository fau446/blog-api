const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

router.get("/posts", postController.posts);

router.get("/posts/:id", postController.post_detail);

module.exports = router;
