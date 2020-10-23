import { Request, Response } from 'express'
import { connector } from '../connector/Connector'
import { chillSpotifyPlaylist, brockHamptonSpotifyPlaylist, avalanchesSpotifyPlaylist } from '../playbackContainers/playbackContainers'
import { PlaylistBody } from '../types/types'
import { Scheduler } from '../scheduler/scheduler'
import { Job } from '../scheduler/job'

let firstLoad = true

export async function loadPlaylist(req: Request, res: Response): Promise<any> {
    const playMusicBool = await connector.loadContainer(Scheduler.getInstance().getCurrentPlaylist(), firstLoad)
    if (firstLoad) {
        firstLoad = false
    }
    if (playMusicBool) {
        res.send('Playing the music was a success')
    }
    else {
        res.send('Playing the music was a failure')
    }

}

export async function switchPlaylists(req: Request, res: Response): Promise<any> {
    const switchPlaylistsBool = await connector.switchPlaylists(false)
    if (switchPlaylistsBool) {
        res.send('Playing the music was a success')
    }
    else {
        res.send('Playing the music was a failure')
    }
}

export async function switchWRRPlaylists(req: Request, res: Response): Promise<any> {
    const switchPlaylistsBool = await connector.switchPlaylists(true)
    if (switchPlaylistsBool) {
        res.send('Playing the music was a success')
    }
    else {
        res.send('Playing the music was a failure')
    }
}

export async function playlistInfoController(req: Request, res: Response): Promise<any> {
    const getInfoBool = await connector.getInfo()
    if (getInfoBool) {
        res.send("Info returned in console")
    }
    else {
        res.send("Info failed to be sent")
    }
}

export function addPlaylist(req: Request, res: Response): any {
    const data: PlaylistBody = req.body.data
    
    try {
        Scheduler.getInstance().addPlaylist(data)

        res.type('json')
            .status(200)
            .send('Successfully added playlist to the scheduler')
    }
    catch (e) {
        res.type('json')
            .status(500)
            .send(JSON.stringify(`Failed to add playlist due to ${e}`))
    }
}

export function currentPlaylist(req: Request, res: Response): any {
    try {
        const currentJob: Job | undefined = Scheduler.getInstance().getCurrentPlaylist()

        if (currentJob) {
            res.type('json')
                .status(200)
                .send('Successfully received current job from scheduler')
        }
        else {
            res.type('json')
                .status(500)
                .send('Failed to get current playlist since it is undefined')
        }
    }
    catch (e) {
        res.type('json')
            .status(500)
            .send(JSON.stringify(`Failed to get current playlist due to ${e}`))
    }
}

export async function seek(req: Request, res: Response): Promise<any> {
    const num: number = req.body.timestamp

    const seekBool = await connector.seek(num)
    if (seekBool) {
        res.send("Seek correctly worked")
    }
    else {
        res.send("Seek failed to work")
    }
}

export async function play(req: Request, res: Response): Promise<any> {
    try {
        const playBool = await connector.play()
        if (playBool) {
            res.type('json')
                .status(200)
                .send(JSON.stringify('Play correctly worked'))
        }
        else {
            res.type('json')
                .status(500)
                .send(JSON.stringify('Resuming play was unable to work'))
        }
    }
    catch (e) {
        res.type('json')
            .status(500)
            .send(JSON.stringify(`Playing failed due to ${e}`))
    }
}

export async function pause(req: Request, res: Response): Promise<any> {
    try {
        const pauseBool = await connector.pause()
        if (pauseBool) {
            res.type('json')
                .status(200)
                .send(JSON.stringify('Pause correctly worked'))
        }
        else {
            res.type('json')
                .status(500)
                .send(JSON.stringify('Pausing the music was unable to work'))
        }
    }
    catch (e) {
        res.type('json')
            .status(500)
            .send(JSON.stringify(`Pausing failed due to ${e}`))
    }
}

export async function skip(req: Request, res: Response): Promise<any> {
    try {
        const skipBool = await connector.skip()
        if (skipBool) {
            res.type('json')
                .status(200)
                .send(JSON.stringify('Skip correctly worked'))
        }
        else {
            res.type('json')
                .status(500)
                .send(JSON.stringify('Skipping the music was unable to work'))
        }
    }
    catch (e) {
        res.type('json')
            .status(500)
            .send(JSON.stringify(`Skip failed due to ${e}`))
    }
}