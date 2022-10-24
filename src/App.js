
import { useReducer } from "react"
import LngOptions from "./components/languageOptions"
import Login from "./components/login"
import Logo from "./components/logo"
import MainPage from "./components/mainPage"
import NotSupported from "./components/notSupported"
import ParentalSettings from "./components/parentalSetting"
import ParentalSettingClickableButton from "./components/parentalSettingClickablebutton"

import { isPwdSetUp, retriveParentPwd, retriveSecretQa, updateParentPwd, updateSecretQa, resetOnlyWorkForTheUsers, retreiveTimeRanges, retreiveFuncForCreateNewUser, resetTimeRanges, retreiveUsernames, retreiveSelectedUsernames, retrieveUserChoosedTimeZone, resetUserChoosedTimeZone, retrieveTheCallbackForRefreshTimeZone, isCurrentOsSupported } from './configFile'
import { getLanguageOptions, changeWithName } from './international/language'



function App() {
    const [state, setState] = useReducer((p, n) => ({ ...p, ...n }), {
        randomValuePresentChange: false,
        pwdSetUp: isPwdSetUp(),
        loginSuccess: false,
        exporeThisApp: false
    })

    const onConditionDisplay = [
        [() => {
            return !isCurrentOsSupported() && !state.exporeThisApp
        }, () => {
            return <NotSupported whenUserWantToExporeThisApp={() => {
                setState({
                    exporeThisApp: true
                })
            }} />
        }],
        [() => {
            return !state.pwdSetUp
        }, () => {
            return <ParentalSettings whenSettingsDone={(timezone, usernames, pwd, qa) => {
                console.log(`The pwd is ${pwd}`)
                updateParentPwd(pwd)
                resetUserChoosedTimeZone(timezone)
                resetOnlyWorkForTheUsers(usernames)
                updateSecretQa(qa)
                setState({
                    randomValuePresentChange: !state.randomValuePresentChange,
                    pwdSetUp: true
                })
            }} defaultQa={retriveSecretQa()} defaultPwd={retriveParentPwd()} userNames={retreiveUsernames()} selectedUsernames={retreiveSelectedUsernames()}
                createNewUserAsync={retreiveFuncForCreateNewUser()}
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
            }} />
        }]
    ]

    const shouldRender = onConditionDisplay.find(([test, _]) => {
        return test()
    })[1]

    return <div style={{ 'height': '80%' }}>
        <div>
            <div className="level">
                <div className="level-item"></div>
                <div className="level-right">
                    {(state.pwdSetUp && state.loginSuccess) && <div className="level-item">
                        <ParentalSettingClickableButton onClicked={() => {
                            setState({
                                pwdSetUp: false
                            })
                        }} />
                    </div>
                    }

                    <div className="level-item">
                        <LngOptions whenLngChange={(lng) => {
                            changeWithName(lng)
                            state.randomValuePresentChange = !state.randomValuePresentChange
                            setState(state)
                        }} lngOptions={getLanguageOptions()}></LngOptions>
                    </div>
                </div>
            </div>
            <div className="logo mt-3">
                <Logo />
            </div>
        </div>
        {shouldRender()}
    </div >
}

export default App