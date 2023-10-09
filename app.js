import axios from "axios";
import Fastify from "fastify";

// import dotenv from "dotenv"; // uncomment this line if you want to use .env file
// dotenv.config();

let app = Fastify({
    logger: true
});

app.get("/", async (req, res) => {
    res.send({
        message: "API is working"
    })
})

app.post("/discord", async function (req, res) {
    // sentry will keep retrying if discord delivery fails - to mark as success return a 200 response

    //TODO
    // 1. Verify payload using HMAC

    if (!req.body) {
        return Error("No request body");
    }
    const { to, is_native, chain_id, amount_as_string, transaction_hash } = req.body;
    let discord_webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!discord_webhook) {
        return Error("Discord webhook url is not set");
    }
    let message = `New ${is_native ? "native" : "ERC20"} transfer on ${chain_id} chain\n\nAmount: ${amount_as_string}\nHash: ${transaction_hash}\nTo: ${to}`;
    try {
        await axios.post(discord_webhook, {
            content: message
        })
        res.send({
            message: "success"
        })
    }
    catch (e) {
        return Error("Error sending message to discord");
    }
})



const start = async () => {
    try {
        app.listen({
            port: 3000,
            host: "0.0.0.0"
        })
    } catch (e) {
        console.log(e)
    }
}
start();
