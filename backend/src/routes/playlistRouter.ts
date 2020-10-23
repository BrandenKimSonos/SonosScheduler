import { Router } from 'express'

import {
    loadPlaylist, playlistInfoController,
    seek, play, pause, addPlaylist,
    currentPlaylist, skip, switchPlaylists, switchWRRPlaylists
} from '../controllers/playListController'

export const playlistRouter = () => {
    const router = Router({ mergeParams: true })

    // router.get('/playlistinfo', playlistInfoController)

    router.get('/currentPlaylist', currentPlaylist)
    router.get('/loadPlaylist', loadPlaylist)
    router.post('/addPlaylist', addPlaylist)
    router.post('/switch', switchPlaylists)
    router.post('/switchWRR', switchWRRPlaylists)
    router.post('/seek', seek)
    router.post('/play', play)
    router.post('/pause', pause)
    router.post('/skip', skip)

    return router
}