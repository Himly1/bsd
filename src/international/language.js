import cn from './cn.json'
import en from './en.json'


let nameCodeMapping = null
const lngs = {
    'cn': {
        name: '中文',
        languages: cn
    },
    'en': {
        name: 'English',
        languages: en
    }
}

function initTheNameCodeMapping() {
    const mapping = Object.entries(lngs).reduce((rs, [key, value]) => {
        rs[value.name] = key
        return rs
    }, {})
    nameCodeMapping = mapping
}

let defaultCode = 'cn'
export function getLanguageOptions() {
    return Object.entries(lngs).reduce((rs, entry) => {
        const [_, value] = entry
        rs.push(value.name)
        return rs
    }, [])
}

function NoSuchLanguageException(message) {
    this.message = message
    this.name = 'NoSuchLanguageException'
}

export function getLanguageCodeByName(name) {
    const code = nameCodeMapping[name]
    if (code == null || code == undefined) {
        throw NoSuchLanguageException(name)
    }

    return code
}

function change(code) {
    defaultCode = code
}

export function changeWithName(name) {
    const code = getLanguageCodeByName(name)
    change(code)
}

export function changeWithCode(code) {
    const exists = Object.keys(lngs).includes(code)
    if (!exists) {
        throw NoSuchLanguageException('' + code)
    }

    change(code)
}

export function translate(key) {
    return lngs[defaultCode].languages[key]
}

export function tranlsateTheKeyWithValue(value) {
    const [key, _] = Object.entries(lngs[defaultCode].languages).find(([_, v]) => {
        return v === value
    })

    return key
}

export function getCodeOfCurrentLanguage() {
    return defaultCode
}


export function getNameOfCurrentLng() {
    return lngs[defaultCode].name
}

export function init() {
    initTheNameCodeMapping()
}