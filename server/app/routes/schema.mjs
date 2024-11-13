import { query, validationResult } from "express-validator";

/*
SAMPLE CURL REQUEST

curl -X POST http://localhost:4000/register/user \
--json '{ 
"username": "bar", 
"email": "bar@gmail.com", 
"password": "abcdefgh"
}'
*/
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

const userLoginSchema = {
    username: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 3, max: 20 }
        },
        errorMessage: "Username must be between 3 and 20 characters"
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
SAMPLE CURL REQUEST

curl -X POST \
http://localhost:4000/stories \
--json '{
"author_id": "672bc8f9412bdcefc00bc5fa",
"author": "bar",
"content": "This is some sample content",
"title": "This is a title",
"draft": false,
"co_authors": ["foo"]
}'
*/
const newStorySchemaRequest = {
    // Validate author _id in MongoDB
    jwt: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 10 }
        },
        errorMessage: "Invalid JWT"
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

export default { newUserSchemaRequest, newStorySchemaRequest, userLoginSchema };