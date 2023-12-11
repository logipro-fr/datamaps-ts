import HttpClientInterface from "./HttpClientInterface";
import MapDTO from "../Domain/Model/DataMap/MapDTO";
import DatamapsResponse, { GetRequestData, PostRequestData } from "./DatamapsResponse";
import MapObject from "../Domain/Model/DataMap/Types/MapObject";

export default class Datamap {
    private client: HttpClientInterface;

    private DATAMAPS_URL: string = "https://accidentprediction.fr/datamaps/api/v1/";

    public constructor(client: HttpClientInterface) {
        this.client = client;
    }

    public async create(mapData: MapObject
    ): Promise<PostRequestData> {
        const url = this.DATAMAPS_URL + "create";
        return (await this.RestAPIPostAt(url, mapData)).data;
    }

    public async display(mapId: string): Promise<MapDTO> {
        const url = this.DATAMAPS_URL + "display/" + mapId;
        const map: MapDTO = MapDTO.createFromObject(
            (await this.RestAPIGetAt(url)).data as MapObject,
        );
        return map;
    }

    public async search(count: number): Promise<MapDTO[]> {
        const url = this.DATAMAPS_URL + "search/" + count.toString();
        const mapsData: MapObject[] = ((await this.RestAPIGetAt(url))
            .data as {maps: MapObject[]}).maps;
        const maps: MapDTO[] = mapsData.map((map) => {
            return MapDTO.createFromObject(map);
        });
        return maps;
    }

    private async RestAPIGetAt(
        url: string,
    ): Promise<DatamapsResponse<GetRequestData>> {
        const response = await this.client.get_json(url);
        return response;
    }

    private async RestAPIPostAt(
        url: string,
        json: MapObject,
    ): Promise<DatamapsResponse<PostRequestData>> {
        const response = await this.client.post_json(url, JSON.stringify(json));
        return response;
    }
}
