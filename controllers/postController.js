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
