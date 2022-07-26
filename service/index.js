const express = require('express');
let amqp = require('amqplib/callback_api');
const SERVICE_ID = process.env.SERVICE_ID || "local";
const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "localhost";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get(`/${SERVICE_ID}`, (req, res, next) => {
    res.status(200).send(`Response from service ${SERVICE_ID} retrieved successfully.`);
});

amqp.connect(`amqp://${RABBITMQ_HOST}`, (error0, conn) => {
    if (error0) {
        console.error(error0);
        throw error0;
    }
    conn.createChannel((error1, channel) => {
        if (error1) {
            console.error(error1);
            throw error1;
        }

        const queue = 'message-box';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(`${SERVICE_ID} waiting for messages in queue: ${queue}.`);
        channel.consume(queue, msg => {
            console.log(`${SERVICE_ID} received ${msg.content.toString()}`);
        });
    });
});

app.listen(PORT, () => console.log(`${SERVICE_ID} is listening on port ${PORT}`));