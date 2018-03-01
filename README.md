# Midterm Project <h1>
# Posts and Comments <h2>

# Facebook 1.0 <h3>
The purpose of this project was to challenge myself to play with relational data concepts/structures. Using Vuejs, Node(Express), Mongoose(Mongodb) to complete a full-stack app. Resources are *Posts* and *Comments*. At the moment, you are allowed to create posts and respond to each post using comments.

* post
    * belongs_to (which user created this comment) *required*
    * body *required*
    * created *required*
    * likes 
    * dislikes

* comment
    * belongs_to (which user created this comment) *required*
    * post_id (which post does this belong to) *required*
    * body *required*
    * created *required*
    * likes
    * dislikes

* user
    * fname
    * lname

METHOD | PATH | Name
------ | ------- | --------
GET | /posts | List posts
GET | /comments | List comments
GET | /users | List users
POST | /posts | Creates new post
POST | /comments | Create new comment
POST | /users | Create new user
DELETE | /posts/:id | Deletes a post
DELETE | /comments/:id | Deletes a comment
PUT | /posts/:id | Updates post
PUT | /comments/:id | Updates comment
