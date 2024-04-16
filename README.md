# Social Media

## Endpoints

- /login
  - POST / sign in with your account -> data { email, password } (this reoute requires credentials from sent in request)

- /users
  - GET / get all users in social media website (this reoute requires credentials from sent in request)

  - POST / add new user to social media website (register) -> body { { 
      first_name,
      last_name,
      username,
      email,
      password,
      dob,
      phone,
      confirm_password
      avatar_url? (question mark ? means this field is optional)
    }

  - PUT /:id update user information using its id inclduing avatar_url -> data { first_name
      last_name
      username
      dob
      phone 
    } (this reoute requires credentials sent in request)

  - DELETE /:id delete user from website using its id (this reoute requires credentials from sent in request)

  - GET /:id get single user using its id

- /logout
  - GET / sign out with your account (this route requires credentials from sent in request)

- /posts
  - GET / get all posts from website backend
  - POST / add new post to the website data -> { created_by: number, content: string, images: array } (this route requires credentials from sent in request)
  
  - GET /:id Get single post from database whose id = :id
  - PUT /:id Edit single post on database whose id = :id -> data {
    content?: string,
    images?: array
  }
  - DELETE /:id Delete Post from database whose id = :id

  - POST /:id/like like post whose id = :id if not liked or dislike if already liked -> { total_likes: number }

  - POST /:id/save save post whose id = :id if not saved or remove from saved if already saved

  - POST /:id/share share post whose id = :id

  - POST /:id/comment add comment to post whose id = :id -> {
    content: string, 
    parent_id: number
    }

  - DELETE /:id/comment/:comment_id delete comment whose id = :comment_id

  - PUT /:id/comment/:comment_id update comment whose id = :comment_id -> { content: string }