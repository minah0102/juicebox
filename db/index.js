const { Client } = require('pg');

const client = new Client('postgres://postgres:password@localhost:5432/juicebox-dev');

async function createUser({
    id,
    username,
    password,
    name,
    location }) {
    try {
        const { rows } = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [id, username, password, name, location]);

        return rows;
    } catch (error) {
        throw error;
    }
}

async function createPost({
    authorId,
    title,
    content
}) {
    try {
        const { rows } = await client.query(`
        INSERT INTO users(authorId, title, content)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [authorId, title, content]);

        return rows;

    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    const { rows } = await client.query(`
    SELECT id, username, name, location, active
    FROM users;
    `);

    return rows;
}

async function getAllPosts() {
    try {
        const { rows } = await client.query(`
        SELECT title, content, active
        FROM users;
        `)

    } catch (error) {
        throw error;
    }
}

async function getPostsByUser(userId) {
    try {
        const { rows } = client.query(`
        SELECT * FROM posts
        WHERE "authorId"=${userId};
      `);

        return rows;
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [user] } = await client.query(`
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

        // SET ${ setString }
        // WHERE id=${ id }

        return user;
    } catch (error) {
        throw error;
    }
}
// SET "name"='new name', "location"='new location'
//         WHERE id=2;

async function updatePost(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ post ] } = await client.query(`
        UPDATE posts
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return post;
    } catch (error) {
      throw error;
    }
  }
  
module.exports = {  
        client,
        createUser,
        updateUser,
        getAllUsers,
        createPost,
        updatePost,
        getAllPosts,
        getPostsByUser
      }