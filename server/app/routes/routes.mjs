import express from "express";
import connect from "../database/connect.mjs";
import { checkSchema, validationResult } from "express-validator";
import schema from "./schema.mjs";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import config from "../config/config.mjs";
import auth from "../middleware/auth.mjs";

const router = express.Router();

router.use(async (req, resp, next) => {
  console.log(`Request received at ${new Date()} to ${req.url}`);
  if (req.url != "/ping" && req.url != "/register/user" && req.url != "/login") {
    // authorize the request
    const auth_header = req.header("Authorization");
    if (!auth_header) {
      resp.status(401).send({ error: "Unauthorized. No Authentication header provided" });
      return;
    }

    // Authorization: Bearer <token>
    var type = auth_header.split(" ")[0];
    var token = auth_header.split(" ")[1];
    console.log(`Token: ${token}`);
    if (type !== "Bearer") {
      resp.status(401).send({ error: "Unauthorized. Bad type for auth header" });
    }
    if (!token) {
      resp.status(401).send({ error: "Unauthorized. Auth header type mentioned but no token" });
      return;
    }
    try {
      var decoded = await auth.verifyToken(token);
      if (decoded === null) {
        resp.status(401).send({ error: "Unauthorized. Unable to verify decoded jwt user" });
        return;
      }
      console.log(`Decoded: ${JSON.stringify(decoded)}`);
    } catch (error) {
      resp.status(401).send({ error: "Unauthorized JWT" });
      return;
    }
  }
  next();
});

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

  let request = req.body;
  // check if author_id and author match in db
  let collections = connect.db.collection("users");

  // getting _id from jwt
  let jwt = auth.extractTokenFromHeader(req.header("Authorization"));
  let jwt_user = await auth.verifyToken(jwt);
  if (jwt_user !== null) {
    // check if co_authors match in db
    if (request.co_authors) {

      // check if co_authors are valid
      for (let co_author of request.co_authors) {
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
  } else {
    resp.status(400).send({ error: "Invalid JWT Parse" });
    return;
  }

  let story_collection = connect.db.collection("stories");

  // check if an existing story with the same title exists
  // where the requester is a co_author or author
  let query = {
    "metadata.title": request.title,
    $or: [
      { "author": jwt_user.username },
      { "co_authors": jwt_user.username }
    ]
  }
  let existing_story = await story_collection.findOne(query);
  if (existing_story) {
    console.log(existing_story);
    resp.status(400).send({
      error: `Story with same title exists for author ${existing_story.author} with co_authors ${existing_story.co_authors}`
    });
    return;
  }

  // create a story
  let result = await story_collection.insertOne({
    author: jwt_user.username,
    co_authors: request.co_authors,
    metadata: {
      title: request.title,
      tags: request.tags,
      draft: request.draft
    },
    content: request.content
  })
  if (result) {
    resp.status(200).send({
      message: "Story created",
      id: result.insertedId,
      result: result
    });
    return;
  } else {
    resp.status(500).send({ message: "Story not created" });
    return;
  }
})

router.put("/stories", checkSchema(schema.updateStoryRequest), async (req, resp) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resp.status(400).send({ errors: errors.array() });
    return;
  }

  let jwt = auth.extractTokenFromHeader(req.header("Authorization"));
  let jwt_user = await auth.verifyToken(jwt);
  if (jwt_user === null) {
    resp.status(400).send({ error: "Invalid JWT Parse" });
    return;
  }

  let request = req.body;

  // check if author is part of the story author or co_authors
  let query = {
    _id: ObjectId.createFromHexString(request.id),
    $or: [
      { "author": jwt_user.username },
      { "co_authors": jwt_user.username }
    ]
  };

  let collections = connect.db.collection("stories");
  let existing_story = await collections.findOne(query);
  if (!existing_story) {
    resp.status(400).send({ error: `Story not found, with id ${request.id}!!` });
    return;
  }

  // verify co_authors
  let user_collections = connect.db.collection("users");
  if (request.co_authors) {
    for (let co_author of request.co_authors) {
      let co_author_query = { username: co_author };
      let co_author_result = await user_collections.findOne(co_author_query);
      if (!co_author_result) {
        resp.status(400).send({
          error: "Invalid co_author",
          co_author: co_author
        });
        return;
      }
    }
  }

  const updated_story = {
    $set: {
      co_authors: request.co_authors,
      metadata: {
        title: request.title,
        tags: request.tags,
        draft: request.draft
      },
      content: request.content,
    }
  };

  const filter = { _id: ObjectId.createFromHexString(request.id) };

  let result = await collections.updateOne(filter, updated_story);
  if (result) {
    resp.status(200).send({
      message: `Story updated by author ${jwt_user.username}`,
      result: result
    });
    return;
  } else {
    resp.status(400).send({ message: "Story not updated, bad request" });
    return;
  }
});

