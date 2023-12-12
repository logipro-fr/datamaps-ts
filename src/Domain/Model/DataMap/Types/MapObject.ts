type MapObject = {
    mapId: string;
    bounds: [[number, number], [number, number]];
    createdAt: string;
    layers: {
        name: string;
        markers: {
            point: [number, number];
            description: string;
            color: string;
        }[];
    }[];
};

export default MapObject;
