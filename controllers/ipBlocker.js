const fs = require('fs')
const cmd = require('node-cmd')

module.exports = function(ip) {
    const command = String.raw`netsh advfirewall firewall add rule name="DPblock_${ip}" dir=in interface=any action=block remoteip=${ip}/32`
    cmd.run(command)

    try {
        fs.appendFileSync('Logs/BlockedIPs.txt' ,`${ip}\n`)
    } catch (error) {
        fs.writeFileSync('Logs/BlockedIPs.txt' ,`${ip}\n`)
    }
}