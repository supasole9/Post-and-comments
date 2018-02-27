const express = require("express");
const bodyParser = require("body-parser");

var userModel = require("./model/user");
var postModel = require("./model/post");
var commentModel = require("./model/comment");

const app = express();

app.use(bodyParser.urlencoded( { extended : false } ));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.get("/posts", function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  postModel.Post.find().then(function (posts) {
   res.json(posts);
 })
});

app.get("/comments", function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  commentModel.Comment.find().then(function (posts) {
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
  var post = new postModel.Post ({
    belongs_to: 1,
    body: req.body.postBody
  });
  post.save().then(function () {
    res.set('Access-Control-Allow-Origin', '*');
    res.status(201).json(post);
  })
});

app.delete("/posts/:postId", function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  postModel.Post.remove({_id: req.params.postId}, function(err) {
    console.log("error here")
  }).then(function () {
    res.sendStatus(204);
  })
});

app.delete("/comments/:commentId", function (req, res) {
  commentModel.Comment.remove({_id: req.params.commentId}, function(err) {
    console.log("error here")
  }).then(function () {
    res.set('Access-Control-Allow-Origin', '*');
    res.sendStatus(204);
  })
});

app.put("/comments/:commentId", function (req, res) {
  commentModel.Comment.findById({ _id: req.params.commentId}, function(err, Comment) {
    Comment.body = req.body.commentBody;
    Comment.save()
  }).then(function (Comment) {
    res.set('Access-Control-Allow-Origin', '*');
    res.status(201).json(Comment);
  })
});

app.put("/posts/:postId", function (req, res) {
  console.log(req.body);
  res.set('Access-Control-Allow-Origin', '*');
  postModel.Post.findById({ _id: req.params.postId}, function(err, Post) {
    Post.body = req.body.postBody;
    Post.save()
  }).then(function (Post) {
    res.status(200).json(Post);
  })
});

app.listen(8080, function () {
     console.log("Server is ready and listening");
});
