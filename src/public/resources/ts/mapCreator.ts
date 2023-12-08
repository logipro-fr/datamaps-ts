import LayerDTO from "src/Domain/Model/DataMap/LayerDTO";
import IMap, { Bounds } from "./IMap";
import LeafletMap from "./leafletMap";

const WORLD_BOUNDS: [[number, number], [number, number]] = [[-90, -180], [90, 180]]

export default class MapCreator {
    private map: IMap;

    public constructor() {
        this.map = new LeafletMap();
        this.map.defineMaxBounds(WORLD_BOUNDS);
        this.map.setUpTiles();
    }

    public getMap(): IMap {
        return this.map;
    }

    public setBounds(bounds: Bounds): void {
        this.map.defineBounds(bounds);
    }

    public addLayers(layers: LayerDTO[]) {
        this.map.addLayers(layers);
    }
}
