const servers = []
const unknownServers = []

module.exports = class {
    constructor(info, challenge) {
        this.status = { ...info}
        this.challenge = challenge

        // add server to unknown servers.
        unknownServers.push(this)
    }

    handleInfoResponse(response) {
        response.replace('\u0000', '')

        const tempArray = response.split('\\')
        for(let i=1 ; i < tempArray.length-1 ; i+=2)
            this.status[tempArray[i]] = tempArray[i+1]
        
        if(!this.status.challenge) {
            // TODO: nees to call ip block function.
            return
        }
        
        if(this.challenge == this.status.challenge) { 
            console.log('server added with: ', this.status)
            // setInterval(() => this.remove(), 60000)
            this.add()
        } else
            this.remove()

        // remove from unknown servers.
        unknownServers.splice(unknownServers.indexOf(this), 1)
    }

    getAddress() {
        return [this.status.address, this.status.port]
    }

    add() {
        servers.push(this)
    }

    // delet current server from server list.
    remove(){
        if(servers.includes(this))
            servers.splice(servers.indexOf(this), 1)
    }

    static getServers() {
        return servers
    }

    static getUnknownServers() {
        return unknownServers
    }
}