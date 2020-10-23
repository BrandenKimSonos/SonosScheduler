export interface PlaylistMetaData {
    playlistId: string;
    serviceId: string;
    name: string;
    type: string;
    objectId: string;
    options?: {}
}

export interface TrackMetaData {
    type: string;
    name: string;
    album: string;
    artist: string;
    serviceId: string;
    objectId: string;
    imageUrl: string;
    durationMillis: number;
}

export class Job {
    public jobId: string
    public positionMillis: number
    public previousPositionMillis: number
    public volume: number
    public playlistMetaData: PlaylistMetaData
    public trackMetaData?: TrackMetaData
    public weight: number

    constructor(jobId: string, positionMillis: number, previousPositionMillis: number, volume: number, playlistMetaData: PlaylistMetaData, weight: number = 1, trackMetaData?: TrackMetaData) {
        this.jobId = jobId
        this.positionMillis = positionMillis
        this.previousPositionMillis = previousPositionMillis
        this.volume = volume
        this.playlistMetaData = playlistMetaData
        this.trackMetaData = trackMetaData
        this.weight = weight
    }

    toJson(): string {
        return JSON.stringify(this)
    }
}