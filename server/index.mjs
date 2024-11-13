import express, { json } from 'express';
import cors from 'cors';
import config from './app/config/config.mjs';
import connect from './app/database/connect.mjs';
import router from './app/routes/routes.mjs';
import testRouter from './app/routes/test.mjs';

// Connect to MongoDB
// connect.initaliseClient();

console.log("[CONN] Attempting to ping MongoDB");
await connect.initaliseClient();

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.use("/test",testRouter);
app.use("/", router);

app.listen(config.app.port, () => {
  console.log(`listening on port ${config.app.port}`)
})
