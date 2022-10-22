import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.scss'
import './configFile'
import './fonts/NotoSansSC.otf'

import { init as initConfigFile } from './configFile'
import { init as initLanguage } from './international/language'
import App from './App';
import { getConfigFile, saveConfigFile, createNewUser } from './appDependency'

const root = ReactDOM.createRoot(document.getElementById('root'))
function load() {
  getConfigFile().then((cfg) => {
    initLanguage()
    initConfigFile(cfg, saveConfigFile, createNewUser)
    root.render(
      <App />
    )
  })
}

load()