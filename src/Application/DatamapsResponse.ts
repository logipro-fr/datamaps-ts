import MapObject from "src/Domain/Model/DataMap/Types/MapObject";

type DatamapsResponse<T> = {
    success: boolean;
    data: T;
    error_code: number;
    message: string;
};

export type GetRequestData = MapObject | {maps: MapObject[]};
export type PostRequestData = { mapId: string; displayUrl: string };

export default DatamapsResponse;
