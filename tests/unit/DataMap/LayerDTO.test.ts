import LayerDTO from "../../../src/Domain/Model/DataMap/LayerDTO";
import MarkerDTO from "../../../src/Domain/Model/DataMap/MarkerDTO";

describe("LayerDTO", () => {
    test("Creation with correct data", () => {
        const markers: MarkerDTO[] = [
            new MarkerDTO([0, 0], "marker ONE", "red"),
            new MarkerDTO([5, 1], "marker TWO", "blue"),
        ];

        const layer: LayerDTO = new LayerDTO("My custom layer", markers);

        expect(layer.name).toBe("My custom layer");

        expect(layer.markers).toStrictEqual(markers);
        markers[1] = new MarkerDTO([0, 0], "marker THREE", "green");
        expect(layer.markers).toStrictEqual([
            new MarkerDTO([0, 0], "marker ONE", "red"),
            new MarkerDTO([5, 1], "marker TWO", "blue"),
        ]);
    });

    test("Creation with object", () => {
        const obj = {
            name: "My custom layer",
            markers: [
                {
                    point: [0, 0],
                    description: "marker ONE",
                    color: "red",
                },
                {
                    point: [5, 1],
                    description: "marker TWO",
                    color: "blue",
                },
            ],
        };

        const layer: LayerDTO = LayerDTO.createFromObject(obj);

        expect(layer.name).toBe("My custom layer");
        expect(layer.markers).toStrictEqual([
            new MarkerDTO([0, 0], "marker ONE", "red"),
            new MarkerDTO([5, 1], "marker TWO", "blue"),
        ]);
    });
});
