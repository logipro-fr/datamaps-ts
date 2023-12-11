import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import path from "path";
import Datamap from "../Application/Datamap";
import FetchHttpClient from "./FetchHttpClient";

const app = express();

app.use(expressEjsLayouts);

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

export default app;