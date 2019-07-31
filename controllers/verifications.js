exports.verifyHeader = function(header) {
    for(let i=0 ; i<4 ; i++) {
        if(header[i] != 255) 
            return false
    }
    return true
}

exports.verifyFooter = function(footer) {
    if(footer != 0)
        return false
    
    return true
}