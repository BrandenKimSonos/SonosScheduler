import express, { Request, Response } from 'express'

export async function helloWorldController(req: Request, res: Response): Promise < any > {
    res.send("Hello World from controller")
}