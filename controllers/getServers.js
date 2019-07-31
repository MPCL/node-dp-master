const DediServer = require('../models/Servers')

module.exports = function(message, info) {
    const servers = DediServer.getServers()
    let response = Buffer.from([])
    
    for(let item of servers) {
        const [ip, port] = item.getAddress()
        const addressArray = []
        
        for(const part of ip.split('.')) {
            addressArray.push(Number(part))
        }

        addressArray.push(parseInt(port/256), port % 256)
        
        response = Buffer.concat([response, Buffer.from('\\'), Buffer.from(addressArray)])
    }
    console.log(`Online Servers: ${servers.length}`);
    
    return Promise.resolve(response)
}