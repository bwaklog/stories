import express from "express";
import connect from "../database/connect.mjs";
import { checkSchema, validationResult } from "express-validator";
import schema from "./schema.mjs";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import config from "../config/config.mjs";

const router = express.Router();

router.get("/ping", async (req, resp) => {
  var pong_resp = await connect.attemptPing();
  let collections = connect.db.collection("pings");
  let existingPing = await collections.findOne({ ip: req.ip });
  if (existingPing) {
    await collections.updateOne({ ip: req.ip }, { $inc: { pingCount: 1 } });
  } else {
    await collections.insertOne({ ip: req.ip, pingCount: 1 });
  }
  let updatedPing = await collections.findOne({ ip: req.ip });
  pong_resp == null ?
    resp.status(500).send(`XoX`) :
    // JSON.stringify(updatedPing)
    resp.status(200).send(`${JSON.stringify({
      type: "ping",
      response: "pong",
      pings: updatedPing.pingCount,
      ip: updatedPing.ip,
    })}`);
})

// Authentication

// User registeration
router.post(
  "/register/user",
  checkSchema(schema.newUserSchemaRequest),
  async (req, resp) => {
    /*
        curl --json '{                              \
            "username": "foo",                      \ 
            "password": "f846S@j",                  \
            "email": "foo@gmail.com",               \
        }'                                          \
        -X POST http://localhost:3000/register/user \
    */

    // If invalid schema reject
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      resp.status(400).send({ errors: errors.array() });
      return;
    }

    let user = req.body;
    if (user === null) {
      resp.status(400).send({ error: "Invalid request" });
      return;
    }
    const query = { username: user.username };
    let collections = connect.db.collection("users");
    let result = await collections.findOne(query);

    if (result) {
      resp.status(400).send({
        message: "User already exists",
        user: {
          username: result.username,
        }
      });
      return;
    } else {
      let collections = connect.db.collection("users");
      await collections.insertOne({
        username: user.username,
        email: user.email,
        password: user.password,
        account_info: {
          followers: [],
          following: [],
          stories: []
        }
      });

      let result = await collections.findOne({ username: user.username });
      if (result) {

        // creating a jwt
        var token = jwt.sign({
          _id: result._id,
          username: result.username
        }, config.jwt.jwtSecret);

        resp.status(200).send({
          message: "User created",
          user: {
            jwt: token,
            username: result.username,
            email: result.email
          }
        });
      } else {
        resp.status(500).send({
          message: "User not created"
        });
      }
      return;
    }
  });

router.post("/login", checkSchema(schema.userLoginSchema), async (req, resp) => {
  /*
  curl -X POST http://localhost:3000/login    \
  --json '{                                   \
      "username": "lando",                    \
      "password": "abcdefgh"                  \
  }'
  */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resp.status(400).send({ errors: errors.array() });
    return;
  }

  let user = req.body;
  let collections = connect.db.collection("users");

  let result = await collections.findOne({
    username: user.username,
    password: user.password
  });

  if (result) {
    var token = jwt.sign({
      _id: result._id,
      username: result.username
    }, config.jwt.jwtSecret);
    resp.status(200).send({
      message: "User exists and logging in is allowed",
      user: {
        jwt: token,
        username: result.username,
        email: result.email
      }
    });
    return;
  } else {
    resp.status(404).send({
      message: "User not found"
    });
    return;
  }

});

router.get('/users/', async (req, resp) => {
  let collections = connect.db.collection("users");
  let users = await collections.find().toArray();
  if (users.length === 0) {
    resp.status(404).send({ error: "Users not found" });
  } else {
    // TODO: dont send the passwords :P
    resp.status(200).send(users);
  }
});

router.get("/user/:username", async (req, resp) => {

  let username = req.params.username;

  let collections = connect.db.collection("users");
  let user = await collections.findOne({ username: username });
  if (user) {
    resp.status(200).send({
      username: user.username,
      email: user.email,
      account_info: user.account_info
    });
  } else {
    resp.status(404).send({ error: "Users not found" });
  }
})

router.post("/stories", checkSchema(schema.newStorySchemaRequest), async (req, resp) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resp.status(400).send({ errors: errors.array() });
    return;
  }

  let story = req.body;
  // check if author_id and author match in db
  let collections = connect.db.collection("users");

  // getting _id from jwt
  try {
    var decoded = jwt.verify(story.jwt, config.jwt.jwtSecret);
    var author_id = decoded._id;
    let query = { _id: ObjectId.createFromHexString(author_id) };
    let author = await collections.findOne(query);
    if (!author) {
      resp.status(400).send({ error: "Invalid author_id" });
      return;
    }
    if (author.username !== story.author) {
      resp.status(400).send({ error: "Author name does not match" });
      return;
    }

    // check if co_authors match in db
    if (story.co_authors) {

      // check if co_authors are valid
      for (let co_author of story.co_authors) {
        let query = { username: co_author };
        let co_author_result = await collections.findOne(query);
        if (!co_author_result) {
          resp.status(400).send({
            error: "Invalid co_author",
            co_author: co_author
          });
          return;
        }
      }
    }
  } catch (error) {
    resp.status(400).send({ error: "Invalid JWT" });
    return;
  }

  let story_collection = connect.db.collection("stories");

  // check if an existing story with the same title exists
  let existing_story = await story_collection.findOne({
    "author": story.author,
    "metadata.title": story.title
  });
  if (existing_story) {
    // resp.status(400).send({
    //     error: `Story with same title exists for author ${story.author}`
    // });

    const updated_story = {
      $set: {
        co_authors: story.co_authors,
        metadata: {
          title: story.title,
          tags: story.tags,
          draft: story.draft
        },
        content: story.content
      }
    }

    const filter = { "author": story.author, "metadata.title": story.title };

    let result = await story_collection.updateOne(filter, updated_story);
    if (result) {
      resp.status(200).send({
        message: "Story updated",
        result: result
      });
      return;
    } else {
      resp.status(400).send({ message: "Story not updated, bad request" });
      return;
    }
  }

  // create a story
  let result = await story_collection.insertOne({
    author: story.author,
    co_authors: story.co_authors,
    metadata: {
      title: story.title,
      tags: story.tags,
      draft: story.draft
    },
    content: story.content
  })
  if (result) {
    resp.status(200).send({
      message: "Story created",
      result: result
    });
    return;
  } else {
    resp.status(500).send({ message: "Story not created" });
    return;
  }
})

