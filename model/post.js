var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://test:dummy@ds235418.mlab.com:35418/myspace");

const postSchema = new Schema ({
  belongs_to: {
    type: String,
    required: [true, "Everything that is said can and will be used against you. A used id is required"]
  },
  body: {
    type: String,
    required: [true, "Body text is required because no one cannot not say nothing"]
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
    required: [true, "a Date is required. We will clone you and your habits, then fire your from your job because you created what will replace you. Thank you."]
  }
});

var Post = mongoose.model("Posts", postSchema)

module.exports = { Post: Post };
