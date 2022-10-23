const path = require('path');
const { app, BrowserWindow } = require('electron');
const express = require('express')
const exApp = express()
exApp.use(express.urlencoded())
exApp.use(express.json())
const fs = require('fs')
const process = require('process')
const os = require('os')

const platform = process.platformst
const currentUsername = os.userInfo().username
const supported = ['win32'].includes(platform)
let config = {}

const forExplore = "forExplore"
//If you need to support other platform just write a function in the variables startWith "waysOf*"
//And add a python program at the folder 'pythonScripts'
//Just as simple as that dont need to worry about anything

//which python program should be set as self starts
const waysOfGetThePathOfThePythonProgram = {
  win32: () => {
    return './../pythonScripts/win32.pyw'
  }
}

//The python program should read newest config every second 
//therefore there should be a way to flush the new config to the config file of python program dependes on
const waysOfFlushConfigToTheSelfStartPythonProgramFolder = {
  win32: () => {
    const pathOfSelfStarts = 'C:\\Users\\' + currentUsername + '\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\bsdConfig.json'
    fs.copyFileSync('public/config.json', pathOfSelfStarts)
  }
}

//how to set the python program as self starts
const waysOfSetPythonProgramAsSelfStarts = {
  win32: () => {
    const pathOfSelfStarts = 'C:\\Users\\' + currentUsername + '\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\bsd.pyw'
    const pythonPath = waysOfGetThePathOfThePythonProgram[platform]
    fs.copyFileSync(pythonPath, pathOfSelfStarts)
  }
}


const waysOfGetDefaultTimeZone = {
  win32: () => {

  },
  forExplore: () => {
    return "Hello world, goodbye world, hello world"
  }
}

//how to create new user(e.g.. Maybe name it as new account more suitable but you know what I mean anyway)
const waysOfCreateNewUser = {
  win32: ({ username, pwd }) => {

  }
}

//How to get the all username of current operation system
//This app is assuming every operation system can create multiple users
//therefore for limit the actual users(e.g.. The user which owned by the child) should list all the usernames and let the parent to choose
const waysOfGetTheRealUsernamesOfCurrentOs = {
  win32: () => {
    //There is fake username in windows, like guest something

  },
  forExplore: () => {
    return ['Humble', 'OnTheRoad', 'OnMyWay']
  }
}






function setThePythonFileAsSelfStarts() {
  const func = waysOfSetPythonProgramAsSelfStarts[platform]
  if (func) {
    func()
  } else {
    console.error(`Current os not supported`)
  }

}

function loadTheConfigFromFile() {
  config = JSON.parse(fs.readFileSync('public/config.json', 'utf8'))
  console.log(`config ? ${Object.keys(config)}`)
  const metas = [
    ['choosedTimeZone', waysOfGetDefaultTimeZone],
    ['usernames', waysOfGetTheRealUsernamesOfCurrentOs]
  ]
  metas.forEach((meta) => {
    console.log(`meta ? ${meta}`)
    const configName = meta[0]
    const valueOfExporeFunc = meta[1][forExplore]
    const valueFunc = meta[1][platform]
    if (valueFunc) {
      config[configName] = valueFunc()
    } else {
      config[configName] = valueOfExporeFunc()
    }
  })

  config.supported = supported
}

function saveTheConfigToTheFile() {
  fs.writeFileSync('public/config.json', JSON.stringify(config), {
    encoding: 'utf8'
  })
  const flushToPythonProgram = waysOfFlushConfigToTheSelfStartPythonProgramFolder[platform]
  if (flushToPythonProgram) {
    flushToPythonProgram()
  }
}

function createNewUser(username, pwd) {
  const newUser = waysOfCreateNewUser[platform]
  if (newUser) {
    newUser(username, pwd)
  }
}

function setUpExpressServer() {
  function configFile(req, res) {
    console.log(`requesting config `)
    res.status(200).send(config)
  }

  function saveConfigFile(req, res) {
    console.log(`saving config and the config is ${req.body}`)
    config = req.body
    saveTheConfigToTheFile()
    res.status(200).send()
  }

  function newUser(req, res) {
    const username = req.body.username
    const password = req.body.pwd
    console.log(`new user ? ${username} ${password}`)
    createNewUser(username, password)
    res.status(200).send()
  }

  function refreshTimeZoneAndReturn(req, res) {
    console.log(`refresh time zone`)
    const forExploreFuc = waysOfGetDefaultTimeZone[forExplore]
    const timezoneFuc = waysOfGetDefaultTimeZone[platform]
    const timezone = [forExploreFuc, timezoneFuc].reduce((rs, fuc) => {
      if (fuc) {
        rs = fuc()
      }
      return rs
    }, "")

    return res.status(200).send(timezone)
  }

  exApp.get('/config', configFile)
  exApp.put('/config', saveConfigFile)
  exApp.post('/users', newUser)
  exApp.get('/timezone', refreshTimeZoneAndReturn)

  exApp.listen(8888)
}

function loadElectronWindow() {
  function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
      width: 800,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
    win.webContents.openDevTools({ mode: 'detach' });
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(createWindow);

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bars to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

setThePythonFileAsSelfStarts()
loadTheConfigFromFile()
setUpExpressServer()
loadElectronWindow()
