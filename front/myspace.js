var fetchPosts = function () {
     return fetch('https://gentle-meadow-22559.herokuapp.com/posts').then(function (response) {
          return response.json();
     });
};

var fetchComments = function () {
     return fetch('https://gentle-meadow-22559.herokuapp.com/comments').then(function (response) {
          return response.json();
     });
};

var fetchUsers = function () {
     return fetch('https://gentle-meadow-22559.herokuapp.com/users').then(function (response) {
          return response.json();
     });
};

const app = new Vue({
  el: "#app",
  data: {
    users: [],
      posts: [],
    comments: [],
    newUser: {
      name: "",
      body: "",
    },
    newPost: {
      body: ""
    },
    newComment: {
      body: ""
    }
  },
  methods: {
    createPost: function () {
      if (!this.newPost.body) {
        alert("Post cannot be empty!")
        return
      } else{
        sendData(this.newPost);
        this.newPost.body = "";
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
      // post.editing = !post.editing;
      app.posts.forEach((i, x) => {
        if(i._id == post._id){
          console.log("posts old", app.posts[x], post)
          app.posts[x]= post;
          console.log("posts new", app.posts[x], post)
        }
      })
      // app.posts._id[post._id]
      // console.log(post);
      // console.log(post.editing)
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
    }
  },
  created: function () {
    fetchPosts().then(function (data) {
      app.posts = data;
    });
    fetchComments().then(function (comments) {
      app.comments = comments;
    });
    fetchUsers().then(function (users) {
      app.users = users;
    });
  }
});

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
  fetch('https://gentle-meadow-22559.herokuapp.com/posts', {
    body: encodedBody,
    method: 'POST',
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
  fetch('https://gentle-meadow-22559.herokuapp.com/comments', {
    body: encodedBody,
    method: 'POST',
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
  fetch('https://gentle-meadow-22559.herokuapp.com/posts/'+ id, {
    method: 'DELETE',
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
  fetch('https://gentle-meadow-22559.herokuapp.com/comments/'+ id, {
    method: 'DELETE',
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
  fetch('https://gentle-meadow-22559.herokuapp.com/posts/' + id, {
    body: encodedBody,
    method: 'PUT',
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
  fetch('https://gentle-meadow-22559.herokuapp.com/posts/' + id, {
    body: encodedBody,
    method: 'PUT',
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
  fetch('https://gentle-meadow-22559.herokuapp.com/comments/' + id, {
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
  fetch('https://gentle-meadow-22559.herokuapp.com/comments/' + id, {
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
