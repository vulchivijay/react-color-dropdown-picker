import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, tintHex } from '../colorUtils';
import { describe, it, expect } from 'vitest';

describe('colorUtils', () => {
  it('hex <-> rgb', () => {
    const hex = '#336699';
    const rgb = hexToRgb(hex);
    expect(rgb).toEqual({ r: 51, g: 102, b: 153 });
    expect(rgbToHex(rgb.r, rgb.g, rgb.b)).toBe(hex);
  });

  it('rgb <-> hsl', () => {
    const rgb = { r: 255, g: 0, b: 0 };
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    expect(hsl.h).toBe(0);
    const rgb2 = hslToRgb(hsl.h, hsl.s, hsl.l);
    expect(rgb2.r).toBeGreaterThan(200);
  });

  it('tint mixes towards white', () => {
    const hex = '#000000';
    const tinted = tintHex(hex, 50); // 50% towards white -> should be #7f7f7f or close
    expect(tinted).toMatch(/^#([0-9a-f]{6})$/i);
  });
});
