import axios from "axios";
import Fastify from "fastify";
import { formatEther, formatUnits } from "ethers";

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

let known_tokens = [{
    chain_id: 56,
    contract_address: "0x55d398326f99059fF775485246999027B3197955",
    name: "Tether USD",
    symbol: "USDT",
    decimals: 18,
}]

function getChainName(chain_id) {
    let chains = [{ id: 56, name: "BSC" }, { id: 1, name: "ETH" }]
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

    let contract = known_tokens.find(token => token.chain_id == chain_id && token.contract_address.toLowerCase() == contract_address.toLowerCase());
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
            return amount_in_wei;
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
