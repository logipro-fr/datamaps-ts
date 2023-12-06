import L from "leaflet";

export default class LeafletMap {
    private map: L.Map;

    public constructor() {
        this.map = L.map("map");
    }
}