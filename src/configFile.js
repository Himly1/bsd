import { translate, change, currentLanguage } from './international/language'

const config = {
    parentPwd: null,
    qa: {
        'configQuestion1': null,
        'configQuestion2': null,
        'configQuestion3': null
    },
    timeRangesNotAllowToUseTheComputer: [

    ],
    language: '中文'
}

export function retriveParentPwd() {
    return config.parentPwd
}

export function retriveSecretQa() {
    return config.qa
}

export function addTimeRangeOfNotAllowToUseComputer([start, end]) {

}

export function removeTimeRangeOfNotAllowToUseComputer([start, end]) {

}

export function updateParentPwd(newPwd) {

}

export function updateSecretQa(question, answer) {

}

let callbackForWriteTheConfigToTheFile = null
export function flush() {
    //before flushing to the file change the question name first
    //save the language of use choosed to the configfile
    const lng = currentLanguage()
    config.language = lng


}

//before run the app should run the init function and pass the cfg 
export function init(cfg, callbackForSaveTheConfig) {
    const [_, renamedQa] = ['configQuestion1', 'configQuestion2', 'configQuestion3'].reduce((rs, internationalLanguageCode) => {
        const [nameHardCodedQa, nameTranslatedQa] = rs
        const theName = translate(internationalLanguageCode)
        const theAnswer = nameHardCodedQa[internationalLanguageCode]

        nameTranslatedQa[theName] = theAnswer
        rs[1] = nameTranslatedQa
        return rs
    }, [cfg.qa, {}])
    config.qa = renamedQa
    callbackForWriteTheConfigToTheFile = callbackForSaveTheConfig
    change(cfg.language)
}