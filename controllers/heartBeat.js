const DediServer = require('../models/Servers')

const servers = []

function createChallenge() {
    // TODO: some char filters needed
    // TODO: this alghorithm is shit! fix it.
    return Math.random().toString(36).substring(2,7)  
}

module.exports = function(message, info) {
    const challenge = createChallenge() // new challenge
    const newDediServer = new DediServer(info, challenge) // new empty server with challenge and address information
    
    // remove server from current address if exist!
    const servers = DediServer.getServers()
    for(let item of servers) {
        const [ip, port] = item.getAddress()
        if(ip == info.ip && port == info.port) {
            item.remove()            
            break
        }
    }

    return Promise.resolve(challenge) // return challenge
}