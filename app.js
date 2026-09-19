const express = require("express");

const app = express();
const PORT = 3000;

const VERSION = process.env.VERSION || "v2";

app.get("/", (req, res) => {
    res.send(`
        <h1>Blue-Green Deployment Demo</h1>
        <h2>Application Version: ${VERSION}</h2>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});