router.delete("/stories", checkSchema(schema.deleteStoryRequest), async (req, resp) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    resp.status(400).send({ errors: error.array() });
    return;
  }

  let request = req.body;
  let jwt = auth.extractTokenFromHeader(req.header("Authorization"));
  let delete_author = await auth.verifyToken(jwt);
  if (delete_author === null) {
    resp.status(400).send({ error: "Invalid JWT Parse" });
    return;
  }

  let collections = connect.db.collection("stories");
  let query = { _id: ObjectId.createFromHexString(request.id) };
  let story = await collections.findOne(query);

  if (!story) {
    resp.status(400).send({ error: "Story not found" });
    return;
  }

  if (story.author !== delete_author.username) {
    resp.status(400).send({ error: "Unauthorized to delete story, should be the author" });
    return;
  }

  let result = await collections.deleteOne(query);
  if (result) {
    resp.status(200).send({
      message: `Story deleted by author ${delete_author.username}`,
      result: result
    });
    return;
  } else {
    resp.status(400).send({ message: "Story not deleted, bad request" });
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

    let jwt = auth.extractTokenFromHeader(req.header("Authorization"));
    let jwt_user = await auth.verifyToken(jwt);
    if (jwt_user === null) {
      resp.status(400).send({ error: "Invalid JWT Parse" });
      return;
    }

    var query = {};

    if (author === jwt_user.username) {
      console.log("author");
      query = {
        // "metadata.draft": true,
        $or: [
          { "author": author }, { "co_authors": author }
        ]
      };
    } else {
      // query = {
      //   "metadata.draft": false,
      //   $or: [
      //     { "author": author }, { "co_authors": author }
      //   ]
      // };
      console.log("not the author");
      query = {
        $or: [
          {
            $and: [
              { "metadata.draft": true },
              {
                $or: [
                  {
                    $and: [
                      { "co_authors": { $in: [jwt_user.username] } },
                      { "author": { $in: [author] } },
                    ]
                  },
                  {
                    $and: [
                      { "author": { $in: [jwt_user.username] } },
                      { "co_authors": { $in: [author] } },
                    ]
                  },
                ]
              }
            ]
          },
          {
            $and: [
              { "metadata.draft": false },
              {
                $or: [
                  { "author": author }, { "co_authors": author }
                ]
              }
            ]
          },
        ]
      }
    }
    // "metadata.draft": false,
    // $or: [
    //   { "author": author },
    //   { "co_authors": author }
    // ]

    let stories = await collections.find(query).toArray();

    if (stories.length === 0) {
      resp.status(404).send({ error: "Stories not found" });
      return;
    } else {
      let filteredStories = stories.map(story => ({
        id: story._id,
        author: story.author,
        co_authors: story.co_authors,
        metadata: story.metadata,
        content: story.content
      }));
      resp.status(200).send(filteredStories);
      return;
    }
  }
  if (req.query.id) {
    console.log(req.query.id);

    let jwt = auth.extractTokenFromHeader(req.header("Authorization"));
    let jwt_user = await auth.verifyToken(jwt);
    if (jwt_user === null) {
      resp.status(400).send({ error: "Invalid JWT Parse" });
      return;
    }

    let query = { _id: ObjectId.createFromHexString(req.query.id) };
    let collections = connect.db.collection("stories");
    let story = await collections.findOne(query);
    console.log(story);
    if (story) {
      if (story.metadata.draft === true && story.author !== jwt_user.username) {
        resp.status(400).send({ error: "Unauthorized to view draft story" });
        return;
      }
      resp.status(200).send(JSON.stringify({
        id: story._id,
        author: story.author,
        co_authors: story.co_authors,
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
    let stories = await collections.find({
      "metadata.tags": tag,
      "metadata.draft": false
    }).toArray();
    if (stories.length === 0) {
      resp.status(404).send({ error: "Stories not found" });
      return;
    }
    let filteredStories = stories.map(story => ({
      id: story._id,
      author: story.author,
      co_authors: story.co_authors,
      metadata: story.metadata,
      content: story.content
    }));
    resp.status(200).send(filteredStories);
    return;
  }


  let jwt = auth.extractTokenFromHeader(req.header("Authorization"));
  let jwt_user = await auth.verifyToken(jwt);
  if (jwt_user === null) {
    resp.status(400).send({ error: "Invalid JWT Parse" });
    return;
  }
  let collections = connect.db.collection("stories");
  query = { "metadata.draft": false };
  let stories = await collections.find(query).toArray();
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


router.get("/tags", async (req, resp) => {
  let collections = connect.db.collection("stories");
  let stories = await collections.find({
    "metadata.draft": false
  }).toArray();

  if (stories.length === 0) {
    resp.status(404).send({ error: "Stories not found" });
    return;
  }

  console.log(stories);

  // collect all tags (unique)
  let tags = new Set();
  stories.forEach(story => {
    if (!story.metadata.tags) {
      return;
    }
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
  let stories = await collections.find({
    "metadata.tags": tag,
    "metadata.draft": false
  }).toArray();
  if (stories.length === 0) {
    resp.status(404).send({ error: "Stories not found" });
  } else {
    resp.status(200).send(stories);
  }
})

export default router;
