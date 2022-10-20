import React, { useReducer, useState, useEffect } from "react";
import { translate, getNameOfCurrentLng } from '../international/language'
import { parentalSettings } from '../international/keyRefs'

function LngOptions({ whenLngChange, lngOptions }) {

    function renderOptions() {
        return lngOptions.reduce((rs, option) => {
            rs.push(<option key={option}>
                {option}
            </option>)
            return rs
        }, [])
    }

    function languageChanged(e) {
        const options = e.target.options
        const language = options[options.selectedIndex].label
        whenLngChange(language)
    }

    return <div style={{ 'width': '100%' }} >
        <nav class="level">
            <div className="level-item"></div>

            <div class="level-right">
                <div className="level-item">
                    <div class="control has-icons-left">
                        <div class="select is-success">
                            <select defaultValue={getNameOfCurrentLng()} onChange={languageChanged} >
                                {renderOptions()}
                            </select>
                        </div>
                        <span class="icon is-left">
                            <i class="fa-solid fa-language"></i>
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    </ div>
}

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

function ChooseUsernames({ usernames, selected, whenItDone }) {
    const Objstate = usernames.reduce((rs, username) => {
        const isSelected = selected.includes(username)
        rs[username] = isSelected
        return rs
    }, {})
    const [state, setState] = useReducer((p, n) => ({ ...p, ...n }), Objstate)

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
        return Object.entries(state).reduce((rs, [username, isSelected]) => {
            rs.push(
                <div className="field" key={username}>
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

    return <div className="center" style={{ 'height': '80%' }}>
        <form class="box">
            <div class="field has-text-centered">
                <label class="label">选择要限制的用户名</label>
            </div>

            <div class="field">
                {renderUsernames()}
            </div>
            <div className="center">
                {shouldShowNextButton() && <button onClick={done} className="button is-primary center">下一步</button>}
            </div>
        </form>
    </div>
}


function ParentalSettings({ whenSettingsDone, defaultQa, defaultPwd, onLanguageChange, lngOptions, userNames, selectedUsernames }) {
    const [pwd, setPwd] = useReducer((p, n) => ({ ...p, ...n }), { pwd: defaultPwd, isDone: false, userNameDone: false, usernameSelected: selectedUsernames })

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
        whenSettingsDone(pwd.usernameSelected, pwd.pwd, qa)
    }

    return <div style={{ 'height': '100%' }}>
        <LngOptions whenLngChange={onLanguageChange} lngOptions={lngOptions} />
        {
            pwd.userNameDone ? pwd.isDone ?
                <QaInput defaultQa={defaultQa} whenItDone={qaDone} /> :
                <PwdInput pwdUpdate={pwdDone} defaultPwd={pwd.pwd} /> : <ChooseUsernames usernames={userNames} selected={pwd.usernameSelected} whenItDone={usernameDone} />
        }
    </div>
}

export default ParentalSettings