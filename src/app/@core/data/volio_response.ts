export interface VolioResponse<T> {
    message: string;
    data?: T|any;
    status: number;
}
