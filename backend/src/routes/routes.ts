import { Router } from 'express'

import { getHelloWorldRouter } from './getHelloWorldRouter'
import { playlistRouter } from './playlistRouter'

export const routes = () => {
    const apiRouter = Router({ mergeParams: true })
    
    apiRouter.use('/', getHelloWorldRouter())

    apiRouter.use('/', playlistRouter())

    return apiRouter
}