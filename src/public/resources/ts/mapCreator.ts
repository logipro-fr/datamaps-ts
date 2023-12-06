import LeafletMap from "./leafletMap";

export default class MapCreator {
    private map: LeafletMap;

    public constructor() {
        this.map = new LeafletMap();
    }

    public getMap(): LeafletMap {
        return this.map;
    }
}
