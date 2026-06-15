import { describe, expect, it } from "vitest";
import {
  DEFAULT_PIXEL_LEGEND_2025,
  DEFAULT_PIXEL_LEGEND_2026,
  getDefaultLegendForYear,
  getPixelBand,
  resolvePixelLegend,
} from "@/lib/pixelLegends";

describe("pixelLegends", () => {
  it("usa leyenda 2026 por defecto para ese año", () => {
    const legend = getDefaultLegendForYear(2026);
    expect(legend[0].label).toBe("01-04");
    expect(legend[legend.length - 1].label).toBe("+140");
  });

  it("usa leyenda 2025 para otros años", () => {
    const legend = getDefaultLegendForYear(2025);
    expect(legend[0].label).toBe(DEFAULT_PIXEL_LEGEND_2025[0].label);
  });

  it("resuelve leyenda personalizada guardada", () => {
    const custom = [{ min: 1, max: 50, label: "1-50", color: "#ffffff" }];
    const resolved = resolvePixelLegend({ 2027: custom }, 2027);
    expect(resolved).toEqual(custom);
  });

  it("asigna color según páginas", () => {
    const band = getPixelBand(3, DEFAULT_PIXEL_LEGEND_2026);
    expect(band?.label).toBe("01-04");
    const high = getPixelBand(200, DEFAULT_PIXEL_LEGEND_2026);
    expect(high?.label).toBe("+140");
  });
});
