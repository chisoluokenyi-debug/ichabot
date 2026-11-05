const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.get("/", (req, res) => {
    res.send("IchaBot is running successfully!");
});

// Facebook webhook verification
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }

    res.sendStatus(403);
});

// Receive Facebook messages

app.post("/webhook", async (req, res) => {
    console.log("FACEBOOK WEBHOOK RECEIVED");
    console.log(JSON.stringify(req.body, null, 2));

    res.sendStatus(200);

    try {
        const body = req.body;

        if (body.object === "page") {
            for (const entry of body.entry || []) {
                for (const event of entry.messaging || []) {

                    if (event.message && !event.message.is_echo) {
                        const sender = event.sender.id;
                        const message = event.message.text || "";

                        console.log("Incoming message:", message);

                        if (message) {
                            await sendMessage(
                                sender,
                                "Welcome to IchaBot! Thanks for contacting us. How can we help you?"
                            );
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Webhook error:", error.message);
    }
});
