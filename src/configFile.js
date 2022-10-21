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
    timeZones: {},
    choosedTimeZone: ""
}

export function isPwdSetUp() {
    return config.parentPwd !== null && config.parentPwd !== undefined
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
    return (name, pwd) => {
        config.usernames.push(name)
        if (typeof callbackForCreateUser === 'function') {
            callbackForCreateUser(name, pwd)
        } else {
            console.error(`No callback of create user exists`)
            throw 'No callback for create user exists'
        }
    }
}

//The struct of the config.timeZones is {'name of the time zone': 'code of the timezone'}
export function retreiveTimezones() {
    const namesOfTimeZones = Object.keys(config.timeZones)
    return namesOfTimeZones
}

//the default time zone is code should return the name instead of code
export function retrieveUserChoosedTimeZone() {
    const [name, code] = Object.entries(config.timeZones).find(([name, code]) => {
        return code === config.choosedTimeZone
    })

    return name
}

export function resetUserChoosedTimeZone(timeZone) {
    const code = config.timeZones[timeZone]
    config.choosedTimeZone = code
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
export function init(cfg, callbackForSaveTheConfig, callbackOfCreateUser) {
    changeWithCode(cfg.language)
    Object.keys(config).forEach((key) => {
        config[key] = cfg[key]
    })

    callbackForWriteTheConfigToTheFile = callbackForSaveTheConfig
    callbackForCreateUser = callbackOfCreateUser
}