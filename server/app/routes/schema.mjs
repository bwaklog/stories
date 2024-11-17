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

const deleteUserRequest = {
    // jwt should do the job
    // id: {
    //     notEmpty: true,
    //     isString: true,
    //     isLength: {
    //         options: { min: 24, max: 24 }
    //     },
    //     errorMessage: "Invalid user id"
    // }
}

const newStorySchemaRequest = {
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

const updateStoryRequest = {
    // Validate author _id in MongoDB
    id: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 24, max: 24 }
        },
        errorMessage: "Invalid story id"
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

const deleteStoryRequest = {
    id: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 24, max: 24 }
        },
        errorMessage: "Invalid story id"
    }
}

export default { newUserSchemaRequest, newStorySchemaRequest, userLoginSchema, updateStoryRequest, deleteStoryRequest };