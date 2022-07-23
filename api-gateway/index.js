const express = require('express');
const httpProxy = require('express-http-proxy')
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => console.log(`API Gateway is listening on port ${PORT}`));