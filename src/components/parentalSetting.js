import React, { useState } from "react";
import './parentalSetting.scss'
import { translate } from '../international/language'
import { parentalSetting } from '../international/keyRefs'
import Logo from './logo'
import LanguageOption from "./LanguageOption";



function titleComponent(title, subtitle) {
    return <div className="level">
        <div className="level-item has-text-centered">
            <div className="title is-relative">
                <h1 className="title text-color is-size-1-desktop">{translate(title)}</h1>
                <h2 className="heading text-color mt-3 is-size-3-desktop">{translate(subtitle)}</h2>
            </div>
        </div>
    </div>
}

class PasswordInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showPwd: false,
            pwd: props.pwd == null ? '' : props.pwd
        }

    }

    showHidePwd = (e) => {
        e.preventDefault()
        this.setState((state) => {
            return {
                showPwd: !state.showPwd
            }
        })
    }

    passwordUpdated = (e) => {
        e.preventDefault()
        this.props.passwordUpdated(e.target.value)
        this.setState((state) => {
            state.pwd = e.target.value
            return state
        })
    }

    render() {
        return <div className="column is-vcentered  is-8">
            <div className="level">
                {/* label */}
                <div className="level-left">
                    <label className="label text-font text-color is-size-3 level-item" style={{ 'width': '100%', 'margin': 0, 'padding': 0 }}>{translate(parentalSetting.passwordInputLabel)}</label>
                </div>

                <div className="level-item control has-icons-left">
                    <input className="input" type={this.state.showPwd ? 'text' : 'password'} value={this.props.pwd == null ? "" : this.props.pwd} onChange={this.passwordUpdated} />
                    <span className="icon is-small is-left">
                        <i className={this.state.pwd.length >= 6 ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'}></i>
                    </span>

                    <button className="button mr-6" onClick={this.showHidePwd}>
                        <i className={this.state.showPwd ? 'fa-sharp fa-solid fa-eye' : 'fa-solid fa-eye-slash'}></i>
                    </button>
                </div>
            </div>
        </div >
    }
}

class SecurtQa extends React.Component {
    constructor(props) {
        super(props)
        const qa = props.globalState.secrectQa()
        const questions = Object.keys(qa)
        const defaultQuestion = questions[0]
        this.state = {
            questions: questions,
            answer: qa[defaultQuestion],
            currentQuestion: defaultQuestion,
            finalQa: qa
        }
    }


    qusetionChanged = (e) => {
        e.preventDefault()
        const options = e.target.options
        const question = options[options.selectedIndex].label
        this.setState((state) => {
            state.currentQuestion = question
            state.answer = state.finalQa[question]
            return state
        })
    }

    answerUpdated = (e) => {
        e.preventDefault()
        const answer = e.target.value
        this.setState((state) => {
            state.finalQa[state.currentQuestion] = answer
            state.answer = answer
            return state
        })

        this.props.answerUpdated(this.state.currentQuestion, answer)
    }

    cleanAnswer = (e) => {
        e.preventDefault()
        this.setState((state) => {
            state.answer = ''
            state.finalQa[state.currentQuestion] = ''
            return state
        })

        e.target.value = ""
        this.answerUpdated(e)
    }

    renderQuestions() {
        return this.state.questions.reduce((rs, question) => {
            rs.push(<option key={question}>
                {question}
            </option>)

            return rs
        }, [])
    }

    render() {
        return <div className="column is-vcentered  is-8">
            {titleComponent(parentalSetting.qaTitle, parentalSetting.qaSubtitle)}
            <div>
                <div className="center">
                    <div className="control has-icons-left">
                        <div className="select" onChange={this.qusetionChanged}>
                            <select>
                                {this.renderQuestions()}
                            </select>
                        </div>
                        <span className="icon is-left ">
                            <i className="fa-solid fa-clipboard-question"></i>
                        </span>
                    </div>
                </div>

                <div className="column is-vcentered is-8 center" style={{ 'margin': 0, 'padding': 0, 'width': '100%' }}>
                    <div className="level is-8" style={{ 'margin': 0, 'padding': 0, 'width': '100%' }}>
                        <label className="label level-left text-color text-font is-size-3" style={{ 'margin': 0 }}>{translate(parentalSetting.qaInputLabel)}</label>
                        <div className="control level-item has-icons-left">
                            <input className='input is-focused ' type="text" value={this.state.answer} onChange={this.answerUpdated} />
                            <span className="is-left icon">
                                <i className={this.state.answer.length >= 6 ? 'fa-regular fa-circle-check' : "fa-regular fa-circle-xmark"}></i>
                            </span>
                            <button className="button" onClick={this.cleanAnswer}>
                                <span className="icon is-small">
                                    <i className="fa-regular fa-trash-can"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    }
}

class Submit extends React.Component {
    render() {
        return <div className="column is-vcentered  is-8 ">
            <div className="center">
                <button type="submit" className={this.props.pwdOk && this.props.qaOk ? "button is-success" : "is-invisible"} onSubmit={this.props.onsubmit}>
                    <span className="icon is-small">
                        <i className="fas fa-check"></i>
                    </span>
                    <span>{translate(parentalSetting.saveButtonLabel)}</span>
                </button>
            </div>
        </div>
    }
}

class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'pwdOk': false,
            "qaOk": false,
            'pwd': props.globalState.parentPwd(),
            'qa': props.globalState.secrectQa
        }
    }

    passwordUpdated = (pwd) => {
        this.setState((state) => {
            state.pwd = pwd
            state.pwdOk = pwd.length >= 6
            return state
        })
    }

    answerUpdated = (question, answer) => {
        console.log(question, answer)
        this.setState((state) => {
            state.qa[question] = answer
            state.qaOk = Object.entries(this.state.qa).every(([_, value]) => {
                return value !== null && value.length >= 6
            })
            return state
        })
    }


    onsubmit = () => {

    }

    render() {
        return <div className="columns is-vcentered is-centered is-multiline">
            <PasswordInput
                pwd={this.state.pwd}
                passwordUpdated={this.passwordUpdated}
            />
            <SecurtQa
                globalState={this.props.globalState}
                answerUpdated={this.answerUpdated}
            />

            <Submit
                onSubmit={this.onsubmit}
                qaOk={this.state.qaOk}
                pwdOk={this.state.pwdOk}
            />

        </div>
    }
}

class PasswordSetting extends React.Component {
    render() {
        return <div>
            
            <div className="center">
                <Logo />
            </div>
            {titleComponent(parentalSetting.title, parentalSetting.subtitle)}
            <Form
                globalState={this.props.globalState}
            />
        </div>
    }
}


export default PasswordSetting