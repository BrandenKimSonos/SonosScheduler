import { Router } from 'express'
import {
    loadPlaylistController, playController, pauseController, addPlaylistController, getCurrentPlaylist,
    skipController,
    switchPlaylists, switchWRRPlaylists
} from '../controllers/schedulerController'

export const schedulerRouter = () => {
    const router = Router()

    router.get('/loadPlaylist', loadPlaylistController)
    router.get('/getCurrentPlaylist', getCurrentPlaylist)
    router.post('/addPlaylist', addPlaylistController)
    router.post('/play', playController)
    router.post('/pause', pauseController)
    router.post('/skip', skipController)
    router.post('/switch', switchPlaylists)
    router.post('/switchWRR', switchWRRPlaylists)

    return router
}