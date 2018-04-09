var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

mongoose.connect("mongodb://test:dummy@ds235418.mlab.com:35418/myspace");

const userSchema = new Schema ({
  fname: {
    type: String,
    required: [true, "He with no name, has escaped the grid. We require a first name."]
  },
  lname: {
    type: String,
    required: [true, "He with no name, has escaped the grid. We require a last name."]
  },
  email: {
    type: String,
    required: [true, "Please provide an email."]
  },
  encrypted_password: {
    type: String,
    required: [true, "You must provide a password."]
  }
});

userSchema.methods.setPassword = function (plainPassword, callback) {
  var user = this;
  bcrypt.hash(plainPassword, 12).then(function (hash) {
    user.encrypted_password = hash;
    callback();
  });
};

userSchema.methods.verifyPassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.encrypted_password).then(function (valid) {
    callback(valid);
  });
};

userSchema.methods.simpleUser = function () {
  return {
    id: this._id,
    fname: this.fname,
    lname: this.lname,
    email: this.email
  }
}

var User = mongoose.model("User", userSchema);

module.exports = { User: User };
