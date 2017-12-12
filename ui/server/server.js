import express from 'express'
import httpProxy from 'http-proxy'

import ssr from './ssr'
import config from '../config'

const PORT = config.ssrDevPort
const app = express()

const targetUrl = `http://127.0.0.1:${config.ssrApiDevPort}`
const proxy = httpProxy.createProxyServer({
    target: targetUrl
})

app.use('/api', (req, res) => {
    proxy.web(req, res, { target: `${targetUrl}/api` });
})

// โยน ssr ลงไปเป็น middleware ของ Express
app.use(ssr)

app.listen(PORT, error => {
    if (error) {
        console.error(error)
    } else {
        console.info(`==> Listening on port ${PORT}.`)
    }
})