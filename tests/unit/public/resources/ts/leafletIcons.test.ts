/** @jest-environment @stryker-mutator/jest-runner/jest-env/jsdom */

import { ICONS } from "../../../../../src/public/resources/ts/leafletIcons";

describe("Leaflet icons", () => {
    test("Creation with correct data", () => {
        expect(ICONS["red"]).toBeDefined();
        expect(ICONS["red"].options.iconUrl).toContain("/images/red.png");
        expect(ICONS["red"].options.iconSize).toEqual([48, 48]);
        expect(ICONS["red"].options.iconAnchor).toEqual([24, 48]);
        expect(ICONS["red"].options.popupAnchor).toEqual([0, -32]);

        expect(ICONS["blue"]).toBeDefined();
        expect(ICONS["blue"].options.iconUrl).toContain("/images/blue.png");
        expect(ICONS["green"]).toBeDefined();
        expect(ICONS["green"].options.iconUrl).toContain("/images/green.png");
    });
});
