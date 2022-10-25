import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.scss'
import './configFile'
import './fonts/NotoSansSC.otf'

import { init as initConfigFile } from './configFile'
import { init as initLanguage } from './international/language'
import App from './App';
import { getConfigFile, saveConfigFile, createNewUser, refreshTimezone, retreiveUsernames } from './appDependency'

//this line of code not working in the windwos env dont know why
//this from the package.json dependecies and pointed to the './config.json'
// import cfg from 'config-json'

const root = ReactDOM.createRoot(document.getElementById('root'))
function loadWithTest() {
  initLanguage()
  //replace the first argument with actual config
  //on linux env you can pass the cfg imported from the package.json dependecy
  initConfigFile({
    "parentPwd": null,
    "qa": {
      "configQuestion1": "知行合一",
      "configQuestion2": "《Tower of song》by Leonard Cohen",
      "configQuestion3": "我的人生比电影精彩多了"
    },
    "timeRangesNotAllowToUseTheComputer": [],
    "language": "cn",
    "onlyWorkForTheUsers": [],
    "usernames": [
      "Humble",
      "OnTheRoad",
      "OnMyWay"
    ],
    "choosedTimeZone": "Hello world, goodbye world, hello world",
    "supported": false
  }, (cfg) => {
  }, (username, pwd) => {
    console.log(`username ? ${username} pwd ? ${pwd}`)
    throw 'fuck off'
  }, async () => {
    console.log(`will return new timezone`)
    throw 'fuck off'
    // return 'new TimeZone'
  }, async () => {
    return ['test', 'onTheRoad', 'helloworld']
  })
  root.render(
    <App />
  )
}

function load() {
  getConfigFile().then((cfg) => {
    initLanguage()
    initConfigFile(cfg, saveConfigFile, createNewUser, refreshTimezone, retreiveUsernames)
    root.render(
      <App />
    )
  })
}

// loadWithTest()
load()