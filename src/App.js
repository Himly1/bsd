
import { useEffect, useReducer } from "react"
import Login from "./components/login"
import Logo from "./components/logo"
import MainPage from "./components/mainPage"
import ParentalSettings from "./components/parentalSetting"

import { isPwdSetUp, retriveParentPwd, retriveSecretQa, updateParentPwd, updateSecretQa, retreiveTimeRanges, resetTimeRanges } from './configFile'
import { getLanguageOptions, changeWithName } from './international/language'



function App() {
    const [state, setState] = useReducer((p, n) => ({ ...p, ...n }), {
        randomValuePresentChange: false,
        pwdSetUp: isPwdSetUp(),
        loginSuccess: false
    })

    const onConditionDisplay = [
        [() => {
            return !state.pwdSetUp
        }, () => {
            return <ParentalSettings whenSettingsDone={(pwd, qa) => {
                updateParentPwd(pwd)
                updateSecretQa(qa)
                setState({
                    randomValuePresentChange: !state.randomValuePresentChange,
                    pwdSetUp: true
                })
            }} defaultQa={retriveSecretQa()} defaultPwd={retriveParentPwd()} onLanguageChange={(lng) => {
                changeWithName(lng)
                state.randomValuePresentChange = !state.randomValuePresentChange
                setState(state)
            }} lngOptions={getLanguageOptions()} />
        }],
        [() => {
            return state.pwdSetUp && !state.loginSuccess
        }, () => {
            return <Login pwd={retriveParentPwd()} qa={retriveSecretQa()} onPwdChange={(pwd) => {
                updateParentPwd(pwd)
            }} onSuccess={() => {
                state.loginSuccess = true
                setState(state)
            }} />
        }],
        [() => {
            return state.pwdSetUp && state.loginSuccess
        }, () => {
            return <MainPage defaultTimeRanges={retreiveTimeRanges()} whenTimeRangesReset={(timeRanges) => {
                resetTimeRanges(timeRanges)
            }} whenParentalSettingClicked={() => {
                state.pwdSetUp = false
                setState(state)
            }} />
        }]
    ]

    const shouldRender = onConditionDisplay.find(([test, _]) => {
        return test()
    })[1]

    return <div style={{ 'height': '90%' }}>
        <div>
            <div className="logo mt-3">
                <Logo />
            </div>
        </div>
        {shouldRender()}
    </div >
}

export default App