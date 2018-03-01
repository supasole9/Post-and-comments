var fetchPosts = function () {
     return fetch('http://localhost:8080/posts').then(function (response) {
          return response.json();
     });
};

var fetchComments = function () {
     return fetch('http://localhost:8080/comments').then(function (response) {
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
      } else{
        sendData(this.newPost);
        this.newPost = "";
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
      deletePost(post._id);
    },
    delComment: function (comment) {
      deleteComment(comment._id)
    },
    toggleEdit: function (post) {
      if (post.editing) {
        post.editing = false;
      } else {
        post.editing = true;
      }
      // post.editing = !post.editing;
      console.log(post)
      // this.editing = !this.editing;
      // console.log(this.editing)
    },
    addLike: function (post) {
      // newLike(post._id)
      postDate();
    },
    addDislike: function (post) {
      newDislike(post._id)
    }
  },
  created: function () {
    fetchPosts().then(function (data) {
      app.posts = data;
    });
    fetchComments().then(function (comments) {
      app.comments = comments;
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

    return monthNames[monthIndex] + ' ' + day  ;
};


var sendData = function (postBody) {
  console.log("Creating Post");
  var encodedBody = 'postBody=' + postBody.body + "&created=" + formatDate(new Date());;
  fetch('http://localhost:8080/posts', {
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
  fetch('http://localhost:8080/comments', {
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
  fetch('http://localhost:8080/posts/'+ id, {
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
  fetch('http://localhost:8080/comments/'+ id, {
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

var newLike = function (id) {
  var encodedBody = 'like=' + "like";
  fetch('http://localhost:8080/posts/' + id, {
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

var newDislike = function (id) {
  var encodedBody = 'dislike=' + "dislike";
  fetch('http://localhost:8080/posts/' + id, {
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
