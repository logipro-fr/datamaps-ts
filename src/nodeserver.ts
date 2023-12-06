import express from "express";
import path from "path";

const app = express();
const port: number = 3000;

app.get("/", (req, res) => {
    res.send("Welcome on my website");
});

app.get("/maps", (req, res) => {
    app.use(express.static(path.resolve() + "/src/public/resources"));
    res.sendFile(path.resolve() + "/src/public/maps.html");
})

const listener = app.listen(port, () => {});

export default app;
export { listener };
