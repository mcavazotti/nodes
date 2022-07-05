import { SocketType } from "./socket-types.js";

export interface Socket {
    label: string;
    type: SocketType;
    uId?: string;
    conection: string | null;
}