/** @jest-environment jsdom */
import LeafletMap from "../../../../../src/public/resources/ts/leafletMap";

describe("Leaflet facade", () => {
    test("Can be instanciated", () => {
        document.body.innerHTML = '<div id="map"></div>';
        
        const lmap = new LeafletMap();
        expect(lmap).toBeInstanceOf(LeafletMap);
    });
});