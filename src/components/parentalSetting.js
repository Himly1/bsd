import React, { useReducer, useState, useEffect } from "react";
import { translate } from '../international/language'
import { parentalSettings } from '../international/keyRefs'

function PwdInput({ pwdUpdate, defaultPwd }) {

    function isThePwdOk(password) {
        return password !== null && password !== undefined && password.length >= 6
    }

    const [pwd, setPwd] = useState({ pwdOk: isThePwdOk(defaultPwd), pwd: defaultPwd })

    function pwdChange(e) {
        const password = e.target.value
        setPwd({ pwdOk: isThePwdOk(password), pwd: password })
    }

    return <div className="center" style={{ 'height': '90%' }}>
        <form class="box">
            <div class="field">
                <label class="label text-font text-color">{translate(parentalSettings.labelOfSettingPwd)}</label>
                <h2 className="heading text-color">{translate(parentalSettings.SettingPwdSubtitle)}</h2>
                <div class="control">
                    <input onChange={pwdChange} defaultValue={defaultPwd} class={pwd.pwdOk ? 'input is-success' : 'input is-danger'} type="password" />
                </div>
            </div>
            {pwd.pwdOk && <div className="field center">
                <button onClick={() => {
                    pwdUpdate(pwd.pwd)
                }} class="button is-primary">{translate(parentalSettings.pwdSettingNextStepButtonLabel)}</button>
            </div>}
        </form>
    </div>
}

function QaInput({ defaultQa, whenItDone }) {

    function isTheAnswerIsOk(answer) {
        return answer ? answer.length >= 2 : false
    }

    function isAllAnswerOk(qa) {
        return Object.entries(qa).every(([_, answer]) => {
            return isTheAnswerIsOk(answer)
        })
    }

    const defaultQuestion = Object.keys(defaultQa)[0]
    const answer = defaultQa[defaultQuestion]
    const [qa, setQa] = useReducer((p, n) => ({ ...p, ...n }), {
        currentQuestion: defaultQuestion,
        answer: answer ? answer : "",
        userQa: defaultQa,
        allAnswerIsOk: isAllAnswerOk(defaultQa),
        currentAnswerIsOk: answer ? answer.length >= 2 : false
    })

    useEffect(() => {
        const defaultQuestions = Object.keys(defaultQa)
        const questionsInState = Object.keys(qa.userQa)
        if (defaultQuestions.toString() !== questionsInState.toString()) {
            qa.currentQuestion = defaultQuestion[0]
            qa.answer = qa.userQa[questionsInState[0]]
            qa.userQa = defaultQa
            qa.allAnswerIsOk = isAllAnswerOk(defaultQa)
            qa.currentAnswerIsOk = qa.answer ? qa.answer.length >= 2 : false
            setQa(qa)
        }
    })


    function renderQuestions() {
        const qusetions = Object.keys(qa.userQa)
        return qusetions.reduce((rs, question) => {
            rs.push(<option key={question} >{question}</option>)
            return rs
        }, [])
    }

    function answerUpdated(e) {
        const newAnswer = e.target.value
        qa.answer = newAnswer
        qa.currentAnswerIsOk = newAnswer.length >= 2
        qa.userQa[qa.currentQuestion] = newAnswer
        qa.allAnswerIsOk = isAllAnswerOk(qa.userQa)

        setQa(qa)
    }

    function questionChanged(e) {
        const options = e.target.options
        const question = options[options.selectedIndex].label
        const answer = qa.userQa[question]

        qa.currentAnswerIsOk = answer ? answer.length >= 2 : false
        qa.answer = answer ? answer : ""
        qa.currentQuestion = question
        setQa(qa)
    }

    function done() {
        whenItDone(qa.userQa)
    }

    return <div className="center" style={{ 'height': '80%' }}>
        <form class="box">
            <div class="field">
                <label class="label has-text-centered text-font text-color">{translate(parentalSettings.qaLabel)}</label>
                <h2 className="heading has-text-centered text-color">{translate(parentalSettings.qaSubTitle)}</h2>
                <div className="field center">
                    <div class="control has-icons-left">
                        <div class={qa.allAnswerIsOk ? 'select is-success' : 'select is-danger'}>
                            <select onChange={questionChanged}>
                                {renderQuestions()}
                            </select>
                        </div>
                        <span class="icon is-left">
                            <i class="fa-solid fa-clipboard-question"></i>
                        </span>
                    </div>
                </div>
                <div className="field center">
                    <input value={qa.answer} onChange={answerUpdated} className={qa.currentAnswerIsOk ? 'input is-success' : 'input is-danger'} />
                </div>
            </div>
            <div className="field has-text-centered">
                {qa.allAnswerIsOk && <button onClick={done} class="button is-primary has-text-centered">{translate(parentalSettings.labelOfQaSaveButton)}</button>}
            </div>
        </form>
    </div>
}

