import express, { Request, Response, Router } from 'express'

import { schedulerRouter } from './schedulerRouter'

export const routes = () => {
    const apiRouter = Router({ mergeParams: true })

    apiRouter.use('/scheduler', schedulerRouter())

    return apiRouter
}