import express from "express";
import connect from "../database/connect.mjs";

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
        resp.status(500).send(`<p style="font-family: monospace">XoX</p>`) :
        resp.status(200).send(`<p style="font-family: monospace">PONG: ${JSON.stringify(updatedPing)}</p>`);
})

// User registeration
router.post("/register/user", async (req, resp) => {
    // { username, password, email, dob, bio, profilePicURL }
    // username would be unique hence we can use it as an identifier
    // curl --json '{"username": "testuser", "password": "abc", "email": "testuser@abc", "dob": "01-01-2000", "bio": "test bio", "profilePicURL": "https://test.com"}' -X POST http://localhost:3000/register/user

    let user = req.body;
    if (user === null) {
        resp.status(400).send({ error: "Invalid request" });
        return;
    }

    // check for existing user
    let exists = await connect.doesUserExist(user.username);

    if (exists) {
        resp.status(400).send({ error: "User already exists" });
        return;
    } else {
        let collections = connect.db.collection("users");
        await collections.insertOne(user);
        resp.status(201).send({ message: "User created" });
    }
})

router.get('/users/', async (req, resp) => {
    let collections = connect.db.collection("users");
    let users = await collections.find().toArray();
    if (users.length === 0) {
        resp.status(404).send({ error: "Users not found" });
    } else {
        resp.status(200).send(users);
    }
});

// Fetch all stories
router.get("/stories", async (req, resp) => {
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

router.get("/stories/:author", async (req, resp) => {
    let author = req.params.author;
    let collections = connect.db.collection("stories");
    let stories = await collections.find({ $or: [{ "author": author }, { "co-authors": author }] }).toArray();
    if (stories.length === 0) {
        resp.status(404).send({ error: "Stories not found" });
        return;
    } else {
        resp.status(200).send(stories);
    }
})

// Fetch Story with ID and Author
router.get("/stories/:author/:id", async (req, resp) => {
    let id = req.params.id;
    let author = req.params.author;
    if (id === null || author === null) {
        resp.status(400).send({ error: "Invalid request" });
        return;
    }

    // check if an author exists
    let exist = await connect.doesUserExist(author);
    if (exist === false) {
        resp.status(404).send({ error: "Author not found" });
        return;
    }
    console.log(exist);

    let collections = connect.db.collection("stories");
    let story = await collections.findOne({ id: id, author: author });
    if (story) {
        resp.status(200).send(story);
    } else {
        resp.status(404).send({ error: "Story not found" });
    }
});

/*
each story has tags associated with it
{ 
    id: int, 
    author: string, 
    co-authors: []string, 
    metadata: {
        title: string, 
        tags: []string, 
        published: bool
    }, 
    content 
}
*/
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

// Fetch all stories by author
router.get("/stories/:author", async (req, resp) => {
    let author = req.params.author;
    let collections = connect.db.collection("stories");
    let stories = await collections.find({ author: author }).toArray();
    if (stories.length === 0) {
        resp.status(404).send({ error: "Stories not found" });
    } else {
        resp.status(200).send(stories);
    }
})

export default router;