import axios from 'axios'

export function saveConfigFile(config) {
    try {
        axios.put('http://localhost:8888/config', config).then(response => {
            if (response.status !== 200) {
                throw response.data
            }
        })
    } catch (e) {
        console.error(`Error occrred while saving the config file: ${e}`)
        throw e
    }
}

export function createNewUser(username, pwd) {
    try {
        axios.post('http://localhost:8888/users', {
            username: username,
            pwd: pwd
        }).then((response) => {
            if (response.status !== 200) {
                throw response.data
            }
        })
    } catch (e) {
        console.error(`Error occrred while creating new user. ${e}`)
        throw e
    }
}

async function fetchTheConfig() {
    return await axios.get('http://localhost:8888/config').then((response) => {
        console.log(`The response is ${JSON.stringify(response.data)}`)
        if (response.status !== 200) {
            throw response.data
        } else {
            return response.data
        }
    })
}

export function getConfigFile() {
    try {
        return fetchTheConfig()
    } catch (e) {
        console.error(`err occurred while fetching the config file. ${e}`)
        throw e
    }
}