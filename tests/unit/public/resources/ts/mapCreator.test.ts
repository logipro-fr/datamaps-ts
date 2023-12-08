/** @jest-environment @stryker-mutator/jest-runner/jest-env/jsdom */
import MapCreator from "../../../../../src/public/resources/ts/mapCreator";
import LeafletMap from "../../../../../src/public/resources/ts/leafletMap";
import { Bounds } from "../../../../../src/public/resources/ts/IMap";
import LayerDTO from "../../../../../src/Domain/Model/DataMap/LayerDTO";
import MarkerDTO from "../../../../../src/Domain/Model/DataMap/MarkerDTO";

jest.mock("../../../../../src/public/resources/ts/leafletMap");

describe("Map Creator", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Can create a map", () => {
        document.body.innerHTML = '<div id="map"></div>';
        const bounds: Bounds = [[-10,-10],[10,10]];
        const worldBounds: Bounds = [[-90, -180], [90, 180]];

        const mapCreator = new MapCreator();
        expect(LeafletMap).toHaveBeenCalledTimes(1);
        const mockedMap = mapCreator.getMap();

        expect(mockedMap.defineMaxBounds).toHaveBeenCalledWith(worldBounds);
        expect(mockedMap.setUpTiles).toHaveBeenCalled();

        mapCreator.setBounds(bounds);
        expect(mockedMap.defineBounds).toHaveBeenCalledWith(bounds);

        const layers: LayerDTO[] = [];
        layers.push(new LayerDTO("accidents", [
            new MarkerDTO([0, 0], "First point (layer 1)", "red"),
            new MarkerDTO([1, 3], "Second point (layer 1)", "red")
        ]));
        layers.push(new LayerDTO("nonaccidents", [
            new MarkerDTO([-7, -5], "First point (layer 2)", "blue"),
            new MarkerDTO([-2, 2], "Second point (layer 2)", "blue"),
            new MarkerDTO([-90, -180], "Third point (layer 2)", "blue"),
        ]));
        mapCreator.addLayers(layers);
        expect(mockedMap.addLayers).toHaveBeenCalledWith(layers);
    });
});
