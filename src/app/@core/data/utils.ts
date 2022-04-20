export abstract class UtilsFunc {
    abstract secondsToUTCString(seconds: number): string;
    abstract secondsToLocalString(seconds: number): string;
    abstract dataTransferToString(bytes: number): string;
    abstract dataTransferFriendly(bytes: number): [number, string];
    abstract secondsToDurationString(seconds: number): string;
    abstract secondsToDurationFriendly(seconds: number): [number, string]
    abstract locationToFlagHTML(location, code: string): string
    abstract findLocations(code: string): {code: string, name: string, path: string}
}
