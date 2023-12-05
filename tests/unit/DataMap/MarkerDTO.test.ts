import MarkerDTO from "../../../src/Domain/Model/DataMap/MarkerDTO";

describe("MarkerDTO", () => {
    test("Creation with correct data", () => {
        const pointPosition: number[] = [1, 2];
        const marker: MarkerDTO = new MarkerDTO(
            pointPosition,
            "My custom description for my marker",
            "red",
        );

        expect(marker.point).toEqual(pointPosition);
        pointPosition[1] = 3;
        expect(marker.point).toEqual([1, 2]);

        expect(marker.description).toBe("My custom description for my marker");

        expect(marker.color).toBe("red");
    });

    test("Creation from object", () => {
        const obj = {
            point: [1, 2],
            description: "My custom description for my marker",
            color: "red",
        };

        const marker: MarkerDTO = MarkerDTO.createFromObject(obj);

        expect(marker.point).toEqual([1, 2]);
        expect(marker.description).toBe("My custom description for my marker");
        expect(marker.color).toBe("red");
    });
});
