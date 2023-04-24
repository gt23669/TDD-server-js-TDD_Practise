import express from 'express'
import { async } from 'regenerator-runtime'
import db from './db.js'

//start server
const app = express()

app.get('/users/:username', async (req, res) => {
    const { username } = req.params
    //wrap request with try catch to properly return 500 status
    try {
        const user = await db.getUserByUsername(username)
        res.json(user)
    } catch (error) {
        console.log(error.status);
        switch (error.status) {
            case 500:
                res.status(500).json('Internal Server Error')
                break;
            case 404:
                res.status(404).json()
                break;

            default:
                console.log('Default switch hit. Defaulting status to 500');
                res.status(500).json('Internal Server Error')
                break;
        }
    }
})

export { app }