import LayerDTO from "./LayerDTO";
import MapObject from "./Types/MapObject";

export default class MapDTO {
    public readonly mapId: string;
    public readonly bounds: ReadonlyArray<ReadonlyArray<number>>;
    public readonly createdAt: string;
    public readonly layers: ReadonlyArray<LayerDTO>;

    constructor(
        mapId: string,
        bounds: number[][],
        createdAt: string,
        layers: LayerDTO[],
    ) {
        this.mapId = mapId;
        this.bounds = [...bounds];
        this.createdAt = createdAt;
        this.layers = [...layers];
    }
    static createFromObject(object: MapObject): MapDTO {
        return new this(
            object.mapId,
            object.bounds,
            object.createdAt,
            object.layers.map((layerObj) =>
                LayerDTO.createFromObject(layerObj),
            ),
        );
    }
}
