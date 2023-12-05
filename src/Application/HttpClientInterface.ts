import DatamapResponse from "./DatamapResponse";
import MapObject from "../Domain/Model/DataMap/Types/MapObject";

export default interface HttpClientInterface {
    post_json(
        url: string,
        json: string,
    ): Promise<DatamapResponse<{ mapId: string; displayUrl: string }>>;

    get_json(url: string): Promise<DatamapResponse<MapObject | MapObject[]>>;
}
