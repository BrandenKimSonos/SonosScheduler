import { Application } from "express"
export type RoutesInput = {
  app: Application,
}

export interface PlaylistBody {
    playlistId: string;
    name: string;
    objectId: string;
    volume: number;
    weight: number;
}