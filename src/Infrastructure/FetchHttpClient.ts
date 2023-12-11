import DatamapsResponse, { GetRequestData, PostRequestData } from "src/Application/DatamapsResponse";
import HttpClientInterface from "src/Application/HttpClientInterface";

export default class FetchHttpClient implements HttpClientInterface {
    async post_json(
        url: string,
        json: string,
    ): Promise<DatamapsResponse<PostRequestData>> {
        const response = await fetch(url, {
            method: "POST",
            body: json,
        });
        return this.formatResponse(await response.json());
    }

    async get_json(
        url: string,
    ): Promise<DatamapsResponse<GetRequestData>> {
        const response = await fetch(url);
        return this.formatResponse(await response.json());
    }

    private formatResponse<T = {response: Boolean}>(response: DatamapsResponse<T>): DatamapsResponse<T> {
        if (response.success == true) {
            return response;
        } else {
            throw new Error(response.error_code + ": " + response.message);
        }
    }
}
