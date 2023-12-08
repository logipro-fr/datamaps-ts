import LayerDTO from "../../../src/Domain/Model/DataMap/LayerDTO";
import MapDTO from "../../../src/Domain/Model/DataMap/MapDTO";
import MarkerDTO from "../../../src/Domain/Model/DataMap/MarkerDTO";

describe("MapDTO", () => {
    test("Creation with correct data", () => {
        const bounds: number[][] = [
            [0, 1],
            [4, 5],
        ];
        const layers: LayerDTO[] = [
            new LayerDTO("layer ONE", []),
            new LayerDTO("layer TWO", [
                new MarkerDTO([1, 2], "marker ONE", "red"),
            ]),
        ];
        const map: MapDTO = new MapDTO(
            "my_map_id",
            bounds,
            "2023-11-15T16:18:12",
            layers,
        );

        expect(map.mapId).toBe("my_map_id");

        expect(map.bounds).toEqual([
            [0, 1],
            [4, 5],
        ]);
        bounds[0] = [1, 2];
        expect(map.bounds).toEqual([
            [0, 1],
            [4, 5],
        ]);
        bounds[0][0] = 9;
        expect(map.bounds).toEqual([
            [0, 1],
            [4, 5],
        ]);

        expect(map.createdAt).toBe("2023-11-15T16:18:12");

        expect(map.layers).toStrictEqual([
            new LayerDTO("layer ONE", []),
            new LayerDTO("layer TWO", [
                new MarkerDTO([1, 2], "marker ONE", "red"),
            ]),
        ]);
        layers[0] = new LayerDTO("layer THREE", []);
        expect(map.layers).toStrictEqual([
            new LayerDTO("layer ONE", []),
            new LayerDTO("layer TWO", [
                new MarkerDTO([1, 2], "marker ONE", "red"),
            ]),
        ]);
    });

    test("Creation with object", () => {
        const obj = {
            mapId: "my_map_id",
            bounds: [
                [0, 1],
                [4, 5],
            ],
            createdAt: "2023-11-15T16:18:12",
            layers: [
                {
                    name: "layer ONE",
                    markers: [],
                },
                {
                    name: "layer TWO",
                    markers: [
                        {
                            point: [1, 2],
                            description: "marker ONE",
                            color: "red",
                        },
                    ],
                },
            ],
        };

        const map: MapDTO = MapDTO.createFromObject(obj);

        expect(map.mapId).toBe("my_map_id");
        expect(map.bounds).toEqual([
            [0, 1],
            [4, 5],
        ]);
        expect(map.createdAt).toBe("2023-11-15T16:18:12");
        expect(map.layers).toStrictEqual([
            new LayerDTO("layer ONE", []),
            new LayerDTO("layer TWO", [
                new MarkerDTO([1, 2], "marker ONE", "red"),
            ]),
        ]);
    });
});
