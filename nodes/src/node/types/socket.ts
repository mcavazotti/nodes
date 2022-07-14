import { SocketType } from "./socket-types";

export interface Socket<T> {
    label: string;
    type: SocketType;
    uId?: string;
    conection: string | null;
    value?: T;
}