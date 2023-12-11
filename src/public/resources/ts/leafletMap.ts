import L from "leaflet";
import "leaflet.markercluster";
import LayerDTO from "src/Domain/Model/DataMap/LayerDTO";
import MarkerDTO from "src/Domain/Model/DataMap/MarkerDTO";
import IMap, { Bounds } from "./IMap";
import { ICONS } from "./icons";

export default class LeafletMap implements IMap {
    private map: L.Map;
    private controlLayers: L.Control.Layers|undefined = undefined;

    public constructor() {
        this.map = L.map("map");
    }

    public getMap(): L.Map {
        return this.map;
    }

    public defineBounds(bounds: Bounds): void {
        this.map.fitBounds(bounds);
    }

    public getBounds(): L.LatLngBounds {
        return this.map.getBounds();
    }

    public defineMaxBounds(bounds: Bounds): void {
        this.map.setMaxBounds(bounds);
    }

    public getMapCenterWhenCenteredOn(point: L.LatLng): L.LatLng {
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
        if (Object.values(llayers).length > 0) {
            Object.values(llayers)[0].addTo(this.map);
        }
        this.controlLayers = L.control.layers(undefined, llayers).addTo(this.map);
    }

    public createLayersAs(layers: LayerDTO[]): {[name: string]: L.LayerGroup} {
        const llayers: {[name: string]: L.LayerGroup} = {};

        layers.forEach(layer => {
            const llayer = L.layerGroup(this.createMarkersAs(layer.markers));
            llayers[layer.name] = llayer;
        });

        return llayers;
    }

    public createMarkersAs(markers: readonly MarkerDTO[]): L.Layer[] {
        const markersGroup = L.markerClusterGroup(this.invisibleOptions());
        const circlesGroup = L.markerClusterGroup(this.visibleOptions(markers[0].color));

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

    public getLayers(): L.Layer[] {
        const llayers: L.Layer[] = [];
        this.map.eachLayer(l => { llayers.push(l); });
        return llayers;
    }

    public getLayersControl(): L.Control.Layers | undefined {
        return this.controlLayers;
    }

    public defineLegend(legend: string): void {
        const llegend = this.createLeafletLegend(legend)
        llegend.addTo(this.map);
    }

    public createLeafletLegend(legendText: string): L.Control {
        const leafletLegend = new L.Control({ position: "bottomleft" });
        leafletLegend.onAdd = function () {
            var div = L.DomUtil.create("div", "legend");
            div.innerHTML = legendText;
            return div;
        };
        return leafletLegend;
    }

    public getInvisibleClusterIcon(): L.DivIcon {
        return new L.DivIcon({iconSize: new L.Point(0, 0)});
    }

    public getVisibleClusterIcon(count: number, color: string): L.DivIcon {
        return new L.DivIcon({
            html: count.toString(),
            className: "mycluster " + color,
            iconSize: new L.Point(40, 40)
        });
    }
    public invisibleOptions(): { iconCreateFunction: (cluster: {getChildCount: Function}) => L.DivIcon } {
        return {
            iconCreateFunction: this.getInvisibleClusterIcon
        }
    }
    public visibleOptions(color: string): { iconCreateFunction: (cluster: {getChildCount: Function}) => L.DivIcon } {
        return {
            iconCreateFunction: (cluster: { getChildCount: Function }) => {
                return this.getVisibleClusterIcon(cluster.getChildCount(), color);
            }
        }
    }
}