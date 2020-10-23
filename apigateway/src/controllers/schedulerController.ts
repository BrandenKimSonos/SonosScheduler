import { Request, Response } from 'express'
import { SchedulerApi } from '../apiConstructor/schedulerApi'
import { PlaylistBody } from '../types/playlistBody'

export async function loadPlaylistController(req: Request, res: Response) {
    const playlist = req.query.playlist
    const apiBase = new SchedulerApi<string>()

    try {
        let response = await apiBase.getRequest(`/loadPlaylist`)
        res.send(JSON.stringify(response))
    }
    catch (e) {
        console.log(e)
        res.send(`Something went wrong due to ${e}`)
    }
}

export async function addPlaylistController(req: Request, res: Response) {
    const data: PlaylistBody = req.body
    const apiBase = new SchedulerApi<string>()
    
    try {
        let response = await apiBase.postRequest('/addPlaylist', data)
        res.send(response)
    }
    catch (e) {
        console.log(e)
        res.send(`Something went wrong due to ${e}`)
    }
}

export async function playController(req: Request, res: Response) {
    const apiBase = new SchedulerApi<string>()

    try {
        let response = await apiBase.postRequest('/play')
        res.send(JSON.stringify(response))
    }
    catch (e) {
        console.log(e)
        res.send(`Something went wrong due to ${e}`)
    }
}

export async function pauseController(req: Request, res: Response) {
    const apiBase = new SchedulerApi<string>()

    try {
        let response = await apiBase.postRequest('/pause')
        res.send(JSON.stringify(response))
    }
    catch (e) {
        console.log(e)
        res.send(`Something went wrong due to ${e}`)
    }
}

export async function getCurrentPlaylist(req: Request, res: Response) {
    const apiBase = new SchedulerApi<string>()

    try {
        let response = await apiBase.getRequest('/currentPlaylist')
        res.send(JSON.stringify(response))
    }
    catch (e) {
        console.log(e)
        res.send(`Something went wrong due to ${e}`)
    }
}

export async function skipController(req: Request, res: Response) {
    const apiBase = new SchedulerApi<string>()

    try {
        let response = await apiBase.postRequest('/skip')
        res.send(JSON.stringify(response))
    }
    catch (e) {
        console.log(e)
        res.send(`Something went wrong due to ${e}`)
    }
}

export async function switchPlaylists(req: Request, res: Response) {
    const apiBase = new SchedulerApi<string>()

    try {
        let response = await apiBase.postRequest('/switch')
        res.send(JSON.stringify(response))
    }
    catch (e) {
        console.log(e)
        res.send(`Something went wrong due to ${e}`)
    }
}

export async function switchWRRPlaylists(req: Request, res: Response) {
    const apiBase = new SchedulerApi<string>()

    try {
        let response = await apiBase.postRequest('/switchWRR')
        res.send(JSON.stringify(response))
    }
    catch (e) {
        console.log(e)
        res.send(`Something went wrong due to ${e}`)
    }
}