/** @jest-environment @stryker-mutator/jest-runner/jest-env/jsdom */
import L from "leaflet";
import LeafletMap from "../../../../../src/public/resources/ts/leafletMap";

const WORLD_BOUNDS: [[number, number], [number, number]] = [[-90, -180], [90, 180]]
const POINT_OUT_OF_WORLD = L.latLng(0, 200);

describe("Leaflet facade", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="map"></div>';
        mockMapSize();
    });

    function mockMapSize(): void {
        jest.spyOn(L.Map.prototype, "getSize").mockImplementation(
            () => new L.Point(500, 500),
        );
    }

    test("Map creation", () => {
        const lmap = new LeafletMap();
        expect(lmap).toBeInstanceOf(LeafletMap);

        lmap.defineBounds([[-10, -10], [10, 10]]);
        expect(arrayContainsArray(
                lmap.getBounds(), 
                [[-10, -10], [10, 10]]
            )).toBeTruthy();

        expect(lmap.centerMapOn(POINT_OUT_OF_WORLD))
            .toStrictEqual(POINT_OUT_OF_WORLD);
        lmap.defineMaxBounds(WORLD_BOUNDS);
        expect(lmap.centerMapOn(POINT_OUT_OF_WORLD))
            .not.toStrictEqual(POINT_OUT_OF_WORLD);

        lmap.setUpTiles();
        const ltileLayer = lmap.getTileLayerFromMap();
        expect(ltileLayer.getTileUrl(
        // @ts-expect-error Typescript wants to completely implement L.coords even though it is not necessary
                {x: 0, y: 0, z: 0}
            )).toContain("https://tile.openstreetmap.org");
        expect(ltileLayer.options.maxZoom).toBe(19);
        expect(ltileLayer.options.attribution).toEqual('&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>');
    });

    test("Error thrown when no tile layer", () => {
        const lmap = new LeafletMap();
        
        expect(() => lmap.getTileLayerFromMap()).toThrow(Error("There are no tile layer in map"));
    })

    function arrayContainsArray(
        container: [[number, number], [number, number]],
        contained: [[number, number], [number, number]],
    ): boolean {
        if (
            container[0][0] > contained[0][0] ||
            container[0][1] > contained[0][1]
        ) {
            return false;
        }
        if (
            container[1][0] < contained[1][0] ||
            container[1][1] < contained[1][1]
        ) {
            return false;
        }
        return true;
    }
});
