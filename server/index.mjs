import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3001;

// Express JS backend setup
const app = express();
app.use(express.json())
// app.use(cors());

// NOTE: Add middleware code here


// NOTE: Define endpoints here
app.get('/ping', (req, resp) => {
  console.log(`[PING] Request url: `, req.ip);
  resp.send('<p style="font-family: monospace">Pong UWU</p>');
})

app.post("/ping", (req, resp) => {
  var reqBody = req.body;
  console.log(`[PING][POST] Request: ${reqBody}`);
  resp.send(reqBody);
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
