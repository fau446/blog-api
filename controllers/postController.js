require("dotenv").config();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const Post = require("../models/post");
const Comment = require("../models/comment");

const asyncHandler = require("express-async-handler");

exports.posts = asyncHandler(async (req, res, next) => {
  // only return posts that are published
  const posts = await Post.find({ published: true })
    .select({ title: 1, published: 1, date_posted: 1 })
    .sort({ date_posted: 1 })
    .exec();

  res.json({
    posts,
  });
});

exports.post_detail = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("comments").exec();

  if (post === null) {
    const err = new Error("Post not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    post,
  });
});

exports.all_posts = asyncHandler(async (req, res, next) => {
  verifyToken(req, res, () => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      }
    });
  });

  // fetch all posts
  const posts = await Post.find()
    .select({ title: 1, published: 1, date_posted: 1 })
    .sort({ date_posted: 1 })
    .exec();

  res.status(200).json({
    posts,
  });
});

exports.create_post = [
  // sanitize
  body("title", "Title cannot be blank!").trim().isLength({ min: 1 }).escape(),
  body("content", "Content cannot be blank!")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    verifyToken(req, res, () => {
      jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        }
      });
    });

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      comments: [],
      published: req.body.published,
    });

    await post.save();

    res.status(200);
  }),
];

exports.delete_post = asyncHandler(async (req, res, next) => {
  verifyToken(req, res, () => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      }
    });
  });

  const post = await Post.findById(req.params.id);

  await Comment.deleteMany({ _id: { $in: post.comments } });

  // Delete the post itself
  await Post.deleteOne({ _id: req.params.id });

  res.status(200).json({
    message: "Post has been deleted!",
  });
});

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
