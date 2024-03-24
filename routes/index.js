const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");

router.get("/posts", postController.posts);

router.get("/all-posts", postController.all_posts);

router.get("/posts/:id", postController.post_detail);

router.post("/create-post", postController.create_post);

router.delete("/posts/:id/delete", postController.delete_post);

router.post("/posts/:id", commentController.add_comment);

router.post("/create-user", userController.create_user);

router.post("/login", userController.login);

router.get("/login-failure", (req, res) => {
  res.status(401).json({
    message: "Failed to login",
  });
});

router.get("/logout", userController.logout);

module.exports = router;
