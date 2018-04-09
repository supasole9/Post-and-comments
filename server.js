const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local");

var userModel = require("./model/user");
var postModel = require("./model/post");
var commentModel = require("./model/comment");

const app = express();

// app.set('port', (process.env.PORT || 8080));

app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json())
app.use(express.static("front"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});
app.use(session({secret: "deezBIGnuts", resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(
  {usernameField: 'email'},
  function (email, password, done) {
  userModel.User.findOne({ email:email }).then(function (user) {
    if (!user) {
      return done(null, false)
    }
    user.verifyPassword(password, function (valid) {
      if (valid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }, function (err) {
    return done(err)
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id)
});

passport.deserializeUser(function(id, done) {
  userModel.User.findOne({ _id:id }).then(function(user) {
    done(null, user);
  }, function (err) {
    done(err);
  });
})

app.post("/session", passport.authenticate("local"), function (req,res) {
  res.sendStatus(201);
});

app.get("/me", function(req, res) {
  if (req.user) {
    res.json(req.user.simpleUser())
  } else {
    res.sendStatus(401);
  }
});

app.delete("/session", function (req,res) {
  req.logout();
  res.sendStatus(200);
})

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
  console.log(req.body.password)
  var user = new userModel.User ({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email
  });
  user.setPassword(req.body.password, function () {
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
        console.log("Post /User - Internal Error")
        res.sendStatus(500)
      }
    });
  });
});

app.post("/comments", function(req, res) {
  var comment = new commentModel.Comment ({
    belongs_to: req.user.id,
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
    belongs_to: req.user.id,
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

// app.listen(app.get('port'), function () {
//      console.log("Server is ready and listening");
// });

app.listen(8080, function () {
     console.log("Server is ready and listening");
});
