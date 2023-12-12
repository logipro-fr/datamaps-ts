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

        lmap.defineBounds([[-10, -10], [10, 10]]);
        const mapContainsDefinedBounds = lmap.getBounds().contains([[-10, -10], [10, 10]]);
        expect(mapContainsDefinedBounds).toBeTruthy();

        expect(lmap.centeredOn(POINT_OUT_OF_WORLD))
            .toStrictEqual(POINT_OUT_OF_WORLD);
        lmap.defineMaxBounds(WORLD_BOUNDS);
        expect(lmap.centeredOn(POINT_OUT_OF_WORLD))
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

    test("Layer Creation", () => {
        const lmap = new LeafletMap();

        const layers: LayerDTO[] = createTestLayers();

        const llayers = lmap.createLayersAs(layers);
        expect(llayers["accidents"]).toBeDefined();
        expect(llayers["nonaccidents"]).toBeDefined();
    });

    test("Layer are added to map", () => {
        const lmap = new LeafletMap();

        const layers: LayerDTO[] = createTestLayers();

        lmap.addLayers(layers);
        expect(lmap.getLayers()).toHaveLength(1);

        const llayers = lmap.getLayersControl();
        expect(llayers).toBeDefined();
        // @ts-expect-error Can't get layers in any other way: private property
        const allLayers: L.Layer[] = llayers?._layers;
        expect(allLayers).toHaveLength(2);
    });

    test("Add empty layers property to map", () => {
        const lmap = new LeafletMap();

        const layers: LayerDTO[] = [];

        lmap.addLayers(layers);
        const llayers = lmap.getLayersControl();
        expect(llayers).toBeDefined();
        expect(lmap.getLayers()).toHaveLength(0);
    });

    test("Markers array creation from array", () => {
        const lmap = new LeafletMap();

        const markers = [
            new MarkerDTO([-7, -5], "First point", "blue"),
            new MarkerDTO([-2, 2], "Second point", "green"),
            new MarkerDTO([-90, -180], "Third point", "red"),
        ];

        const lmlayers = getAllInstancesOfType(
            lmap.createMarkersAs(markers),
            L.MarkerClusterGroup);
        expect(lmlayers).toHaveLength(2);

        const lmarkersLayer = getAllInstancesOfType(
            lmlayers[0].getLayers(), 
            L.Marker);
        expect(lmarkersLayer).toHaveLength(3);
        
        const lcirclesLayer = getAllInstancesOfType(
            lmlayers[1].getLayers(), 
            L.CircleMarker);
        expect(lcirclesLayer).toHaveLength(3);
    });

    function getAllInstancesOfType<T, X extends T>(array: Array<T>, type: new (...args) => X): Array<X> {
        const sorted: Array<X> = [];
        array.forEach((t) => {
            if (t instanceof type) {
                sorted.push(t as X);
            }
        });
        return sorted;
    }

    test("L.Marker creation from MarkerDTO", () => {
        const lmap = new LeafletMap();

        const marker1 = new MarkerDTO([0, 0], "First point", "red");
        const lmarker1 = lmap.createMarkerFrom(marker1);
        expect(lmarker1.getLatLng()).toStrictEqual(L.latLng([0, 0]));
        expect(lmarker1.getPopup()?.getContent()).toStrictEqual("First point");
        expect(lmarker1.getIcon().options.iconUrl).toContain("red");
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
    });

    test("Cluster style", () => {
        const lmap = new LeafletMap();

        const hiddenCluster = lmap.getHiddenClusterIcon();
        expect(hiddenCluster.options.iconSize).toStrictEqual(new L.Point(0, 0));

        expect(lmap.hiddenClusterOptions().iconCreateFunction).toBeDefined();


        const shownCluster = lmap.getShownClusterIcon(3, "red");
        expect(shownCluster.options.iconSize).toStrictEqual(new L.Point(40, 40));
        expect(shownCluster.options.html).toBe("3");
        expect(shownCluster.options.className).toContain("mycluster red");

        const shownIconCreator = lmap.shownClusterOptions("red").iconCreateFunction;
        expect(shownIconCreator).toBeDefined();
        if (shownIconCreator != undefined) {
            const mockChildContainer = {
                getChildCount: () => {
                    return 3;
                }
            };
            expect(shownIconCreator(mockChildContainer)).toBeInstanceOf(L.DivIcon);
        }
    });

    test("Legend creation", () => {
        const lmap = new LeafletMap();

        const legend = lmap.createLeafletLegend("Testing legend");
        expect(legend.options.position).toBe("bottomleft");
        expect(legend.onAdd).toBeDefined();
        if (legend.onAdd != undefined) {
            const htmldiv = legend.onAdd(lmap.getMap());
            expect(htmldiv.tagName).toBe("DIV");
            expect(htmldiv.className).toContain("legend");
            expect(htmldiv.innerHTML).toBe("Testing legend");
        }

        lmap.defineLegend("Map legend");
        expect(lmap.getMap()
        // @ts-expect-error Can't get controls in any other way: private property
            ._controlCorners
            .bottomleft.innerHTML).toContain("Map legend");
    
    });

    test("Error thrown when no tile layer", () => {
        const lmap = new LeafletMap();
        expect(() => lmap.getTileLayerFromMap())
            .toThrow(Error("There are no tile layer in map"));
    });
});

function createTestLayers(): LayerDTO[] {
    return [
        new LayerDTO("accidents", [
            new MarkerDTO([0, 0], "First point (layer 1)", "red"),
            new MarkerDTO([1, 3], "Second point (layer 1)", "red")
        ]),
        new LayerDTO("nonaccidents", [
            new MarkerDTO([-7, -5], "First point (layer 2)", "blue"),
            new MarkerDTO([-2, 2], "Second point (layer 2)", "blue"),
            new MarkerDTO([-90, -180], "Third point (layer 2)", "blue"),
        ])
    ];
}