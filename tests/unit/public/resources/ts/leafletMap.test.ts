/** @jest-environment @stryker-mutator/jest-runner/jest-env/jsdom */
import L from "leaflet";
import LeafletMap from "../../../../../src/public/resources/ts/leafletMap";

describe("Leaflet facade", () => {
    beforeEach(() => {
        mockMapSize();
    });

    function mockMapSize(): void {
        jest.spyOn(L.Map.prototype, "getSize").mockImplementation(
            () => new L.Point(500, 500),
        );
    }

    test("Map creation", () => {
        document.body.innerHTML = '<div id="map"></div>';

        const lmap = new LeafletMap();
        expect(lmap).toBeInstanceOf(LeafletMap);

        lmap.defineBounds([
            [0, 0],
            [3, 12],
        ]);
        expect(
            arrayContainsArray(lmap.getBounds(), [
                [0, 0],
                [3, 12],
            ]),
        ).toBeTruthy();

        expect(lmap.centerMapOn(L.latLng(0, 200))).toStrictEqual(
            L.latLng(0, 200),
        );
        lmap.defineMaxBounds([
            [-90, -180],
            [90, 180],
        ]);
        expect(lmap.centerMapOn(L.latLng(0, 200))).not.toStrictEqual(
            L.latLng(0, 200),
        );
    });

    function arrayContainsArray(
        container: Array<Array<number>>,
        contained: Array<Array<number>>,
    ): boolean {
        if (container.length != 2) {
            return false;
        } else {
            if (container[0].length != 2 || container[0].length != 2) {
                return false;
            }
            if (container[1].length != 2 || container[1].length != 2) {
                return false;
            }
        }
        if (contained.length != 2) {
            return false;
        } else {
            if (contained[0].length != 2 || contained[0].length != 2) {
                return false;
            }
            if (contained[1].length != 2 || contained[1].length != 2) {
                return false;
            }
        }

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
