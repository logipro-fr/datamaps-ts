import L from "leaflet";

export default class MapCreator {
    private map: any = undefined;

    public getMap(): any {
        return this.map;
    }

    public createMap() {
        this.map = L.map("map");
    }
}