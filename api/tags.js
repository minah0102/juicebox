const express = require('express');
const tagsRouter = express.Router();

const { getAllTags, getPostById, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags
  });
});


tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const { tagName } = req.params;
  // read the tagname from the params
  try {
    const tagname = await getPostsByTagName(tagName);

    const tagnames = tagname.filter(post => {
      if (post.active) {
        return true;
      }

      // the post is not active, but it belogs to the current user
      if (req.user && post.author.id === req.user.id) {
        return true;
      }

      // none of the above are true
      return false;
    })
    res.send({ tagnames })
    // use our method to get posts by tag name from the db
    // send out an object to the client { posts: // the posts }
  } catch ({ name, message }) {
    next({ name, message });
    // forward the name and message to the error handler
  }
});

module.exports = tagsRouter;