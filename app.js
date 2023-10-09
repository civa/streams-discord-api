import axios from "axios";
import Fastify from "fastify";
import { formatEther, formatUnits } from "ethers";
import known_tokens from "./tokens.js";
import chains from "./chains.js";
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



function getChainName(chain_id) {

    let chain = chains.find(chain => chain.id == chain_id);
    if (chain) {
        return chain.name;
    }
    else {
        return chain_id;
    }
}

function getContractDetails(chain_id, contract_address) {
    console.log("contract_address", contract_address)
    console.log("chain_id", chain_id)

    let contract = known_tokens.find(token => token.chainId == chain_id && token.address.toLowerCase() == contract_address.toLowerCase());
    if (contract) {
        return contract;
    }
    else {
        return null;
    }
};

function formatAmount(amount_in_wei, is_native, chain_id, token_contract) {
    if (is_native) {
        let decimals = 18;
        let amount = formatEther(amount_in_wei);
        return amount;
    } else {
        let contract = getContractDetails(chain_id, token_contract);
        if (contract) {
            let decimals = contract.decimals;
            let amount = formatUnits(amount_in_wei, decimals);
            return amount;
        }
        else {
            return "Unknown Token";
        }
    }
}

app.post("/discord", async function (req, res) {
    if (!req.body) {
        return Error("No request body");
    }
    const { from, to, is_native, chain_id, amount_as_string, transaction_hash, token_contract } = req.body;
    let discord_webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!discord_webhook) {
        return Error("Discord webhook url is not set");
    }
    let transferType = is_native ? "native" : "Token";
    let chainName = getChainName(chain_id);
    let contract = getContractDetails(chain_id, token_contract);
    let formatted_amount = formatAmount(amount_as_string, is_native, chain_id, token_contract);

    let embeds = [
        {
            name: "Chain",
            value: chainName
        },
        {
            name: "From",
            value: from
        },
        {
            name: "To",
            value: to
        },
        {
            name: "Transaction Hash",
            value: transaction_hash
        },
        {
            name: "Amount in Wei",
            value: amount_as_string
        },

        {
            name: "Formatted Amount",
            value: formatted_amount
        },
    ]

    console.log("contract", contract)

    if (token_contract) {
        embeds.push({
            name: "Token Contract Address",
            value: token_contract
        })
    }

    if (contract) {
        embeds.push({
            name: "Token Name",
            value: contract.name
        })
        embeds.push({
            name: "Token Symbol",
            value: contract.symbol
        })
        embeds.push({
            name: "Token Decimals",
            value: contract.decimals
        })
    }

    try {
        await axios.post(discord_webhook, {
            content: `New ${transferType} transfer on ${getChainName(chain_id)} network`,
            embeds: [
                {
                    title: "Transfer Details",
                    fields: embeds
                }
            ]
        })
        res.send({
            message: "success"
        })
    }
    catch (e) {
        console.log(e)
        return Error("Error sending message to discord");
    }
})



const start = async () => {
    try {
        app.listen({
            port: process.env.PORT || 80,
            host: "0.0.0.0"
        })
    } catch (e) {
        console.log(e)
    }
}
start();
