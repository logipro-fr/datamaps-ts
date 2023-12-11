/** @jest-environment @stryker-mutator/jest-runner/jest-env/jsdom */

import L from "leaflet";
import LeafletMap from "../../../../../src/public/resources/ts/leafletMap";
import LayerDTO from "../../../../../src/Domain/Model/DataMap/LayerDTO";
import MarkerDTO from "../../../../../src/Domain/Model/DataMap/MarkerDTO";

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
        expect(lmap.getBounds().contains([[-10, -10], [10, 10]])).toBeTruthy();

        expect(lmap.getMapCenterWhenCenteredOn(POINT_OUT_OF_WORLD))
            .toStrictEqual(POINT_OUT_OF_WORLD);
        lmap.defineMaxBounds(WORLD_BOUNDS);
        expect(lmap.getMapCenterWhenCenteredOn(POINT_OUT_OF_WORLD))
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

    test("Layer are added to map", () => {
        const lmap = new LeafletMap();

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

        lmap.addLayers(layers);
        const llayers = lmap.getLayersControl();
        expect(llayers).toBeDefined();
        expect(lmap.getLayers()).toHaveLength(1);
        // @ts-expect-error Can't get layers in any other way...
        const allLayers: L.Layer[] = llayers?._layers;
        expect(allLayers).toHaveLength(2);
    });

    test("Layer Creation", () => {
        const lmap = new LeafletMap();

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

        const llayers = lmap.createLayersAs(layers);
        expect(llayers["accidents"]).toBeDefined();
        expect(llayers["nonaccidents"]).toBeDefined();
    });

    function getAllOfType<T, X extends T>(array: Array<T>, type: new (...args) => X): Array<X> {
        const sorted: Array<X> = [];
        array.forEach((t) => {
            if (t instanceof type) {
                sorted.push(t as X);
            }
        });
        return sorted;
    }

    test("Markers array creation from array", () => {
        const lmap = new LeafletMap();

        const markers = [
            new MarkerDTO([-7, -5], "First point", "blue"),
            new MarkerDTO([-2, 2], "Second point", "green"),
            new MarkerDTO([-90, -180], "Third point", "red"),
        ];

        const lmlayers = getAllOfType(
            lmap.createMarkersAs(markers),
            L.MarkerClusterGroup);
        expect(lmlayers).toHaveLength(2);

        const lmarkersLayer = getAllOfType(
            lmlayers[0].getLayers(), 
            L.Marker);
        expect(lmarkersLayer).toHaveLength(3);
        
        const lcirclesLayer = getAllOfType(
            lmlayers[1].getLayers(), 
            L.CircleMarker);
        expect(lcirclesLayer).toHaveLength(3);
    });

    test("L.Marker creation from MarkerDTO", () => {
        const lmap = new LeafletMap();

        const marker1 = new MarkerDTO([0, 0], "First point", "red");
        const lmarker1 = lmap.createMarkerFrom(marker1);
        expect(lmarker1.getLatLng()).toStrictEqual(L.latLng([0, 0]));
        expect(lmarker1.getPopup()?.getContent()).toStrictEqual("First point");
        expect(lmarker1.getIcon().options.iconUrl).toContain("/images/red.png");
        expect(lmarker1.getIcon().options.iconSize).toEqual([48, 48]);
        expect(lmarker1.getIcon().options.iconAnchor).toEqual([24, 48]);
        expect(lmarker1.getIcon().options.popupAnchor).toEqual([0, -32]);

        const marker2 = new MarkerDTO([1, 3], "Second point", "blue");
        const lmarker2 = lmap.createMarkerFrom(marker2);
        expect(lmarker2.getLatLng()).toStrictEqual(L.latLng([1, 3]));
        expect(lmarker2.getPopup()?.getContent()).toStrictEqual("Second point");
        expect(lmarker2.getIcon().options.iconUrl).toContain("/images/blue.png");

        const marker3 = new MarkerDTO([0, 0], "Third point", "green");
        const lmarker3 = lmap.createMarkerFrom(marker3);
        expect(lmarker3.getPopup()?.getContent()).toStrictEqual("Third point");
        expect(lmarker3.getIcon().options.iconUrl).toContain("/images/green.png");
    });

    test("L.CircleMarker creation from MarkerDTO", () => {
        const lmap = new LeafletMap();

        const marker1 = new MarkerDTO([0, 0], "First point", "red");
        const lcircleMarker1 = lmap.createCircleFrom(marker1);
        expect(lcircleMarker1.getLatLng()).toStrictEqual(L.latLng([0, 0]));
        expect(lcircleMarker1.getPopup()?.getContent()).toStrictEqual("First point");
        expect(lcircleMarker1.options.radius).toBe(1000);
        expect(lcircleMarker1.options.color).toBe("red");
        expect(lcircleMarker1.options.fillColor).toBe("red");

        const marker2 = new MarkerDTO([1, 3], "Second point", "green");
        const lcircleMarker2 = lmap.createCircleFrom(marker2);
        expect(lcircleMarker2.getLatLng()).toStrictEqual(L.latLng([1, 3]));
        expect(lcircleMarker2.getPopup()?.getContent()).toStrictEqual("Second point");
        expect(lcircleMarker2.options.color).toBe("green");
        expect(lcircleMarker2.options.fillColor).toBe("green");
    });

    test("Cluster style", () => {
        const lmap = new LeafletMap();

        const invisibleCluster = lmap.getInvisibleClusterIcon();
        expect(invisibleCluster.options.iconSize).toStrictEqual(new L.Point(0, 0));

        expect(lmap.invisibleOptions().iconCreateFunction).toBeDefined();

        const visibleCluster = lmap.getVisibleClusterIcon(3, "red");
        expect(visibleCluster.options.iconSize).toStrictEqual(new L.Point(40, 40));
        expect(visibleCluster.options.html).toBe("3");
        expect(visibleCluster.options.className).toContain("mycluster red");

        const visibleCreation = lmap.visibleOptions("red").iconCreateFunction;
        expect(visibleCreation).toBeDefined();
        if (visibleCreation != undefined) {
            const mockChildContainer = {
                getChildCount: () => {
                    return 3;
                }
            };
            expect(visibleCreation(mockChildContainer)).toBeInstanceOf(L.DivIcon);
        }
    });

    test("Legend creation", () => {
        const lmap = new LeafletMap();
        lmap.defineLegend("Test legend");
    });

    test("Error thrown when no tile layer", () => {
        const lmap = new LeafletMap();
        expect(() => lmap.getTileLayerFromMap())
            .toThrow(Error("There are no tile layer in map"));
    });
});
