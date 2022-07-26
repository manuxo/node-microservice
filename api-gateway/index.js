const express = require('express');
const httpProxy = require('express-http-proxy');
let amqp = require('amqplib/callback_api');
const PORT = process.env.PORT || 3000;
const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "localhost";

const app = express();

// Create proxy for each service

const serviceOneProxy = httpProxy("nodeapp1:3000");
const serviceTwoProxy = httpProxy("nodeapp2:3000");
const serviceThreeProxy = httpProxy("nodeapp3:3000");

// Authentication or some shared logic
app.use((req, res, next) => {
    // TODO: my authentication logic
    console.log("Validating auth...");
    console.log("User authenticated successfully");
    next();
})

app.get("/", (req, res, next) => {
    res.status(200).send("API Gateway works!");
});

app.get("/service1", serviceOneProxy);

app.get("/service2", serviceTwoProxy);

app.get("/service3", serviceThreeProxy);

app.get("/messages", (req, res, next) => {
    const { msg } = req.query;
    if (msg) {
        amqp.connect(`amqp://${RABBITMQ_HOST}`, (error0, conn) => {
            if (error0) {
                throw error0;
            }
            conn.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                var queueName = 'message-box';
                channel.assertQueue(queueName, {
                    durable: false
                });
                channel.sendToQueue(queueName, Buffer.from(msg));
                console.log("API Gateway sent %s", msg);
                res.status(201).send("Message sent successfully");
            });
        });
    } else {
        res.status(400).send("Message is empty");
    }
});

app.listen(PORT, () => console.log(`API Gateway is listening on port ${PORT}`));