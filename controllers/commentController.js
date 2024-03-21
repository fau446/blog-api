const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");

const asyncHandler = require("express-async-handler");

exports.add_comment = [
  body("message", "Your comment cannot be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("name").trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const post = await Post.findById(req.params.id).exec();
      let name;

      if (post === null) {
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }

      if (req.body.name === "") {
        name = "Anonymous";
      } else {
        name = req.body.name;
      }

      const commentDetails = {
        post: req.params.id,
        name,
        message: req.body.message,
      };

      const newComment = new Comment(commentDetails);
      await newComment.save();

      // Update post's comment array with the new comment
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: newComment } }
      );

      res.status(200).json({ message: "Comment saved", newComment });
    } catch (err) {
      res.status(400).json({
        err,
      });
    }
  },
];
