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

export default router;