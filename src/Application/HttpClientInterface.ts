import DatamapsResponse, { GetRequestData, PostRequestData } from "./DatamapsResponse";

export default interface HttpClientInterface {
    post_json(
        url: string,
        json: string,
    ): Promise<DatamapsResponse<PostRequestData>>;

    get_json(url: string): Promise<DatamapsResponse<GetRequestData>>;
}
