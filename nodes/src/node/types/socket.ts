import { SocketType } from "./socket-types.js";

export interface Socket<T> {
    label: string;
    type: SocketType;
    uId?: string;
    conection: string | null;
    value?: T;
}