import HttpClientInterface from "src/Application/HttpClientInterface";
import DatamapResponse from "src/Application/DatamapResponse";
import MapObject from "src/Domain/Model/DataMap/Types/MapObject";

export default class FetchHttpClient implements HttpClientInterface {
    async post_json(
        url: string,
        json: string,
    ): Promise<DatamapResponse<{ mapId: string; displayUrl: string }>> {
        const response = await fetch(url, {
            method: "POST",
            body: json,
        });
        return this.formatResponse(await response.json());
    }

    async get_json(
        url: string,
    ): Promise<DatamapResponse<MapObject | {maps: MapObject[]}>> {
        const response = await fetch(url);
        return this.formatResponse(await response.json());
    }

    private formatResponse<T = {response: Boolean}>(response: DatamapResponse<T>): DatamapResponse<T> {
        if (response.success == true) {
            return response;
        } else {
            throw new Error(response.error_code + ": " + response.message);
        }
    }
}
