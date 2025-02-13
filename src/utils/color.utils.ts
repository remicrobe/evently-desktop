export class ColorUtils {
    static hexToHSL(hex: string): { h: number, s: number, l: number } {
        let r = parseInt(hex.substring(1, 3), 16) / 255;
        let g = parseInt(hex.substring(3, 5), 16) / 255;
        let b = parseInt(hex.substring(5, 7), 16) / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h: number, s: number, l: number = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                default: h = 0; break;
            }
            h /= 6;
        }
        return { h: h * 360, s, l };
    }

    static hslToHex(h: number, s: number, l: number): string {
        let r: number, g: number, b: number;

        function hueToRGB(p: number, q: number, t: number): number {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        if (s === 0) {
            r = g = b = l;
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hueToRGB(p, q, h / 360 + 1/3);
            g = hueToRGB(p, q, h / 360);
            b = hueToRGB(p, q, h / 360 - 1/3);
        }

        function toHex(x: number): string {
            let hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    static adjustLightness(hex: string, percent: number): string {
        let hsl = this.hexToHSL(hex);
        hsl.l = Math.min(1, Math.max(0, hsl.l + percent / 100));
        return this.hslToHex(hsl.h, hsl.s, hsl.l);
    }
}
