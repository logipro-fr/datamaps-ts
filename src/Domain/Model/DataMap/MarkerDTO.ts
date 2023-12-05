export default class MarkerDTO {
    public readonly point: ReadonlyArray<number>;
    public readonly description: string;
    public readonly color: string;

    constructor(point: number[], description: string, color: string) {
        this.point = [...point];
        this.description = description;
        this.color = color;
    }

    static createFromObject(object: {
        point: number[];
        description: string;
        color: string;
    }): MarkerDTO {
        return new this(object.point, object.description, object.color);
    }
}
