/** @jest-environment jsdom */
import MapCreator from "../../../../../src/public/resources/ts/map";

describe("Map Creator", () => {
    test("Can create a map", () => {
        document.body.innerHTML = '<div id="map"></div>';

        const mapCreator = new MapCreator();
        expect(mapCreator.getMap()).toBeUndefined();
        mapCreator.createMap();
        expect(mapCreator.getMap()).toBeDefined();
    });
});