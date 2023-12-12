import app from "../../../src/Infrastructure/Controller";
import request from "supertest";

describe("Node server", () => {
    let express;
    let port = 4444;

    beforeEach(() => {
        if (express != undefined) {
            express.close();
        }
        express = app.listen(getPort(port));
    });

    function getPort(port: number): number {
        if (process.env.STRYKER_MUTATOR_WORKER != undefined) {
            return port + (+process.env.STRYKER_MUTATOR_WORKER || 0)
        }
        return port;
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        express.close();
    });

    test("Routes", async () => {
        const routes = app._router.stack;
        expect(doRoutesContainRoute(routes, "/")).toBeTruthy();
        expect(doRoutesContainRoute(routes, "/maps")).toBeTruthy();
        expect(doRoutesContainRoute(routes, "/map/:map_id")).toBeTruthy();
    });

    function doRoutesContainRoute(
        routes: { route: { path: string } }[],
        routePath: string,
    ): boolean {
        const toReturn = routes.some((iroute) => {
            if (iroute.route != undefined) {
                return iroute.route.path == routePath;
            } else {
                return false;
            }
        });
        return toReturn;
    }

    test("'/' route return html page with map", async () => {
        mockCallToDatamapsAPISearch()
        const response = await request(app).get("/");
        const BOUNDS_ARE_DEFINED = '[[1,2],[3,4]]';

        expect(response.text).toContain("<!DOCTYPE html>");
        expect(response.text).toContain('<div id="map"></div>');
        expect(response.text).toContain(BOUNDS_ARE_DEFINED);
    });

    test("'/maps' route return html page with map", async () => {
        mockCallToDatamapsAPISearch()
        const response = await request(app).get("/maps");
        expect(response.text).toContain("<!DOCTYPE html>");
        expect(response.text).toContain('<div id="map"></div>');
    });

    test("'/map/:id' route return html page with map", async () => {
        mockCallToDatamapsAPIDisplay();
        const BOUNDS_ARE_DEFINED = '[[4,3],[2,1]]';

        const response = await request(app).get("/map/a_specific_map");
        expect(response.text).toContain("<!DOCTYPE html>");
        expect(response.text).toContain('<div id="map"></div>');
        expect(response.text).toContain(BOUNDS_ARE_DEFINED);
    });

    test("'/map/:id' route return error when map not found", async () => {
        jest.spyOn(global, "fetch").mockImplementationOnce(() => {
            const response: string = JSON.stringify({
                success: false,
                data: {},
                error_code: 404,
                message: "Map not found",
            });
            return Promise.resolve(new Response(response));
        });

        const response = await request(app).get("/map/a_specific_map");
        expect(response.text).toContain("<!DOCTYPE html>");
        expect(response.text).toContain("Error: 404: Map not found");
    });

    test("Static files are disponible", async () => {
        const cssStyle = await request(app).get("/static/css/style.css");
        expect(cssStyle.type).toEqual("text/css");

        const jsCompiled = await request(app).get("/staticdist/js.js");
        expect(jsCompiled.type).toEqual("application/javascript");
    });
});

function mockCallToDatamapsAPIDisplay() {
    jest.spyOn(global, "fetch").mockImplementationOnce(() => {
        const response: string = JSON.stringify({
            success: true,
            data: {
                mapId: "a_specific_map",
                bounds: [[4, 3], [2, 1],],
                createdAt: "2023-11-15T16:18:12",
                layers: [],
            },
            error_code: 200,
            message: "",
        });
        return Promise.resolve(new Response(response));
    });
}

function mockCallToDatamapsAPISearch() {
    jest.spyOn(global, "fetch").mockImplementationOnce(() => {
        const response: string = JSON.stringify({
            success: true,
            data: {maps: [
                {
                    mapId: "dm_map_6554ddab8b9fc8.15595444",
                    bounds: [[1, 2], [3, 4],],
                    createdAt: "2023-11-15T16:18:12",
                    layers: [],
                }
            ]},
            error_code: 200,
            message: "",
        });
        return Promise.resolve(new Response(response));
    });
}

