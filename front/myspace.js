const urlstuff = "http://localhost:8080";
// https://gentle-meadow-22559.herokuapp.com

var fetchPosts = function () {
     return fetch(urlstuff + '/posts').then(function (response) {
          return response.json();
     });
};

var fetchComments = function () {
     return fetch(urlstuff + '/comments').then(function (response) {
          return response.json();
     });
};

var fetchUser = function () {
     return fetch(urlstuff + '/me', {
       method: "GET",
       credentials: "include"
     }).then(function (response) {
          return response.json();
     });
};

var userLogout = function () {
  fetch(urlstuff + '/session', {
    method: 'DELETE',
    credentials: 'include'
  });
};

const app = new Vue({
  el: "#app",
  data: {
    loggedIn: false,
    user: {
      email: "",
      password: ""
    },
      posts: [],
    comments: [],
    newUser: {
      fname: "",
      lname: "",
      email: "",
      password: ""
    },
    newPost: {
      body: ""
    },
    newComment: {
      body: ""
    },
    signInError: false,
    postError: false
  },
  methods: {
    createPost: function () {
      if (!this.newPost.body) {
        this.postError = true;
        return
      } else{
        sendData(this.newPost);
        this.newPost.body = "";
        this.postError = false;
      }
    },
    createComment: function (post) {
      if (!post.newComment) {
        alert("Comment cannot be empty!")
      } else {
        sendComment(post._id, post.newComment);
        post.newComment = "";
      }
    },
    delPost: function (post) {
      if (confirm ("Are you sure you want to delete this post?")) {
        deletePost(post._id);
      } else {
        return
      }
    },
    delComment: function (comment) {
      if (confirm ("Are you sure you want to delete this comment?")) {
        deleteComment(comment._id);
      } else {
        return
      }
    },
    toggleEdit: function (post) {
      if (!post.editing) {
        post.editing = true;
      } else {
        post.editing = false;
      }
      app.posts.forEach((i, x) => {
        if(i._id == post._id){
          console.log("posts old", app.posts[x], post)
          app.posts[x]= post;
          console.log("posts new", app.posts[x], post)
        }
      })
    },
    addPostLike: function (post) {
        newPostLike(post._id)
    },
    addPostDislike: function (post) {
      newPostDislike(post._id)
    },
    addCommentLike: function (comment) {
        newCommentLike(comment._id)
    },
    addCommentDislike: function (comment) {
      newCommentDislike(comment._id)
    },
    logIn: function () {
      userLogIn(this.user);
    },
    signUp: function () {
      newsignUp(this.newUser);
    },
    logout: function () {
      userLogout();
      this.loggedIn = false;
      this.user = {};
    }
  },
  created: function () {
    fetchPosts().then(function (data) {
      app.posts = data;
    });
    fetchComments().then(function (comments) {
      app.comments = comments;
    });
    fetchUser().then(function (user) {
      if (user) {
        app.user = user;
        app.loggedIn = true;
      } else {
        app.user = user;
        app.loggedIn = true;
      }
    })
  }
});

var userLogIn = function (user) {
  var encodedBody = "email=" + user.email + "&password=" + user.password;
  fetch( urlstuff + "/session" , {
    body: encodedBody,
    method: "POST",
    credentials: "include",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }).then (function (res) {
    if (res.status == 201) {
      fetchUser().then(function (user) {
        if (user) {
          app.user = user;
          app.loggedIn = true;
        } else {
          app.loggedIn = false;
          console.log("Error logging in");
        }
      });
    } else {
      app.signInError = true;
      app.loggedIn = false;
      console.log("Error logging in");
    }
  })
};

var newsignUp = function (newUser) {
  var encodedBody = "email=" + newUser.email + "&password=" + newUser.password + "&fname=" + newUser.fname + "&lname=" + newUser.lname;
  fetch( urlstuff + "/users" , {
    body: encodedBody,
    method: "POST",
    credentials: "include",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }).then (function (res) {
    if (res.status == 201) {
      userLogIn(newUser)
        } else {
          app.loggedIn = false;
          console.log("Error logging in");
        }
    });
};

var formatDate = function (date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

    var day = date.getDate();
    var monthIndex = date.getMonth();

    return monthNames[monthIndex] + ' ' + day;
};


var sendData = function (postBody) {
  console.log("Creating Post");
  var encodedBody = 'postBody=' + postBody.body + "&created=" + formatDate(new Date());;
  fetch(urlstuff + '/posts', {
    body: encodedBody,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (response) {
    if (response.status == 201) {
        response.json().then(function (data) {
          app.posts.push(data)
        });
    } else {
      console.log ("Error Code:", response.status);
    };
  })
};

var sendComment = function (id, commentBody) {
  console.log("creating comment");
  var encodedBody = 'commentBody=' + commentBody + '&post_id=' + id + "&created=" + formatDate(new Date());
  fetch(urlstuff + '/comments', {
    body: encodedBody,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (response) {
    if (response.status == 201) {
        response.json().then(function (data) {
          app.comments.push(data)
        });
    } else {
      console.log ("Error Code:", response.status);
    };
  }).then(fetchComments().then(function (data) {
    app.comments = data
  }));
};

var deletePost = function (id) {
  fetch(urlstuff + '/posts/'+ id, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (response) {
    if (response.status == 204) {
      fetchPosts().then(function (data) {
        app.posts = data;
      })
    } else {
      console.log ("Error Code:", response.status);
    };
  })
};

var deleteComment = function (id) {
  fetch(urlstuff + '/comments/'+ id, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (response) {
    if (response.status == 204) {
      fetchComments().then(function (data) {
        app.comments = data;
      })
    } else {
      console.log ("Error Code:", response.status);
    };
  })
}

var newPostLike = function (id) {
  var encodedBody = 'like=' + "like";
  fetch(urlstuff + '/posts/' + id, {
    body: encodedBody,
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (response) {
    if (response.status == 202) {
      fetchPosts().then(function (data) {
        app.posts = data;
      });
    } else {
      console.log ("Error Code:", response.status);
    };
  })
};

var newPostDislike = function (id) {
  var encodedBody = 'dislike=' + "dislike";
  fetch(urlstuff + '/posts/' + id, {
    body: encodedBody,
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (response) {
    if (response.status == 202) {
      fetchPosts().then(function (data) {
        app.posts = data;
      });
    } else {
      console.log ("Error Code:", response.status);
    };
  })
};

var newCommentLike = function (id) {
  var encodedBody = 'like=' + "like";
  fetch(urlstuff + '/comments/' + id, {
    body: encodedBody,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (response) {
    if (response.status == 202) {
      fetchComments().then(function (data) {
        app.comments = data;
      });
    } else {
      console.log ("Error Code:", response.status);
    };
  })
};

var newCommentDislike = function (id) {
  var encodedBody = 'dislike=' + "dislike";
  fetch(urlstuff + '/comments/' + id, {
    body: encodedBody,
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (response) {
    if (response.status == 202) {
      fetchComments().then(function (data) {
        app.comments = data;
      });
    } else {
      console.log ("Error Code:", response.status);
    };
  })
};
