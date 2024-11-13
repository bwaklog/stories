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

3. Create a story (Pending update)

```bash
curl -X POST \
http://localhost:<PORT>/stories \
--json '{
"author_id": "672bc8f9412bdcefc00bc5fa",
"author": "bar",
"content": "This is some sample content",
"title": "This is a title",
"draft": false,
"co_authors": ["foo"]
}'
```

4. Get all stories or with filters

```bash
# get all stories
curl -X GET http://localhost:<PORT>/stories

# get all stories who has an author/co-author named authorname
curl -X GET http://localhost:<PORT>/stories?author=authorname

# get story with story id as storyid
curl -X GET http://localhost:<PORT>/stories?id=storyid

# get story with stories with tag as tagname
curl -X GET http://localhost:<PORT>/stories?tag=tagname
```

5. Get all stories with a certain tag (alternative)

```bash
# Get different types of tags as a list of tags
curl -X GET http://localhost:<PORT>/tags

# Get stories with tag tagname
curl -X GET http://localhost:<PORT>/tags/tagname
```

---

### Pending endpoints

- Update stories content/metadata
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
