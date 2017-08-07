export default (app, jwt) => ((req, res, next) => {
    console.log(req.headers)
    const token = req.body.token || req.query.token || req.headers['x-access-token']

    if (req.url != '/authenticate') {
        if (token) {
            jwt.verify(token, app.get('skey'), (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    })
                }
                else {
                    req.decoded = decoded
                    next();
                }
            })
        }
        else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            })
        }
    }
    else {
        next()
    }
})