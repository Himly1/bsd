const cmd = require('child_process')
const iconv = require('iconv-lite')

function toCp936(buffer) {
    return iconv.decode(buffer, 'cp936')
}

function runSync(command) {
    try {
        const buffer = cmd.execSync(command)
        return {
            data: toCp936(buffer),
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: toCp936(error.stderr)
        }
    }
}

module.exports = {
    runSync
}