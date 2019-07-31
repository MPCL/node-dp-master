const DediServer = require('../models/Servers')

module.exports = function(request, info) {
    const unkownServers = [...DediServer.getUnknownServers(), ...DediServer.getServers()]

    for(let item of unkownServers) {
        const [ip, port] = item.getAddress()
        if(info.address == ip && info.port == port) {
            item.handleInfoResponse(request[1])            
        }
    }
}