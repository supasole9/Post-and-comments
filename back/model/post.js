var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://test:dummy@ds235418.mlab.com:35418/myspace");

const postSchema = new Schema ({
  belongs_to: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: [true, "Body text is required"]
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  created: {
    type: String,
    required: true
  }
});

var Post = mongoose.model("Posts", postSchema)

module.exports = { Post: Post };
