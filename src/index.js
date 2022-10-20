import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.scss'
import './configFile'
import './fonts/NotoSansSC.otf'

import { init as initConfigFile } from './configFile'
import { init as initLanguage } from './international/language'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'))
initLanguage()
initConfigFile({
  parentPwd: null,
  qa: {
    'configQuestion1': '123',
    'configQuestion2': '123',
    'configQuestion3': '123'
  },
  timeRangesNotAllowToUseTheComputer: [

  ],
  language: 'en',
  onlyWorkForTheUsers: ['test'],
  usernames: ['onTheRoad', 'test']
}, (json) => {
  console.log(`writing the json to the file the json is ${JSON.stringify(json)}`)
})
root.render(
  <App />
)