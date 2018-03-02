var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://test:dummy@ds235418.mlab.com:35418/myspace");

const commentSchema = new Schema ({
  belongs_to: {
    type: String,
    required: true
  },
  post_id: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: [true, "Body Text is required!" ]
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

var Comment = mongoose.model("Comments", commentSchema);

module.exports = { Comment: Comment };
