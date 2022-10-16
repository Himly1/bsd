import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.scss'
import './configFile'
import './fonts/MaShanZheng.ttf'

import PasswordSetting from './components/parentalSetting';
import MainPage from './components/mainPage';
import { init as initConfigFile } from './configFile'

import { addTimeRangeOfNotAllowToUseComputer, removeTimeRangeOfNotAllowToUseComputer, retriveParentPwd, retriveSecretQa, updateParentPwd, updateSecretQa } from './configFile';

const globalState = {
  parentPwd: retriveParentPwd,
  secrectQa: retriveSecretQa,
  addTimeRangeOfNotAllowToUseComputer: addTimeRangeOfNotAllowToUseComputer,
  removeTimeRangeOfNotAllowToUseComputer: removeTimeRangeOfNotAllowToUseComputer,
  updateParentPwd: updateParentPwd,
  updateScrectQa: updateSecretQa
}



class Board extends React.Component {
  render() {
    return <div className='board'>
      {this.mainPageOrParentPwdSetting()}
    </div>
  }

  mainPageOrParentPwdSetting() {
    const parentPwd = this.props.globalState.parentPwd()
    const globalState = this.props.globalState
    const pwdAndQaAlreadySet = parentPwd !== undefined && parentPwd !== null

    return !pwdAndQaAlreadySet ? <PasswordSetting
      globalState={globalState}
    /> : <MainPage
      globalState={globalState}
    />
  }
}

initConfigFile({
  parentPwd: null,
  qa: {
    'configQuestion1': '知行合一',
    'configQuestion2': 'Tower of song',
    'configQuestion3': '电影没我生活精彩'
  },
  timeRangesNotAllowToUseTheComputer: [

  ],
  language: '中文'
}, (json) => {
  console.log(`writing the json to the file the json is ${json}`)
})
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Board
      globalState={globalState}
    ></Board>
  </React.StrictMode>
)