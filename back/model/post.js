var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://test:dummy@ds235418.mlab.com:35418/myspace");

const postSchema = new Schema ({
  belongs_to: {
    type: Number,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

var Post = mongoose.model("Posts", postSchema)

module.exports = { Post: Post };