function AddNewUser({ createNewUser, whenUserCreated, whenCancelled }) {
    const [nameAndPwd, setNameAndPwd] = useReducer((p, n) => ({ ...p, ...n }), {
        name: "",
        pwd: "",
        err: null
    })

    function pwdChanged(e) {
        const newPwd = e.target.value
        setNameAndPwd({
            pwd: newPwd
        })
    }

    function nameChanged(e) {
        const newName = e.target.value
        setNameAndPwd({
            name: newName
        })
    }

    function create() {
        try {
            createNewUser(nameAndPwd.name, nameAndPwd.pwd)
            whenUserCreated(nameAndPwd.name)
        } catch (e) {
            console.error(`err occurred while creating the user. err ? ${e}`)
            setNameAndPwd({
                err: e
            })
        }
    }

    function cancel() {
        whenCancelled()
    }

    return <div class="box" style={{ 'marginTop': '2%' }}>
        {nameAndPwd.err !== null && <div className="field">
            <p className="has-text-danger">{translate(parentalSettings.errorTextOfUnableToCreateUser)}</p>
        </div>}
        <div class="field">
            <label class="label">{translate(parentalSettings.labelOfNewUserUsername)}</label>
            <div class="control">
                <input onChange={nameChanged} value={nameAndPwd.name} class={nameAndPwd.name.length > 1 ? 'input is-success' : 'input is-danger'} type="text" />
            </div>
        </div>

        <div class="field">
            <label class="label">{translate(parentalSettings.labelOfNewUserPwd)}</label>
            <div class="control">
                <input onChange={pwdChanged} value={nameAndPwd.pwd} class={nameAndPwd.pwd.length >= 8 ? 'input is-success' : 'input is-danger'} type="password" />
            </div>
        </div>

        <div className="center">
            <button onClick={cancel} className="button is-primary">{translate(parentalSettings.labelOfNewUserCancelButton)}</button>
            {(nameAndPwd.name.length > 1 && nameAndPwd.pwd.length >= 8) &&
                < button onClick={create} class="button is-primary ml-3">{translate(parentalSettings.labelOfNewUserConfirmButton)}</button>}
        </div>
    </div >
}

function ChooseUsernames({ usernames, selected, whenItDone, createNewUser }) {
    const Objstate = usernames.reduce((rs, username) => {
        const isSelected = selected.includes(username)
        rs[username] = isSelected
        return rs
    }, {})
    const [state, setState] = useReducer((p, n) => ({ ...p, ...n }), Objstate)
    const [actionOfCreateNewUser, setActionOfCreateNewUser] = useState(false)

    function updateTheUsernameState(username) {
        state[username] = !state[username]
        setState(state)
    }

    function getUsernamesOfUserSelected() {
        return Object.entries(state).reduce((rs, [username, selected]) => {
            if (selected) {
                rs.push(username)
            }
            return rs
        }, [])
    }

    function shouldShowNextButton() {
        const userSelected = getUsernamesOfUserSelected()
        return userSelected.length > 0
    }

    function renderUsernames() {
        return Object.entries(state).sort(([username1, _1], [username2, _2]) => {
            const lengthOfUsername1 = username1.length
            const lengthOfusername2 = username2.length

            if (lengthOfUsername1 > lengthOfusername2) {
                return 1
            } else if (lengthOfUsername1 < lengthOfusername2) {
                return -1
            } else {
                return 0
            }
        }).reduce((rs, [username, isSelected]) => {
            rs.push(
                <div className="field center" key={username}>
                    <label className="checkbox is-large">
                        <input className="is-large" onChange={(e) => {
                            updateTheUsernameState(username)
                        }} key={username} type='checkbox' checked={isSelected} />
                        <span className="is-size-5">{username}</span>
                    </label>
                </div>
            )
            return rs
        }, [])
    }

    function done() {
        const selected = getUsernamesOfUserSelected()
        whenItDone(selected)
    }

    return <div className="center" style={{ 'height': '80%', 'marginTop': '8%' }}>
        {actionOfCreateNewUser ? <AddNewUser createNewUser={createNewUser} whenUserCreated={(username) => {
            state[username] = false
            setActionOfCreateNewUser(false)
            setState(state)
        }} whenCancelled={() => {
            setActionOfCreateNewUser(false)
        }} /> :
            <form class="box">
                <div class="field has-text-centered">
                    <label class="label">{translate(parentalSettings.limitUserLabel)}</label>
                </div>

                <div class="field">
                    {renderUsernames()}
                </div>
                <div className="center">
                    {Object.keys(state).length < 5 && < button onClick={() => {
                        setActionOfCreateNewUser(true)
                    }} className="button is-primary center">{translate(parentalSettings.labelOfAddNewUserButton)}</button>}
                    {shouldShowNextButton() && <button onClick={done} className="ml-3 button is-primary center">{translate(parentalSettings.labelOfNextStepButtonOfLimitUser)}</button>}
                </div>
            </form>
        }
    </div >
}

