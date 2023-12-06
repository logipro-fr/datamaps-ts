import L, { LatLng, LatLngBounds } from "leaflet";

export default class LeafletMap {
    private map: L.Map;

    public constructor() {
        this.map = L.map("map");
    }

    public defineBounds(bounds: Array<Array<number>>): void {
        const lboundSouthWest = new LatLng(bounds[0][0], bounds[0][1]);
        const lboundNorthEast = new LatLng(bounds[1][0], bounds[1][1]);
        const lbounds = new LatLngBounds(lboundSouthWest, lboundNorthEast);
        this.map.fitBounds(lbounds);
    }

    public getBounds(): Array<Array<number>> {
        const boundSouthWest: Array<number> = [
            this.map.getBounds().getSouthWest().lat,
            this.map.getBounds().getSouthWest().lng,
        ];
        const boundNorthEast: Array<number> = [
            this.map.getBounds().getNorthEast().lat,
            this.map.getBounds().getNorthEast().lng,
        ];
        return [boundSouthWest, boundNorthEast];
    }
}
