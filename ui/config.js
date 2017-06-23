let expiredDate = new Date()
expiredDate.setMonth((new Date).getMonth() + 3)

module.exports = {
    webPackHost: '127.0.0.1',
    webPackDevServPort: 8080,
    apiHost: '172.17.9.94',
    apiPort: 60001,
    apiDevHost: '172.17.9.94',
    apiDevPort: 60001,
    tokenName: 'c_user',
    tokenPath: '/',
    tokenExpired: expiredDate
}
