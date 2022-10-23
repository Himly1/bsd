const cmd = require('node-cmd')

const {data, err, stderr} = cmd.runSync('wmic useraccount get name')
const pureUsernames = data.split('\n').reduce((rs, name) => {
    const pureName = name.replaceAll("\r", "").replaceAll("\n", "").replaceAll(" ", "")
    rs.push(pureName)
    return rs
}, [])
const validUsernames = pureUsernames.filter((name) => {
    const invalid = ['', 'Name', 'Administrator', 'DefaultAccount', 'Guest', 'WDAGUtilityAccount'].includes(name)
    return !invalid
})




