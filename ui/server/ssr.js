import React from 'react'
import { StaticRouter, RouterContext } from 'react-router'
import { renderToString } from 'react-dom/server'
import createMemoryHistory from 'history/createMemoryHistory'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from '../common_backends/store/configureStore'
import Root from '../common_backends/containers/Root'
import routes from '../common_backends/routes'

// แยกส่วนที่ใช้สร้าง HTML ออกมาเป็นฟังก์ชัน
// รับพารามิเตอร์หนึ่งตัวคือ HTML
const renderHtml = (html) => (`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PCIS</title>
    <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"></link>
    <link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' rel='stylesheet' integrity='sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN' crossorigin='anonymous'>
    <link href="/plugin/flaticon/flaticon.css" rel="stylesheet">
    <style>
        span.fa { font-family: FontAwesome !important; }
        i.flaticon, 
        i[class^="flaticon"],
        span.flaticon, 
        span[class^="flaticon"] { 
            font-family: Flaticon !important;
            font-weight: normal;
	        font-style: normal;
        }        
    </style>
</head>

<body>
    <div id="app">${html}</div>
    <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAUC1Wou6aP9PPGzh8vXMlCD_xKEh739JQ&libraries=geometry,drawing,places&language=th&sensor=true"></script>

</body>

</html>
`)

export default function (req, res) {

    const memoryHistory = createMemoryHistory(req.originalUrl)

    const store = configureStore(memoryHistory)

    const history = syncHistoryWithStore(memoryHistory, store)

    const context = {}
    const html = renderToString(
        <StaticRouter location={req.originalUrl} context={context}>
            <Root history={history} />
        </StaticRouter >
    )

    console.log(html)

    if (context.url) {
        res.writeHead(302, {
            Location: context.url
        })
        res.end()
    } else {
        res.write(renderHtml(html))
        res.end()
    }
}