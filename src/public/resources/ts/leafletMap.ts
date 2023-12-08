import L from "leaflet";
import "leaflet.markercluster";
import LayerDTO from "src/Domain/Model/DataMap/LayerDTO";
import MarkerDTO from "src/Domain/Model/DataMap/MarkerDTO";
import IMap, { Bounds } from "./IMap";

const ICON_SIZE: [number, number] = [48, 48];
const ICON_POINTED_POINT: [number, number] = [
    ICON_SIZE[0] / 2, 
    ICON_SIZE[1]
];
const ICON_POPUP_POINT: [number, number] = [
    0, 
    - ICON_SIZE[1] * 2 / 3
];
export const ICONS: {[key: string]: L.Icon} = {
    "blue": createIcon("blue"),
    "red": createIcon("red"),
    "green": createIcon("green"),
};
function createIcon(color: string)
{
    return L.icon({
        iconUrl: "/static/images/" + color + ".png",
        iconSize: ICON_SIZE,
        iconAnchor: ICON_POINTED_POINT,
        popupAnchor: ICON_POPUP_POINT,
    });
}

export default class LeafletMap implements IMap {
    private map: L.Map;
    private controlLayers: L.Control.Layers|undefined = undefined;

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

    public centerMapOn(point: L.LatLng): L.LatLng {
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

    public getTileLayerFromMap(): L.TileLayer {
        let layer: L.TileLayer | null = null;

        this.map.eachLayer((l) => {
            if (l instanceof L.TileLayer) { layer = l; }
        });

        if (layer === null) {
            throw new Error("There are no tile layer in map");
        }
        
        return layer;
    }

    public addLayers(layers: LayerDTO[]): void {
        const llayers = this.createLayersAs(layers);
        Object.values(llayers)[0].addTo(this.map);
        this.controlLayers = L.control.layers(undefined, llayers).addTo(this.map);
    }

    public getLayers(): L.Layer[] {
        const llayers: L.Layer[] = [];

        this.map.eachLayer(layer => {
            llayers.push(layer);
        });

        return llayers;
    }

    public getLayersControl(): L.Control.Layers | undefined {
        return this.controlLayers;
    }

    public createLayersAs(layers: LayerDTO[]): {[name: string]: L.LayerGroup} {
        const llayers: {[name: string]: L.LayerGroup} = {};

        layers.forEach(layer => {
            const l = L.layerGroup(this.createMarkersAs(layer.markers));
            llayers[layer.name] = l;
        });

        return llayers;
    }

    public createMarkersAs(markers: readonly MarkerDTO[]): L.Layer[] {
        const markersGroup = L.markerClusterGroup({
            iconCreateFunction: function () {
                return new L.DivIcon({
                    iconSize: new L.Point(0, 0),
                });
            },
        });
        const circlesGroup = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                return new L.DivIcon({
                    html: cluster.getChildCount().toString(),
                    className: "mycluster " + markers[0].color,
                    iconSize: new L.Point(40, 40),
                });
            },
        });

        markers.forEach((m) => {
            this.createMarkerFrom(m).addTo(markersGroup);
            this.createCircleFrom(m).addTo(circlesGroup);
        })

        return [markersGroup, circlesGroup];
    }

    public createMarkerFrom(marker: MarkerDTO): L.Marker {
        return L.marker(
            marker.point as [number, number], 
            {
                icon: ICONS[marker.color]
            })
            .bindPopup(marker.description);
    }

    public createCircleFrom(marker: MarkerDTO): L.CircleMarker {
        return L.circle(
            marker.point as [number, number], 
            {
                radius: 1000, 
                color: marker.color, 
                fillColor: marker.color
            })
            .bindPopup(marker.description);
    }

    public defineLegend(legend: string): void {
        this.createLeafletLegend(legend).addTo(this.map);
    }

    public createLeafletLegend(legendText: string): L.Control {
        const leafletLegend = new L.Control({ position: "bottomleft" });
        leafletLegend.onAdd = function () {
            var div = L.DomUtil.create("div", "legend");
            div.setAttribute("id", "no-margin");
            div.innerHTML = legendText;
            return div;
        };
        return leafletLegend;
    }

}
