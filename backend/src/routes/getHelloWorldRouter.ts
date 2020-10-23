import { Router } from 'express'

import { helloWorldController } from '../controllers/helloWorldController'

export const getHelloWorldRouter = () => {
    const router = Router({ mergeParams: true })

    router.get('/', helloWorldController)

    return router
}