// Fetch all stories
router.get("/stories", async (req, resp) => {

  /*
      API design
          - Get by query author : /stories?author=authorname
          - Get by query id : /stories?id=storyid
          - Get by query tag : /stories?tag=tagname
  */

  if (req.query.author) {
    let author = req.query.author;
    let collections = connect.db.collection("stories");
    let stories = await collections.find({
      $or: [
        { "author": author }, { "co_authors": author }
      ]
    }).toArray();

    if (stories.length === 0) {
      resp.status(404).send({ error: "Stories not found" });
      return;
    } else {
      let filteredStories = stories.map(story => ({
        id: story.id,
        author: story.author,
        metadata: story.metadata,
        content: story.content
      }));
      resp.status(200).send(filteredStories);
      return;
    }
  }
  if (req.query.id) {
    console.log(req.query.id);
    let id = req.query.id;
    let collections = connect.db.collection("stories");
    if (isNaN(parseInt(id))) {
      resp.status(400).send({ error: "Invalid request" });
      return
    }
    let story = await collections.findOne({ "id": parseInt(id) });
    console.log(story);
    if (story) {
      resp.status(200).send(JSON.stringify({
        id: story.id,
        author: story.author,
        metadata: story.metadata,
        content: story.content
      }));
      return;
    } else {
      resp.status(404).send({ error: "Story not found" });
      return;
    }
  }

  if (req.query.tag) {
    let tag = req.query.tag;
    let collections = connect.db.collection("stories");
    let stories = await collections.find({ "metadata.tags": tag }).toArray();
    if (stories.length === 0) {
      resp.status(404).send({ error: "Stories not found" });
      return;
    }
    let filteredStories = stories.map(story => ({
      id: story.id,
      author: story.author,
      metadata: story.metadata,
      content: story.content
    }));
    resp.status(200).send(filteredStories);
    return;
  }

  let collections = connect.db.collection("stories");
  let stories = await collections.find().toArray();
  console.log(stories);
  if (stories.length === 0) {
    resp.status(404).send({ error: "Stories not found" });
    return;
  } else {
    resp.status(200).send(stories);
  }
})

router.get("/authors", async (req, resp) => {
  let collections = connect.db.collection("users");

})

// Fetch Story with ID
router.get("/stories/id/:id", async (req, resp) => {
  let id = req.params.id;
  if (id === null) {
    resp.status(400).send({ error: "Invalid request" });
    return;
  }
  let collections = connect.db.collection("stories");
  let story = await collections.findOne({ id: id });
  console.log(story);
  resp.send(story);
  // if (stories) {
  //     resp.status(200).send(stories);
  // } else {
  //     resp.status(404).send({ error: "Story not found" });
  // }
});

router.get("/stories/:id/authors", async (req, resp) => {
  let story_id = req.params.id;
  let collections = connect.db.collection("stories");
  console.log(req.params);
  let story = await collections.findOne({ "id": story_id });
  console.log(story);
  if (story) {
    resp.status(200).send(JSON.stringify({
      "author": story.author,
      "co_authors": story["co_authors"]
    }))
  } else {
    resp.status(400).send(JSON.stringify({
      "message": "Story not found"
    }))
  }
});


router.get("/tags", async (req, resp) => {
  let collections = connect.db.collection("stories");
  let stories = await collections.find().toArray();

  if (stories.length === 0) {
    resp.status(404).send({ error: "Stories not found" });
    return;
  }

  // collect all tags (unique)
  let tags = new Set();
  stories.forEach(story => {
    story.metadata.tags.forEach(tag => {
      tags.add(tag);
    });
  });
  resp.status(200).send(Array.from(tags));
})

// Fetch all stories by tag
// tags is an array part of metadata and case insensitive
router.get("/tags/:tag", async (req, resp) => {
  let tag = req.params.tag;
  let collections = connect.db.collection("stories");
  let stories = await collections.find({ "metadata.tags": tag }).toArray();
  if (stories.length === 0) {
    resp.status(404).send({ error: "Stories not found" });
  } else {
    resp.status(200).send(stories);
  }
})

export default router;
