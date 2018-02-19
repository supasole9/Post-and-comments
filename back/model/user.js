var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://test:dummy@ds235418.mlab.com:35418/myspace");

const userSchema = new Schema ({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  }
});

var User = mongoose.model("Users", userSchema);

module.exports = { User: User };
