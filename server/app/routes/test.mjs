import express, { response } from "express";
import config from "../config/config.mjs";
import { checkSchema, validationResult } from "express-validator";
import jwt, { decode } from 'jsonwebtoken';

const router = express.Router();

const jwtCreateSchema = {
  _id: {
    notEmpty: true,
    isLength: {
      options: { min: 24, max: 24 }
    },
    errorMessage: "Invalid _id"
  },
  username: {
    notEmpty: true,
    isString: true,
    isLength: {
      options: { min: 3, max: 20 }
    },
    errorMessage: "Username must be between 3 and 20 characters"
  },
  expireSeconds: {
    optional: true,
    isInt: true,
    errorMessage: "Invalid expireSeconds"
  }
}

const jwtVerifySchema = {
  "token": {
    notEmpty: true,
    isString: true,
    errorMessage: "Invalid token"
  }
}

router.post("/jwt/create/", checkSchema(jwtCreateSchema), async (req, resp) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resp.status(400).send({ errors: errors.array() });
    return;
  }

  const req_body = req.body;
  console.log("req_body: ", req_body);

  if (req_body.expireSeconds) {
    var token = jwt.sign(req_body, config.jwt.jwtSecret, { expiresIn: parseInt(req_body.expireSeconds) })
  } else {
    var token = jwt.sign(req_body, config.jwt.jwtSecret);
    resp.status(200).send({ "message": "sucessfully created jwt", "token": token });
  }
});

router.post("/jwt/verify", checkSchema(jwtVerifySchema), async (req, resp) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resp.status(400).send({ errors: errors.array() });
    return;
  }

  const req_body = req.body;
  console.log("req_body: ", req_body);
  try {
    var decoded = jwt.verify(req_body.token, config.jwt.jwtSecret);
    // if token expired
    if (decoded.expireSeconds + decoded.iat < Date.now()) {
      resp.status(401).send({ "error": "Token expired" });
      return;
    }
    resp.status(200).send({
      "message": "sucessfully verified jwt",
      "decoded": decoded
    });
  } catch (error) {
    resp.status(400).send({ "error": error });
    return;
  }
})

export default router;
