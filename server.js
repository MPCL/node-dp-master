const server = require('dgram').createSocket('udp4')

const getServers = require('./controllers/getServers')
const heartBeat = require('./controllers/heartBeat')
const infoResponse = require('./controllers/infoResponse')

const verifications = require('./controllers/verifications')
const ipBlocker = require('./controllers/ipBlocker')

const HEADER = Buffer.from('\xFF\xFF\xFF\xFF', 'ascii')

server.on('listening', () => {
    console.log(`Server is listening on: ${server.address().address}:${server.address().port}`)
})

server.on('message', (message, info) => {
    const IP = `${info.address}:${info.port}`
    console.log(IP, message.toString('ascii'));
    
    // verify request header.
    if(!verifications.verifyHeader(message.slice(0,4)) || !verifications.verifyFooter(message[message.length-1])){
        console.log('invalid header or footer!');
        // blocking address for avoid spamming
        ipBlocker(info.address)

        return
    }

    const request = message.slice(4, message.length-1).toString('ascii').split('\x0A')
    if(request[0].includes('getservers')) {
        getServers(request, info)
            .then(serversBuffer => {
                const response = Buffer.concat([HEADER, Buffer.from('getserversResponse', 'ascii'), serversBuffer, Buffer.from('\\EOT', 'ascii')])
                server.send(response, info.port, info.address)
            })
    }
    else if(request[0].includes('heartbeat')) {
        console.log('heartbeat request from: ' + IP);
        
        heartBeat(request, info)
            .then(challenge => {
                console.log(challenge)
                const response = Buffer.from('getinfo ' + challenge, 'ascii')
                server.send(Buffer.concat([HEADER, response]), info.port, info.address)
            })
    } 
    else if(request[0].includes('infoResponse')) {
        infoResponse(request, info)
    } 
    else {
        // blocking address for avoid spamming
        ipBlocker(info.address)
    }
})

server.bind(20810)
