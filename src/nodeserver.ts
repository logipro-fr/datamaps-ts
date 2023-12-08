import express from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import Datamap from "./Application/Datamap";
import FetchHttpClient from "./Infrastructure/FetchHttpClient";

const app = express();
const port: number = 3000;

app.use(expressLayouts);
app.set('views', path.resolve() + "/src/public");
app.set('view engine', 'ejs');

app.use("/staticdist", express.static(path.resolve() + "/dist/public/resources"));
app.use("/static", express.static(path.resolve() + "/src/public/resources"));

app.get("/", async (req, res) => {
    const datamap = new Datamap(new FetchHttpClient());
    const map = (await datamap.search(1))[0];

    const layers = JSON.stringify(map.layers);
    const bounds = JSON.stringify(map.bounds);
    res.render(path.resolve() + "/src/public/index", {bounds: bounds, layers: layers});
});

app.get("/maps", async (req, res) => {
    const datamap = new Datamap(new FetchHttpClient());
    const map = (await datamap.search(1))[0];

    const layers = JSON.stringify(map.layers);
    const bounds = JSON.stringify(map.bounds);
    res.render(path.resolve() + "/src/public/index", {bounds: bounds, layers: layers});
});

app.get("/map/:map_id", async (req, res, next) => {
    try {
        const datamap = new Datamap(new FetchHttpClient());
        const map = (await datamap.display(req.params.map_id));

        const layers = JSON.stringify(map.layers);
        const bounds = JSON.stringify(map.bounds);
        res.render(path.resolve() + "/src/public/index", {bounds: bounds, layers: layers});
    } catch(e) {
        next(e);
    }
});

const listener = app.listen(port, () => {});

export default app;
export { listener };
