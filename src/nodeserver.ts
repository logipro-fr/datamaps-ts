import express from "express";

const app = express();
const port: number = 3000;

app.get("/", (req, res) => {
    res.send("Welcome on my website");
});

const listener = app.listen(port, () => {});

export default app;
export { listener };
