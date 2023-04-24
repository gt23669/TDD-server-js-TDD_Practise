import express from 'express'
import { async } from 'regenerator-runtime'
import db from './db'

//start server
const app = express()

app.get('/users/:username', async (req, res) => {
    const { username } = req.params
    //wrap request with try catch to properly return 500 status
    try {
        const user = await db.getUserByUsername(username)
        res.json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

export { app }