import express, { Request, Response } from "express";
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

async function renderLastMap(req: Request, res: Response): Promise<any> {
    const datamap = new Datamap(new FetchHttpClient());
    const map = (await datamap.search(1))[0];

    res.render(
        path.resolve() + "/src/public/index", 
        {
            bounds: JSON.stringify(map.bounds), 
            layers: JSON.stringify(map.layers)
        }
    );
}

app.get("/", renderLastMap);

app.get("/maps", renderLastMap);

app.get("/map/:map_id", async (req, res, next) => {
    try {
        const datamap = new Datamap(new FetchHttpClient());
        const map = (await datamap.display(req.params.map_id));

        res.render(
            path.resolve() + "/src/public/index", 
            {
                bounds: JSON.stringify(map.bounds), 
                layers: JSON.stringify(map.layers)
            }
        );
    } catch(e) {
        next(e);
    }
});

export default app;