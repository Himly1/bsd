
import { useReducer } from "react"
import Login from "./components/login"
import Logo from "./components/logo"
import MainPage from "./components/mainPage"
import ParentalSettings from "./components/parentalSetting"

import { isPwdSetUp, retriveParentPwd, retriveSecretQa, updateParentPwd, updateSecretQa, resetOnlyWorkForTheUsers, retreiveTimeRanges, retreiveFuncForCreateNewUser, resetTimeRanges, retreiveUsernames, retreiveSelectedUsernames, retrieveUserChoosedTimeZone, resetUserChoosedTimeZone, retrieveTheCallbackForRefreshTimeZone} from './configFile'
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
            return <ParentalSettings whenSettingsDone={(timezone, usernames, pwd, qa) => {
                resetUserChoosedTimeZone(timezone)
                resetOnlyWorkForTheUsers(usernames)
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
            }} lngOptions={getLanguageOptions()} userNames={retreiveUsernames()} selectedUsernames={retreiveSelectedUsernames()}
                createNewUser={retreiveFuncForCreateNewUser()}
                refreshTimeZoneAsync={retrieveTheCallbackForRefreshTimeZone()}
                userChoosedTimeZone={retrieveUserChoosedTimeZone()}
            />
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

    return <div style={{ 'height': '80%' }}>
        <div>
            <div className="logo mt-3">
                <Logo />
            </div>
        </div>
        {shouldRender()}
    </div >
}

export default App