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
