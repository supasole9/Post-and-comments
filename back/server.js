const express = require("express");
const bodyParser = require("body-parser");

var userModel = require("./model/user");
var postModel = require("./model/post");
var commentModel = require("./model/comment");

const app = express();

app.use(bodyParser.urlencoded( { extended : false } ));

app.get("/posts", function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  postModel.Post.find().then(function (posts) {
   res.set('Access-Control-Allow-Origin', '*');
   res.json(posts);
 })
});

app.get("/comments", function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  commentModel.Comment.find().then(function (posts) {
   res.set('Access-Control-Allow-Origin', '*');
   res.json(posts);
 })
});

app.post("/users", function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  var user = new userModel.User ({
    fname: req.body.fname,
    lname: req.body.lname
  });
  user.save().then(function () {
    res.status(201).json(user);
  })
});

app.post("/comments", function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  console.log(req.body.post_id, req.body.commentBody)
  var comment = new commentModel.Comment ({
    belongs_to: "1",
    post_id: req.body.post_id,
    body: req.body.commentBody
  });
  comment.save().then(function () {
    res.status(201).json(comment);
  })
});

app.post("/posts", function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  var post = new postModel.Post ({
    belongs_to: 1,
    body: req.body.postBody
  });
  post.save().then(function () {
    res.status(201).json(post);
  })
});

app.listen(8080, function () {
     console.log("Server is ready and listening");
});
