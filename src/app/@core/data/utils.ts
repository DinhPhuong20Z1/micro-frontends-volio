export abstract class UtilsFunc {
    abstract secondsToUTCString(seconds: number): string;
    abstract secondsToLocalString(seconds: number): string;
    abstract dataBytesToString(bytes: number): string;
}
