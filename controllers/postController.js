require("dotenv").config();
const jwt = require("jsonwebtoken");

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
