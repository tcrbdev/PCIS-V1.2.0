// ui/src/server/server.js
import express from 'express'
import ssr from './ssr'

const PORT = 8080
const app = express()

// โยน ssr ลงไปเป็น middleware ของ Express
app.use(ssr)

app.listen(PORT, error => {
    if (error) {
        console.error(error)
    } else {
        console.info(`==> Listening on port ${PORT}.`)
    }
})