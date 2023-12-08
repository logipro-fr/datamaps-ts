import express from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts";

const app = express();
const port: number = 3000;

app.use(expressLayouts);
app.set('views', path.resolve() + "/src/public");
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    app.use(express.static(path.resolve() + "/dist/public/resources"));
    res.render(path.resolve() + "/src/public/index", {bounds: [[-10, -10], [10, 10]]});
});

app.get("/maps", (req, res) => {
    app.use(express.static(path.resolve() + "/src/public/resources"));
    res.sendFile(path.resolve() + "/src/public/maps.html");
});

const listener = app.listen(port, () => {});

export default app;
export { listener };
