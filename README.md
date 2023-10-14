# Simple Nodejs API to send Sentry notifications to Discord

This is a simple Node.js Fastify API that receives webhook notifications from Sentry Streams and sends notifications to a Discord webhook. You can run this application either in a Docker container or directly on a server.

## Prerequisites

Before running this application, make sure you have the following prerequisites installed:

- [Docker](https://docs.docker.com/get-docker/) (if running with Docker)
- [Node.js](https://nodejs.org/) (if running without Docker)

## Running with Docker

To run the Node.js Fastify API in a Docker container:


```shell
# Run pre-built Docker Image and set the Discord webhook URL as an environment variable
docker run -d -p 80:80 -e DISCORD_WEBHOOK_URL=<your-discord-webhook-url> solidhash/streams-discord-api
```


```shell
# Build Docker Image and run it
git clone git@github.com:solidhash-io/streams-discord-api.git

cd streams-discord-api

docker build -t streams-discord-api .

docker run -d -p 80:80 -e DISCORD_WEBHOOK_URL=<your-discord-webhook-url> streams-discord-api

```

## Running without Docker

To run the Node.js Fastify API without Docker:

```shell
# Clone the repository
git clone git@github.com:solidhash-io/streams-discord-api.git

cd streams-discord-api

# Install dependencies
npm install

# Run the application
npm start
```


## Configuring Sentry

```shell
# Setup Sentry Stream account
curl --location 'https://api.sentrynode.io/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email" : "your-email@email.com",
    "password" : "your_secure_password",
    "first_name" : "your_first_name",
    "last_name" : "your_last_name"
}'

# Login to Sentry Stream account
curl --location 'https://api.sentrynode.io/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email" : "your_email",
    "password" : "your_password"
}'

# Create a new project and copy id - Your account is automatically added as a member(Owner)
curl --location 'https://api.sentrynode.io/projects/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer ${your token}' \
--data '{
    "name" : "Beautiful Name",
    "description" : "A short Description",
    "environment" : "Production",
    "members" : []
}'


# Create a new stream and get ID
curl --location 'https://api.sentrynode.io/stream/new-stream' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer ${your token}' \
--data '{
    "project_id" : "project_id_from_above",
    "stream_type" : ["Transfer"],
    "blockchain_network" : ["bsc", "eth","arbitrum"], 
    "webhook_url" : ["your webhook url from your deployment"],
    "whitelisted_contract_addresses" : [],
    "blacklisted_contract_addresses" : [],
    "ipn_secret" : "a secret to encrypt payload",
    "plan" : "Free"
}'


# Push address to stream
curl --location 'https://api.sentrynode.io/stream/new-address' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer ${your token}' \
--data '{
    "address" : "your address",
    "stream_id" : "stream_id"
    
}'

```
