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

app.get("/", async (req, res) => {

    const datamap = new Datamap(new FetchHttpClient());
    const map = (await datamap.search(1))[0];

    const layers = JSON.stringify(map.layers);
    const bounds = JSON.stringify(map.bounds);
    app.use(express.static(path.resolve() + "/dist/public/resources"));
    res.render(path.resolve() + "/src/public/index", {bounds: bounds, layers: layers});
});

app.get("/maps", (req, res) => {
    app.use(express.static(path.resolve() + "/src/public/resources"));
    res.sendFile(path.resolve() + "/src/public/maps.html");
});

const listener = app.listen(port, () => {});

export default app;
export { listener };
