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
      sendData(this.newPost);
      this.newPost = "";
    },
    createComment: function (post) {
      sendComment(post._id, post.newComment);
      post.newComment = "";
    },
    delPost: function (post) {
      // deletePost(post._id);
      console.log(post._id)
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

var sendData = function (postBody) {
  console.log("Creating Post");
  var encodedBody = 'postBody=' + postBody.body;
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
  var encodedBody = 'commentBody=' + commentBody + '&post_id=' + id;
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
}
