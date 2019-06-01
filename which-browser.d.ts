declare module "which-browser" {
  export interface WhichBrowserDetails {
    toString(): string;
    getName(): string;
    getVersion(): string;
    name: string;
    version: WhichBrowserVersion;
  }
  export interface WhichBrowserVersion {
    value: string | number;
    alias: string;
    details: number;
    toString(): string;
    is(version: string | number): string;
    is(comparison: string, version: string | number): string;
  }
  export interface WhichBrowserFamily {
    name: string;
    version: string;
    getName(): string;
    getVersion(): string;
    toString(): string;
  }
  export interface WhichBrowserUsing {
    name: string;
    version: string;
    getName(): string;
    getVersion(): string;
    toString(): string;
  }

  export interface WhichBrowserBrowser extends WhichBrowserDetails {
    alias: string;
    stock: boolean;
    channel: string;
    mode?: string;
    hidden?: boolean;
    family: WhichBrowserFamily;
    using: WhichBrowserUsing;
    isFamily(name: string): boolean;
    isUsing(name: string): boolean;
  }
  export interface WhichBrowserOS extends WhichBrowserDetails {
    family: WhichBrowserFamily;
    isFamily(name: string): boolean;
  }
  export type WhichBrowserDeviceType = "desktop" | "mobile" | "tablet" | "gaming" | "headset" | "ereader" | "media" | "emulator" | "television" | "monitor" | "camera" | "signage" | "whiteboard" | "car" | "pos" | "bot";
  export type WhichBrowserDeviceSubType = "feature" | "smart" | "console" | "portable";
  export interface WhichBrowserDevice {
    type: WhichBrowserDeviceType;
    subtype: WhichBrowserDeviceSubType;
    identified: boolean;
    manufacturer: string;
    model: string;
    getManufacturer(): string;
    getModel(): string;
    toString(): string;
  }

  export interface WhichBrowserOptions {
    detectBots?: boolean;
    cache?: any;
    cacheExpires?: number;
    cacheCheckInterval?: number;
  }

  export default class WhichBrowser {
    constructor(userAgentString: string | any, options?: WhichBrowserOptions);

    browser: WhichBrowserBrowser;
    engine: WhichBrowserDetails;
    os: WhichBrowserOS;
    device: WhichBrowserDevice;

    toString(): string;
    isType(...args: string[]): boolean;
    isBrowser(name: string, comparison?: string, version?: string | number): boolean;
    isOs(name: string, comparison?: string, version?: string | number): boolean;
    isEngine(name: string, comparison?: string, version?: string | number): boolean;
    getType(): string;
    isMobile(): boolean;
    isDetected(): boolean;
  }
}
