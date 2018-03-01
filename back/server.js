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
  postModel.Post.find().then(function (posts) {
   res.json(posts);
 })
});

app.get("/comments", function (req, res) {
  commentModel.Comment.find().then(function (posts) {
   res.json(posts);
 })
});

app.post("/users", function(req, res) {
  var user = new userModel.User ({
    fname: req.body.fname,
    lname: req.body.lname
  });
  user.save().then(function () {
    res.status(201).json(user);
  })
});

app.post("/comments", function(req, res) {
  var comment = new commentModel.Comment ({
    belongs_to: "1",
    post_id: req.body.post_id,
    body: req.body.commentBody,
    created: req.body.created
  });
  comment.save().then(function () {
    res.status(201).json(comment);
  })
});

app.post("/posts", function(req, res) {
  var post = new postModel.Post ({
    belongs_to: 1,
    body: req.body.postBody,
    created: req.body.created
  });
  post.save().then(function () {
    res.status(201).json(post);
  })
});

app.delete("/posts/:postId", function (req, res) {
  postModel.Post.remove({_id: req.params.postId}, function(err) {
    if (err) {
      console.log("error here: Deleting comment")
      res.sendStatus(500).json("Error Deleting Comment");
    }
  }).then(function () {
    res.sendStatus(204);
  })
});

app.delete("/comments/:commentId", function (req, res) {
  commentModel.Comment.remove({_id: req.params.commentId}, function(err) {
    if (err) {
      console.log("error here: Deleting comment")
      res.sendStatus(404).json("Error Deleting Comment");
    }
  }).then(function () {
    res.sendStatus(204);
  })
});

app.put("/comments/:commentId", function (req, res) {
  commentModel.Comment.findById({ _id: req.params.commentId}, function(err, Comment) {
    if (err) {
      console.log ("error PUTTING comments");
      res.sendStatus(404).json("error PUTTING comments");
    } else {
      Comment.body = req.body.commentBody;
      Comment.save()
    }
  }).then(function (Comment) {
    res.status(202).json(Comment);
  })
});

app.put("/posts/:postId", function (req, res) {
  postModel.Post.findById({ _id: req.params.postId}, function(err, Post) {
    if (err) {
      console.log ("error PUTTING posts");
      res.sendStatus(404).json("error PUTTING posts");
    } else {
      if (req.body.like) {
        Post.likes += 1;
        Post.save()
        res.status(202).json(Post);
      } else if (req.body.dislike) {
        Post.dislikes += 1;
        Post.save()
        res.status(202).json(Post);
      } else {
        console.log ("can't add like or dislike");
        res.sendStatus(404).json("Cant Add like or dislike");
      }
    }
  })
});

app.listen(8080, function () {
     console.log("Server is ready and listening");
});
