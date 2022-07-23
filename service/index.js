const express = require('express');
const SERVICE_ID = process.env.SERVICE_ID || "local";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get(`/${SERVICE_ID}`, (req, res, next) => {
    res.status(200).send(`Response from service ${SERVICE_ID} retrieved successfully.`);
});

app.listen(PORT, () => console.log(`${SERVICE_ID} is listening on port ${PORT}`));