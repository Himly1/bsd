import cn from './cn.json'
import en from './en.json'


const nameCodeMapping = {}
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
Object.entries(lngs).reduce((lng) => {
    const [key, value] = lng
    nameCodeMapping[value.name] = key
})


let defaultCode = 'cn'

export function getLanguageOptions() {
    //set the codeNameMapping at sametime
    return Object.entries(lngs).reduce((rs, entry) => {
        const [key, value] = entry
        //set codeNameMapping
        nameCodeMapping[value.name] = key
        rs.push(value.name)
        return rs
    }, [])
}

//Dont forget to rerender the language settings page
export function change(name) {
    defaultCode = nameCodeMapping[name]
}

export function translate(key) {
    return lngs[defaultCode].languages[key]
}

export function currentLanguage() {
    return lngs[defaultCode].name
}