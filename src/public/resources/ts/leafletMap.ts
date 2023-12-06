import L, { LatLng } from "leaflet";

type Bounds = [[south: number, west: number], [north: number, east: number]];

export default class LeafletMap {
    private map: L.Map;

    public constructor() {
        this.map = L.map("map");
    }

    public defineBounds(bounds: Bounds): void {
        this.map.fitBounds(bounds);
    }

    public getBounds(): Bounds {
        const boundSouthWest: Bounds[0] = [
            this.map.getBounds().getSouth(),
            this.map.getBounds().getWest(),
        ];
        const boundNorthEast: Bounds[1] = [
            this.map.getBounds().getNorth(),
            this.map.getBounds().getEast(),
        ];
        return [boundSouthWest, boundNorthEast];
    }

    public defineMaxBounds(bounds: Bounds): void {
        this.map.setMaxBounds(bounds);
    }

    public centerMapOn(point: LatLng): LatLng {
        this.map.flyTo(point);
        return this.map.getCenter();
    }

    public setUpTiles(): void {
        const tiles = this.createTiles();
        tiles.addTo(this.map);
    }

    private createTiles(): L.TileLayer {
        return L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        });
    }

    public getTileLayerFromMap(): L.TileLayer | null {
        let layer: L.TileLayer | null = null;

        this.map.eachLayer((l) => {
            if (l instanceof L.TileLayer) {
                layer = l;
            }
        })

        return layer;
    }
}
