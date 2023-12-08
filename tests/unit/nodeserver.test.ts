import app, { listener } from "../../src/nodeserver";
import request from "supertest";

describe("Node server", () => {
    beforeAll(() => {
        jest.spyOn(global, "fetch").mockImplementation((input) => {
            const response: string = JSON.stringify({
                success: true,
                data: {maps: [
                    {
                        mapId: "dm_map_6554ddab8b9fc8.15595444",
                        bounds: [
                            [1, 2],
                            [3, 4],
                        ],
                        createdAt: "2023-11-15T16:18:12",
                        layers: [
                            {
                                name: "accident",
                                markers: [
                                    {
                                        point: [49.003, 2.537],
                                        description:
                                            "Accident qui aurait lieu entre 16h et 17h",
                                        color: "red",
                                    },
                                ],
                            },
                        ],
                    }
                ]},
                error_code: 200,
                message: "",
            });
            return Promise.resolve(new Response(response));
        });
    })

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
        expect(response.text).toContain("<!DOCTYPE html>");
        expect(response.text).toContain('<div id="map"></div>');
    });

    test("'/maps' route return html page with map", async () => {
        const response = await request(app).get("/maps");
        expect(response.text).toContain("<!DOCTYPE html>");
        expect(response.text).toContain('<div id="map"></div>');
    });
});
