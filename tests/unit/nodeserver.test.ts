import app, { listener } from "../../src/nodeserver";
import request from "supertest";

describe("Node server", () => {
    afterAll(async () => {
        listener.close();
    });

    test("Routes", async () => {
        const routes = (await app)._router.stack;
        expect(routesHave(routes, "/")).toBeTruthy();
        expect(routesHave(routes, "/maps")).toBeTruthy();
    });

    function routesHave(
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

    test("'/' route return value", async () => {
        const response = await request(app).get("/");
        expect(response.text).toEqual("Welcome on my website");
    });

    test("'/maps' route return html page with map", async () => {
        const response = await request(app).get("/maps");
        expect(response.text).toContain("<!DOCTYPE html>");
        expect(response.text).toContain('<div id="map"></div>');
    });
});
