import { translate, changeWithCode, getCodeOfCurrentLanguage, tranlsateTheKeyWithValue } from './international/language'

const config = {
    parentPwd: null,
    qa: {
        'configQuestion1': null,
        'configQuestion2': null,
        'configQuestion3': null
    },
    timeRangesNotAllowToUseTheComputer: [

    ],
    language: 'cn',
    onlyWorkForTheUsers: [],
    usernames: [],
    choosedTimeZone: "",
    supported: false
}

export function isPwdSetUp() {
    return config.parentPwd !== null && config.parentPwd !== undefined
}

export function isCurrentOsSupported() {
    return config.supported
}

export function retriveParentPwd() {
    return config.parentPwd
}

export function retriveSecretQa() {
    return Object.entries(config.qa).reduce((rs, [key, value]) => {
        const question = translate(key)
        rs[question] = value
        return rs
    }, {})
}

export function retreiveTimeRanges() {
    return config.timeRangesNotAllowToUseTheComputer
}

export function retreiveUsernames() {
    return config.usernames
}

export function retreiveSelectedUsernames() {
    return config.onlyWorkForTheUsers
}

let callbackForCreateUser = null
export function retreiveFuncForCreateNewUser() {
    return async (name, pwd) => {
        if (typeof callbackForCreateUser === 'function') {
            await callbackForCreateUser(name, pwd).catch((err => {
                throw err
            })).then(() => {
                config.usernames.push(name)
                flush()
            }).catch((err) => {
                throw err
            })
        } else {
            console.error(`No callback of create user exists`)
            throw 'No callback for create user exists'
        }
    }
}

let refreshTimeZoneCallback = null
export function retrieveTheCallbackForRefreshTimeZone() {
    return refreshTimeZoneCallback
}

export function retrieveUserChoosedTimeZone() {
    return config.choosedTimeZone
}

export function resetUserChoosedTimeZone(timeZone) {
    config.choosedTimeZone = timeZone
    flush()
}

export function resetTimeRanges(ranges) {
    config.timeRangesNotAllowToUseTheComputer = ranges
    flush()
}

export function updateParentPwd(newPwd) {
    config.parentPwd = newPwd
    flush()
}

export function updateSecretQa(qa) {
    const newQa = Object.entries(qa).reduce((rs, [question, answer]) => {
        const key = tranlsateTheKeyWithValue(question)
        rs[key] = answer
        return rs
    }, {})
    config.qa = newQa
    flush()
}

export function resetOnlyWorkForTheUsers(usernames) {
    config.onlyWorkForTheUsers = usernames
    flush()
}

let callbackForWriteTheConfigToTheFile = null
export function flush() {
    //before flushing to the file change the question name first
    //save the language of use choosed to the configfile
    const lng = getCodeOfCurrentLanguage()
    config.language = lng

    callbackForWriteTheConfigToTheFile(config)
}

//before run the app should run the init function and pass the cfg 
export function init(cfg, callbackForSaveTheConfig, callbackOfCreateUser, refreshTimeZone) {
    changeWithCode(cfg.language)
    Object.keys(config).forEach((key) => {
        config[key] = cfg[key]
    })

    callbackForWriteTheConfigToTheFile = callbackForSaveTheConfig
    callbackForCreateUser = callbackOfCreateUser
    refreshTimeZoneCallback = refreshTimeZone
}