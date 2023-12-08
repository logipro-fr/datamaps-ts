import LayerDTO from "src/Domain/Model/DataMap/LayerDTO";

export type Bounds = [[south: number, west: number], [north: number, east: number]];

export default interface IMap {
    defineBounds(bounds: Bounds): void;

    defineMaxBounds(bounds: Bounds): void;

    setUpTiles(): void;

    addLayers(layers: LayerDTO[]): void;
}