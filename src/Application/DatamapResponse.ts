type DatamapResponse<T> = {
    success: boolean;
    data: T;
    error_code: number;
    message: string;
};

export default DatamapResponse;
