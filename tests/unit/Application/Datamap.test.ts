import Datamap from "../../../src/Application/Datamap";
import HttpClientInterface from "../../../src/Application/HttpClientInterface";
import MapDTO from "../../../src/Domain/Model/DataMap/MapDTO";
import MapObject from "../../../src/Domain/Model/DataMap/Types/MapObject";
import DatamapResponse from "../../../src/Application/DatamapResponse";

class FakeHttpClient implements HttpClientInterface {
    post_json(
        url: string,
        json: string,
    ): Promise<DatamapResponse<{ mapId: string; displayUrl: string }>> {
        throw new Error(
            "Called empty function from " + url + " with data as " + json,
        );
    }

    get_json(url: string): Promise<DatamapResponse<MapObject | MapObject[]>> {
        throw new Error("Called empty function from " + url);
    }
}

describe("Datamap", () => {
    test("Create map", async () => {
        const mockedClient = getMockedHttpClientForPOSTWith({
            success: true,
            data: {
                mapId: "dm_map_6554ddab8b9fc8.15595444",
                displayUrl: "/api/display/dm_map_6554ddab8b9fc8.15595444",
            },
            error_code: 200,
            message: "",
        });
        const datamap = new Datamap(mockedClient);
        const createResponse = await datamap.create(getDefaultMap());

        expect(mockedClient.post_json).toHaveBeenCalledWith(
            "https://accidentprediction.fr/datamaps/api/create",
            JSON.stringify(getDefaultMap()),
        );

        expect(createResponse.mapId).toBe("dm_map_6554ddab8b9fc8.15595444");
        expect(createResponse.displayUrl).toBe(
            "/api/display/dm_map_6554ddab8b9fc8.15595444",
        );
    });

    test("Display map", async () => {
        const mockedClient = getMockedHttpClientForGETWith(
            getDefaultResponseWith(getDefaultMap()),
        );
        const datamap = new Datamap(mockedClient);
        const map: MapDTO = await datamap.display(
            "dm_map_6554ddab8b9fc8.15595444",
        );

        expect(mockedClient.get_json).toHaveBeenCalledWith(
            "https://accidentprediction.fr/datamaps/api/display/dm_map_6554ddab8b9fc8.15595444",
        );

        expect(map).toBeInstanceOf(MapDTO);

        const expectedMap = getDefaultMapDTO();
        expect(map).toStrictEqual(expectedMap);
    });

    test("Search 1 map", async () => {
        const mockedClient = getMockedHttpClientForGETWith(
            getDefaultResponseWith([getDefaultMap()]),
        );

        const datamap = new Datamap(mockedClient);
        const maps: MapDTO[] = await datamap.search(1);

        expect(mockedClient.get_json).toHaveBeenCalledWith(
            "https://accidentprediction.fr/datamaps/api/search/1",
        );

        expect(maps).toHaveLength(1);
        expect(maps[0]).toBeInstanceOf(MapDTO);

        const expectedMap = getDefaultMapDTO();
        expect(maps[0]).toStrictEqual(expectedMap);
    });

    test("Search 3 maps", async () => {
        const mockedClient = getMockedHttpClientForGETWith(
            getDefaultResponseWith([
                getDefaultMap(),
                getDefaultMap(),
                getDefaultMap(),
            ]),
        );

        const datamap = new Datamap(mockedClient);
        const maps: MapDTO[] = await datamap.search(3);

        expect(mockedClient.get_json).toHaveBeenCalledWith(
            "https://accidentprediction.fr/datamaps/api/search/3",
        );

        expect(maps).toHaveLength(3);
    });

    function getDefaultResponseWith(
        data: MapObject | MapObject[],
    ): DatamapResponse<MapObject | MapObject[]> {
        return {
            success: true,
            data: data,
            error_code: 200,
            message: "",
        };
    }

    function getDefaultMap(): MapObject {
        return {
            mapId: "dm_map_6554ddab8b9fc8.15595444",
            bounds: [
                [1, 2],
                [3, 4],
            ],
            createdAt: "2023-11-15T16:18:12",
            layers: [
                {
                    name: "accident",
                    markers: [
                        {
                            point: [49.003, 2.537],
                            description:
                                "Accident qui aurait lieu entre 16h et 17h",
                            color: "red",
                        },
                    ],
                },
            ],
        } as MapObject;
    }

    function getDefaultMapDTO(): MapDTO {
        return MapDTO.createFromObject(getDefaultMap());
    }

    function getMockedHttpClientForGETWith(
        valueToReturn: DatamapResponse<MapObject | MapObject[]>,
    ): FakeHttpClient {
        const mockedClient = new FakeHttpClient();
        jest.spyOn(mockedClient, "get_json").mockReturnValue(
            Promise.resolve(valueToReturn),
        );
        return mockedClient;
    }

    function getMockedHttpClientForPOSTWith(
        valueToReturn: DatamapResponse<{ mapId: string; displayUrl: string }>,
    ): FakeHttpClient {
        const mockedClient = new FakeHttpClient();
        jest.spyOn(mockedClient, "post_json").mockReturnValue(
            Promise.resolve(valueToReturn),
        );
        return mockedClient;
    }
});