function ConfirmTimeZone({ defaultTimeZone, refreshAysncFunc, whenItDone }) {

    const [timeZoneState, setTimeZoneState] = useReducer((p, n) => ({ ...p, ...n }), {
        userChoosed: defaultTimeZone,
        time: formatTheTimeOfNow(),
        timerId: null,
        errOnRefresh: null
    })

    function formatTheTimeOfNow() {
        return (new Date()).toLocaleTimeString('en-US', {
            hour12: false
        }).slice(0, 19).replace(/-/g, "/").replace("T", " ")
    }

    function tick() {
        setTimeZoneState({
            time: formatTheTimeOfNow()
        })
    }


    useEffect(() => {
        const err = translate(parentalSettings.labelOfTheErrorOnRefresh)
        if(timeZoneState && err !== timeZoneState.errOnRefresh) {
            setTimeZoneState({
                errOnRefresh: err
            })
        }

        if (timeZoneState.timerId === null) {
            const timerId = setInterval(() => {
                tick()
            }, 1000)

            setTimeZoneState({
                timerId: timerId
            })
        }
    })

    function refreshTimezone() {
        const timezone = refreshAysncFunc().then((timezone) => {
            setTimeZoneState({
                userChoosed: timezone,
                errOnRefresh: null
            })
        }).catch((err) => {
            setTimeZoneState({
                errOnRefresh: translate(parentalSettings.labelOfTheErrorOnRefresh)
            })
        })
    }

    function done() {
        clearInterval(timeZoneState.timerId)
        whenItDone(timeZoneState.userChoosed)
    }

    return <div className="center" style={{ 'height': '80%', 'marginTop': '8%' }}>
        <div className="box">
            <div class="field has-text-centered">
                <label class="label">{translate(parentalSettings.labelOfConfirmTimezone)}</label>
                <label className="heading">{translate(parentalSettings.subtitleOfConfirmTimezone)}</label>
                {timeZoneState.errOnRefresh && <label className="heading has-text-danger">{timeZoneState.errOnRefresh}</label>}
            </div>

            <div className="field">
                <div className="columns is-gapless" style={{ 'marginBottom': 0 }}>
                    <div className="column">
                        <label className="label is-size-4 has-text-centered">{translate(parentalSettings.labelOfShowTimezone)} {timeZoneState.userChoosed}</label>
                    </div>
                </div>

                <div className="columns is-gapless" style={{ 'marginBottom': 0 }}>
                    <div className="column">
                        <label className="label is-size-4 has-text-centered">{translate(parentalSettings.labelOfShowCurrentTime)} {timeZoneState.time}</label>
                    </div>
                </div>
            </div>


            <div className="center">
                <div>
                    <button onClick={refreshTimezone} className="button is-warning">{translate(parentalSettings.labelOfRefreshTimezoneButton)}</button>
                </div>
                {timeZoneState.userChoosed !== null ? <button onClick={done} className="button is-primary ml-5">{translate(parentalSettings.labelOfNextButtonOfConfirmTimezone)}</button> : null}
            </div>
        </div>
    </div>
}

function ParentalSettings({
    whenSettingsDone,
    defaultQa,
    defaultPwd,
    userNames,
    selectedUsernames,
    createNewUser,
    refreshTimeZoneAsync,
    userChoosedTimeZone }) {

    const [pwd, setPwd] = useReducer((p, n) => ({ ...p, ...n }), { pwd: defaultPwd, isDone: false, userNameDone: false, timeZoneSetUp: false, timeZone: userChoosedTimeZone, usernameSelected: selectedUsernames })

    function timeZoneDone(timezone) {
        setPwd({
            timeZone: timezone,
            timeZoneSetUp: true
        })
    }

    function usernameDone(usernames) {
        setPwd({
            userNameDone: true,
            usernameSelected: usernames
        })
    }

    function pwdDone(newPwd) {
        setPwd({
            pwd: newPwd,
            isDone: true
        })
    }

    function qaDone(qa) {
        whenSettingsDone(pwd.timeZone, pwd.usernameSelected, pwd.pwd, qa)
    }

    return <div style={{ 'height': '100%' }}>
        {
            pwd.timeZoneSetUp ?
                (pwd.userNameDone ? (pwd.isDone ?
                    <QaInput defaultQa={defaultQa} whenItDone={qaDone} /> :
                    <PwdInput pwdUpdate={pwdDone} defaultPwd={pwd.pwd} />
                ) : <ChooseUsernames usernames={userNames} selected={pwd.usernameSelected} whenItDone={usernameDone} createNewUser={createNewUser} />) : <ConfirmTimeZone defaultTimeZone={userChoosedTimeZone} refreshAysncFunc={refreshTimeZoneAsync} whenItDone={timeZoneDone} />
        }
    </div>
}

export default ParentalSettings