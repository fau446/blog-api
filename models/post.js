const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date_posted: { type: Date, default: Date.now },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  published: { type: Boolean, required: true },
});

PostSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.date_posted).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model("Post", PostSchema);
