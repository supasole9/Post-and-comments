const express = require("express");
const bodyParser = require("body-parser");

var userModel = require("./model/user");
var postModel = require("./model/post");
var commentModel = require("./model/comment");

const app = express();

app.set('port', (process.env.PORT || 8080));

app.use(bodyParser.urlencoded( { extended : false } ));
app.use(express.static("front"));

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

app.get("/users", function (req, res) {
  userModel.User.find().then(function (users) {
   res.json(users);
 })
});

app.post("/users", function(req, res) {
  var user = new userModel.User ({
    fname: req.body.fname,
    lname: req.body.lname
  });
  user.save().then(function () {
    res.status(201).json(user);
  }, function (err) {
    if (err.errors) {
      var messages = {}
      for (var e in err.errors) {
        messages[e] = err.errors[e].message;
      }
      res.status(422).json(messages);
    }
    else {
      res.sendStatus(500)
    }
  })
});

app.post("/comments", function(req, res) {
  var comment = new commentModel.Comment ({
    belongs_to: "5a97700d470a8a1aa589e0ce",
    post_id: req.body.post_id,
    body: req.body.commentBody,
    created: req.body.created
  });
  comment.save().then(function () {
    res.status(201).json(comment);
  }, function (err) {
    if (err.errors) {
      var messages = {}
      for (var e in err.errors) {
        messages[e] = err.errors[e].message;
      }
      res.status(422).json(messages);
    }
    else {
      res.sendStatus(500)
    }
  })
});

app.post("/posts", function(req, res) {
  var post = new postModel.Post ({
    belongs_to: "5a97700d470a8a1aa589e0ce",
    body: req.body.postBody,
    created: req.body.created
  });
  post.save().then(function () {
    res.status(201).json(post);
  }, function (err) {
    if (err.errors) {
      var messages = {}
      for (var e in err.errors) {
        messages[e] = err.errors[e].message;
      }
      res.status(422).json(messages);
    }
    else {
      res.sendStatus(500)
    }
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
      console.log ("error PUTTING posts");
      res.sendStatus(404).json("error PUTTING posts");
    } else {
      if (req.body.like) {
        Comment.likes += 1;
        Comment.save()
        res.status(202).json(Comment);
      } else if (req.body.dislike) {
        Comment.dislikes += 1;
        Comment.save()
        res.status(202).json(Comment);
      } else {
        console.log ("can't add like or dislike");
        res.sendStatus(404).json("Cant Add like or dislike");
      }
    }
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

app.listen(app.get('port'), function () {
     console.log("Server is ready and listening");
});
