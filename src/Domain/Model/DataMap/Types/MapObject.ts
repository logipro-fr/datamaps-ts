type MapObject = {
    mapId: string;
    bounds: number[][];
    createdAt: string;
    layers: {
        name: string;
        markers: {
            point: number[];
            description: string;
            color: string;
        }[];
    }[];
};

export default MapObject;
