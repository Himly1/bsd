import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.scss'
import './configFile'
import './fonts/NotoSansSC.otf'

import { init as initConfigFile } from './configFile'
import { init as initLanguage } from './international/language'
import App from './App';
import { getConfigFile, saveConfigFile, createNewUser, refreshTimezone } from './appDependency'

//this from the package.json dependecies and pointed to the 'public/config.json'
import cfg from 'config-json'

const root = ReactDOM.createRoot(document.getElementById('root'))
function loadWithTest() {
  initLanguage()
  initConfigFile(cfg, (cfg) => {
    console.log(`cfg ? ${JSON.stringify(cfg)}`)
  }, (username, pwd) => {
        console.log(`username ? ${username} pwd ? ${pwd}`)
        throw 'fuck off'
  }, async () => {
    console.log(`will return new timezone`)
    throw 'fuck off'
    // return 'new TimeZone'
  })
  root.render(
    <App />
  )
}

function load() {
  getConfigFile().then((cfg) => {
    console.log(`The cfg is ${JSON.stringify(cfg)}`)
    initLanguage()
    initConfigFile(cfg, saveConfigFile, createNewUser, refreshTimezone)
    root.render(
      <App />
    )
  })
}

// loadWithTest()
load()