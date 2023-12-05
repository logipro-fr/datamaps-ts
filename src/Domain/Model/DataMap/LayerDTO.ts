import MarkerDTO from "./MarkerDTO";

export default class LayerDTO {
    public readonly name: string;
    public readonly markers: ReadonlyArray<MarkerDTO>;

    constructor(name: string, markers: MarkerDTO[]) {
        this.name = name;
        this.markers = [...markers];
    }

    static createFromObject(object: {
        name: string;
        markers: { point: number[]; description: string; color: string }[];
    }) {
        return new this(
            object.name,
            object.markers.map((markerObj) =>
                MarkerDTO.createFromObject(markerObj),
            ),
        );
    }
}
