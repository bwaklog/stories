### Using nodemon for hot reload

```bash
npx nodemon ./index.mjs 
```

### API Requests to backend

1. Register a user

```bash
curl -X POST                            \
http://localhost:<PORT>/register/user   \
--json '{
"username": "foo",
"email": "foo@email.com",
"password": "foo-bar-baz"
}'
```

2. Login to a user

```bash
curl -X POST                    \
http://localhost:<PORT>/login   \
--json '{
"username": "foo",
"password": "foo-bar-baz"
}'
```

3. Create a story

```bash
curl -X POST                                            \
http://localhost:<PORT>/stories                         \
--header 'Content-Type: application/json'               \
--header 'Authorization: Bearer jwt-token-of-the-user'  \
--data '{
"content": "This is some sample content",
"title": "This is a title",
"draft": false,
"tags": ["tag1", "tag2"],
"co_authors": ["foo"]
}'
```

4. Update a story 

```bash
curl -X PUT                                             \
http://localhost:<PORT>/stories                         \
--header 'Content-Type: application/json'               \
--header 'Authorization: Bearer jwt-token-of-the-user'  \
--data '{
"id": "story-id",
"content": "This is some sample content",
"title": "This is a title",
"tags": ["tag1", "tag2"],
"draft": false,
"co_authors": ["foo"]
}'
```

5. Delete a story

```bash
curl -X DELETE                              \
http://localhost:<PORT>/stories             \
--header "Content-Type: application/json"   \
--header "Authorization: Bearer jwt"        \
--data '{
"id": "story-id"
}'
```

6. Get all stories or with filters

```bash
# get all stories
curl -X GET                                             \
--header 'Authorization: Bearer jwt-token-of-the-user'  \
http://localhost:<PORT>/stories

# get all stories who has an author/co-author named authorname
curl -X GET                                             \
--header 'Authorization: Bearer jwt-token-of-the-user'  \
http://localhost:<PORT>/stories?author=authorname

# get story with story id as storyid
curl -X GET                                             \
--header 'Authorization: Bearer jwt-token-of-the-user'  \
http://localhost:<PORT>/stories?id=storyid

# get story with stories with tag as tagname
curl -X GET                                             \
--header 'Authorization: Bearer jwt-token-of-the-user'  \
http://localhost:<PORT>/stories?tag=tagname
```

7. Get all stories with a certain tag (alternative)

```bash
# Get different types of tags as a list of tags
curl -X GET                                             \
--header 'Authorization: Bearer jwt-token-of-the-user'  \
http://localhost:<PORT>/tags

# Get stories with tag tagname
curl -X GET                                             \
--header 'Authorization: Bearer jwt-token-of-the-user'  \
http://localhost:<PORT>/tags/tagname
```

---

### Pending endpoints

- Update user data
- Comments(if needed)

---

### Test endpoints for JWT's

```bash
# create a jwt
curl -X POST                            \
http://localhost:4000/test/jwt/create   \
--json '{
"_id": "672c55f0dc14728c1ddc81f6",
"username": "lando"
}'

# create a jwt with expiry time
curl -X POST                            \
http://localhost:4000/test/jwt/create   \
--json '{
"_id": "672c55f0dc14728c1ddc81f6",
"username": "lando"
"expireSeconds": 5
}'

# Verify JWT validity
curl -X POST                            \
http://localhost:4000/test/jwt/verify   \
--json '{ "token" : "jwt-token" }'
```

---

### `.env` file`

```bash
PORT=4000

# MongoDB Config
DB_NAME=name-of-the-db
DB_USER=name-of-the-user
DB_PASSWORD=password-for-the-db
APP_NAME=app-name
CLUSTER_NAME=cluster-name

# JWT Config
JWT_SECRET=jwt-secret-key
```
