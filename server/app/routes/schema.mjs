import { query, validationResult } from "express-validator";

const newUserSchemaRequest = {
    username: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 3, max: 20 }
        },
        errorMessage: "Username must be between 3 and 20 characters"
    },
    email: {
        notEmpty: true,
        isEmail: true,
        errorMessage: "Invalid email"
    },
    password: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 6 },
            errorMessage: "Password must be atleast 6 characters"
        },
    }
}

/*
curl -X POST http://localhost:4000/story \
--json '{
  "author_id": "60d0fe4f5311236168a109ca",
  "author": "John Doe",
  "co_authors": ["Jane Doe", "Jim Beam"],
  "content": "This is the content of the story.",
  "title": "Sample Story Title",
  "tags": ["fiction", "adventure"],
  "draft": false
}'
*/

const newStorySchemaRequest = {
    // Validate author _id in MongoDB
    author_id: {
        notEmpty: true,
        isLength: {
            options: { min: 24, max: 24 }
        },
        errorMessage: "Invalid author_id"
    },
    author: {
        // Validate manually if author name matches in the database
        // for the given author id
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 3, max: 20 }
        },
        errorMessage: "Author must be between 3 and 20 characters"
    },
    co_authors: {
        optional: true,
        isArray: true,
        errorMessage: "Co-authors must be an array"
    },
    content: {
        notEmpty: false,
        isString: true,
        errorMessage: "Content must be at least 10 characters"
    },
    title: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 3, max: 50 }
        },
        errorMessage: "Title must be between 3 and 50 characters"
    },
    tags: {
        optional: true,
        isArray: true,
        errorMessage: "Tags must be an array"
    },
    draft: {
        isBoolean: true,
        errorMessage: "Draft must be a boolean"
    },
}

export default { newUserSchemaRequest, newStorySchemaRequest };