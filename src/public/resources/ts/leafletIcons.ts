import L from "leaflet";

const ICON_SIZE: [number, number] = [48, 48];
const ICON_POINTED_POINT: [number, number] = [
    ICON_SIZE[0] / 2, 
    ICON_SIZE[1]
];
const ICON_POPUP_POINT: [number, number] = [
    0, 
    - ICON_SIZE[1] * 2 / 3
];

function createIcon(color: string)
{
    return L.icon({
        iconUrl: "/static/images/" + color + ".png",
        iconSize: ICON_SIZE,
        iconAnchor: ICON_POINTED_POINT,
        popupAnchor: ICON_POPUP_POINT,
    });
}

export const ICONS: {[key: string]: L.Icon} = {
    "blue": createIcon("blue"),
    "red": createIcon("red"),
    "green": createIcon("green"),
};