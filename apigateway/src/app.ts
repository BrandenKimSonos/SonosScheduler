import express, { Application, Request, Response, NextFunction } from 'express'
import bodyParser from "body-parser"
import cors from 'cors'

import { routes } from './routes/routes'

require('dotenv').config();

const corsOptions = {
    origin: 'http://localhost'
}

const app: Application = express()

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', routes())

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})