const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  name: { type: String, default: "Anonymous" },
  message: { type: String, required: true },
  date_posted: { type: Date, default: Date.now },
});

CommentSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.date_posted).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model("Comment", CommentSchema);
