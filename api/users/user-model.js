const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

function findPosts(user_id) {
return db('posts')
.select('contents', 'posts.id as post_id')
.where('user_id', user_id)

// JOIN users ON posts.user_id = users.id
.join('users', 'posts.user_id', 'users.id')
  /*
    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
}

function find() {
  return db('users')
  .leftJoin('posts', 'user_id', 'users.id')
  .groupBy('users.id')
  .count('posts.id as post_count')
  .select('users.id as user_id', 'username')
  
  /*
    Improve so it resolves this structure:

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
}

async function findById(id) {
  // return db('users').where({ id }).first()

  //select * from users
  //left join posts on useres.id = user_id
  //where users.id = id
const result = await db('users')
.leftJoin('posts', 'users.id', 'user_id')
.where('users.id', id)
.select('username', 'users.id as user_id', 'posts.id as post_id', 'contents');

if (result.length === 0) {
return null;
}

const user = {
  username: result[0].username,
  user_id: result[0].user_id,
  posts: []
}

for (const row of result) {
  if(row.post_id != null) {
  user.posts.push({post_id: row.post_id, contents: row.contents })
}}

return user;


  /*
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
