import { useReducer, useState } from "react"
import './login.scss'
import { translate } from '../international/language'
import { login } from '../international/keyRefs'

function ResetPage({ whenItDone }) {
    const [state, setState] = useReducer((pre, now) => ({ ...pre, ...now }), {
        passwordOk: false,
        newPwd: ""
    })

    function pwdChange(e) {
        const pwd = e.target.value
        setState({
            passwordOk: pwd.length >= 6,
            newPwd: pwd
        })
    }

    return <div className="center resetPwd">
        <div class="box">
            <div class="field">
                <label class="label has-text-centered text-font text-color">{translate(login.labelOfRestpwd)}</label>
                <div class="control">
                    <input onChange={pwdChange} class={state.passwordOk ? 'input is-success' : 'input is-danger'} type={'password'} />
                </div>
            </div>
            {state.passwordOk && <div className="field center">
                <button onClick={() => {
                    whenItDone(state.newPwd)
                }} class="button is-primary center text-font">{translate(login.labelOfResetButton)}</button>
            </div>}
        </div>
    </div>
}


function ResetPwdByQa({ qa, whenItDone }) {

    const [state, setState] = useReducer((state, newState) => ({ ...state, ...newState }), {
        userQa: {},
        answerAllCorrect: false,
        currentAnswerCorrect: false,
        currentQuestion: Object.keys(qa)[0],
        currentQuestionAnswer: ""
    })

    function renderQuestions() {
        return Object.keys(qa).reduce((rs, question) => {
            rs.push(<option key={question}>{question}</option>)
            return rs
        }, [])
    }

    function answerChanged(e) {
        const realAnswer = qa[state.currentQuestion]
        const userAnswer = e.target.value

        const currentAnswerCorrect = realAnswer === userAnswer
        const userQa = state.userQa
        userQa[state.currentQuestion] = userAnswer
        const allCorrect = Object.entries(qa).every(([question, answer]) => {
            const userAnswer = state.userQa[question]
            return userAnswer === answer
        })
        setState({
            userQa: userQa,
            answerAllCorrect: allCorrect,
            currentAnswerCorrect: currentAnswerCorrect,
            currentQuestionAnswer: userAnswer
        })

    }

    function questionChanged(e) {
        const options = e.target.options
        const question = options[options.selectedIndex].label
        const answer = state.userQa[question]
        const correct = qa[question] === answer
        setState({
            currentQuestion: question,
            currentQuestionAnswer: answer ? answer : "",
            currentAnswerCorrect: correct
        })
    }

    return state.answerAllCorrect ? <ResetPage whenItDone={whenItDone} /> : <div className="center resetPwd">
        <div class="box">
            <div className="is-vcentered is-centered is-multiline">
                <div>
                    <label className="label column is-vcentered has-text-centered text-font text-color" style={{ 'width': '100%' }}>{translate(login.resetPwdLabel)}</label>
                </div>

                <div class="control has-icons-left">
                    <div class="select">
                        <select onChange={questionChanged}>
                            {renderQuestions()}
                        </select>
                    </div>
                    <span class="icon is-left">
                        <i class="fa-solid fa-clipboard-question"></i>
                    </span>
                </div>
                <input value={state.currentQuestionAnswer} onChange={answerChanged} className={state.currentAnswerCorrect ? "input is-success has-text-centered" : 'input is-danger has-text-centered'} type={'text'} />
            </div>
        </div>
    </div >
}

function LoginOrForgePwd({ onClickForgetPwd, pwd, onPwdCorrect }) {
    const [shouldRenderButton, setShouldRenderButton] = useState(false)
    const [pwdCorrect, setPwdCorrect] = useState(false)

    function compareThePwd(e) {
        const value = e.target.value
        const correct = value === pwd
        setShouldRenderButton(correct)
        setPwdCorrect(correct)
    }

    return <div className="center login">
        <div className="box" >
            <div className="field">
                <label className="label text-color text-font">{translate(login.passwordInputLabel)}</label>
                <div className="control">
                    <input onChange={compareThePwd} className={pwdCorrect ? "input is-success" : 'input is-danger'} type={'password'} />
                </div>
            </div>

            <div className="field center">
                {shouldRenderButton ? <button onClick={onPwdCorrect} className="button is-primary" >{translate(login.labelOfSignIn)}</button> : <button className="button is-warning" onClick={onClickForgetPwd}>{translate(login.labelOfForgotPwdButton)}</button>}
            </div>
        </div >
    </div >
}




function Login({ pwd, qa, onSuccess, onPwdChange }) {
    const [state, setState] = useReducer((p, n) => ({ ...p, ...n }), {
        shouldRenderForgetPwd: false,
        pwdForPreventReset: pwd
    })

    function pwdForgot() {
        setState({
            shouldRenderForgetPwd: true
        })
    }

    function resetDone(newPwd) {
        setState({
            shouldRenderForgetPwd: false,
            pwdForPreventReset: newPwd
        })
        onPwdChange(newPwd)
    }

    return state.shouldRenderForgetPwd ?
        <ResetPwdByQa qa={qa} whenItDone={resetDone} /> :
        <LoginOrForgePwd onClickForgetPwd={pwdForgot} pwd={state.pwdForPreventReset} onPwdCorrect={onSuccess} />
}

export default Login