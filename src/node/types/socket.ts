import { SocketType } from "./socket-types";

export interface Socket<T> {
    label: string;
    type: SocketType;
    role: "input" | "output";
    uId?: string;
    conection: [string, SocketType] | null;
    value?: T;
}