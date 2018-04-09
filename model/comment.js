var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://test:dummy@ds235418.mlab.com:35418/myspace");

const commentSchema = new Schema ({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // required: [true, "Everything that is said can and will be used against you. A used id is required"]
  },
  post_id: {
    type: String,
    required: [true, "This comment obviously belongs to a post. Now which post we don't know becuase you didn't provide the post id. TLDR: Post id is required"]
  },
  body: {
    type: String,
    required: [true, "Body Text is required because what is an empty thought?" ]
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
    required: [true, "a Date is required, so we can track your habits"]
  }
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment: Comment };
