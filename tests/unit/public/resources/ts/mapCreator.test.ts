/** @jest-environment @stryker-mutator/jest-runner/jest-env/jsdom */
import MapCreator from "../../../../../src/public/resources/ts/mapCreator";

describe("Map Creator", () => {
    test("Can create a map", () => {
        document.body.innerHTML = '<div id="map"></div>';

        const mapCreator = new MapCreator();
        expect(mapCreator.getMap()).toBeDefined();
    });
});
