import HttpClientInterface from "./HttpClientInterface";
import MapDTO from "../Domain/Model/DataMap/MapDTO";
import DatamapResponse from "./DatamapResponse";
import MapObject from "../Domain/Model/DataMap/Types/MapObject";

export default class Datamap {
    private client: HttpClientInterface;

    public constructor(client: HttpClientInterface) {
        this.client = client;
    }

    public async create(
        mapData: MapObject,
    ): Promise<{ mapId: string; displayUrl: string }> {
        const url = "https://accidentprediction.fr/datamaps/api/v1/create";
        return (await this.postObjectAtUrl(url, mapData)).data;
    }

    public async display(mapId: string): Promise<MapDTO> {
        const url =
            "https://accidentprediction.fr/datamaps/api/v1/display/" + mapId;
        const map: MapDTO = MapDTO.createFromObject(
            (await this.getJsonResponseFromUrl(url)).data as MapObject,
        );
        return map;
    }

    public async search(count: number): Promise<MapDTO[]> {
        const url =
            "https://accidentprediction.fr/datamaps/api/v1/search/" +
            count.toString();
        const mapsData: MapObject[] = ((await this.getJsonResponseFromUrl(url))
            .data as {maps: MapObject[]}).maps;
        const maps: MapDTO[] = mapsData.map((map) => {
            return MapDTO.createFromObject(map);
        });
        return maps;
    }

    private async getJsonResponseFromUrl(
        url: string,
    ): Promise<DatamapResponse<MapObject | {maps: MapObject[]}>> {
        const response = await this.client.get_json(url);
        return response;
    }

    private async postObjectAtUrl(
        url: string,
        json: MapObject,
    ): Promise<DatamapResponse<{ mapId: string; displayUrl: string }>> {
        const response = await this.client.post_json(url, JSON.stringify(json));
        return response;
    }
}
