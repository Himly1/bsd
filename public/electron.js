const path = require('path');
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev')
const express = require('express')
const exApp = express()
exApp.use(express.urlencoded())
exApp.use(express.json())
const fs = require('fs')
const process = require('process')
const os = require('os')
const pathResolve = require('path').resolve
const platform = isDev ? 'my os' : process.platform
const currentUsername = os.userInfo().username
const supported = ['win32'].includes(platform)
let defaultConfig = {}
const forExplore = "forExplore"
const configFilePath = isDev ? 'config.json' : pathResolve("resources/config.json")
const cmd = require('node-cmd')
const iconv = require('iconv-lite')

//If you need to support other platform just write a function in the variables startWith "waysOf*"
//And add a python program at the folder 'pythonScripts'
//Just as simple as that dont need to worry about anything


//How to setup everything to make this app work on the os
const waysOfSetUP = {
  win32: () => {
    //for windwos it it simple, just create a task schedule that run on every minute for all user
    const taskName = 'BSD-TASK'
    const runWhichFile = pathResolve('resources/pythonScripts/win32.vbs')
    cmd.runSync(`schtasks /Delete /TN ${taskName} -F`)
    const { data, err, stderr } = cmd.runSync(`schtasks /create /RU Users /sc minute /mo 1 /tn ${taskName} /tr ${runWhichFile} /IT`)
  }
}


const waysOfGetDefaultTimeZone = {
  win32: () => {
    const { data, err, stderr } = cmd.runSync('tzutil /g')
    if (err && stderr) {
      throw err.toString() + stderr.toString()
    }

    return data
  },
  forExplore: () => {
    return "Hello world, goodbye world, hello world"
  }
}

//how to create new user(e.g.. Maybe name it as new account more suitable but you know what I mean anyway)
const waysOfCreateNewUser = {
  win32: ({ username, pwd }) => {
    const command = `net user ${username} ${pwd} /ADD`
    const { data, err, stderr } = cmd.runSync(command)
    if (data === null || data === 'null') {
      throw err.toString() + stderr.toString()
    }
  }
}

//How to get the all username of current operation system
//This app is assuming every operation system can create multiple users
//therefore for limit the actual users(e.g.. The user which owned by the child) should list all the usernames and let the parent to choose
const waysOfGetTheRealUsernamesOfCurrentOs = {
  win32: () => {
    //There is fake username in windows, like guest something
    const { data, err, stderr } = cmd.runSync('wmic useraccount get name')
    if (err || stderr) {
      throw err.toString() + stderr.toString()
    }

    // const noGarbled = iconv.decode(data, 'cp936')
    const pureUsernames = data.split('\n').reduce((rs, name) => {
      const pureName = name.replaceAll("\r", "").replaceAll("\n", "").replaceAll(" ", "")
      rs.push(pureName)
      return rs
    }, [])
    const validUsernames = pureUsernames.filter((name) => {
      const invalid = ['', 'Name', 'Administrator', 'DefaultAccount', 'Guest', 'WDAGUtilityAccount'].includes(name)
      return !invalid
    })

    return validUsernames
  },
  forExplore: () => {
    return ['Humble', 'OnTheRoad', 'OnMyWay']
  }
}


function loadTheConfigFromFile() {
  if (fs.existsSync(configFilePath)) {
    defaultConfig = JSON.parse(fs.readFileSync(configFilePath), 'utf8')
  } else {
    fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig), 'utf8')
  }


  const metas = [
    ['choosedTimeZone', waysOfGetDefaultTimeZone],
    ['usernames', waysOfGetTheRealUsernamesOfCurrentOs]
  ]
  metas.forEach((meta) => {
    const configName = meta[0]
    const valueOfExporeFunc = meta[1][forExplore]
    const valueFunc = meta[1][platform]
    if (valueFunc) {
      defaultConfig[configName] = valueFunc()
    } else {
      defaultConfig[configName] = valueOfExporeFunc()
    }
  })

  defaultConfig.supported = supported
}

function saveTheConfigToTheFile() {
  fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig), {
    encoding: 'utf8'
  })
}

function createNewUser(username, pwd) {
  const newUser = waysOfCreateNewUser[platform]
  if (newUser) {
    newUser({ username, pwd })
  }
}

function setUpExpressServer() {
  function configFile(req, res) {
    res.status(200).send(defaultConfig)
  }

  function saveConfigFile(req, res) {
    defaultConfig = req.body
    saveTheConfigToTheFile()
    res.status(200).send()
  }

  function newUser(req, res) {
    try {
      const username = req.body.username
      const password = req.body.pwd
      createNewUser(username, password)
      res.status(200).send()
    } catch (err) {
      console.error(`err occrred while creating new user. err: ${err}`)
      res.status(500).send(err)
    }
  }

  function refreshTimeZoneAndReturn(req, res) {
    try {
      const forExploreFuc = waysOfGetDefaultTimeZone[forExplore]
      const timezoneFuc = waysOfGetDefaultTimeZone[platform]
      const timezone = [forExploreFuc, timezoneFuc].reduce((rs, fuc) => {
        if (fuc) {
          rs = fuc()
        }
        return rs
      }, "")

      return res.status(200).send(timezone)
    } catch (e) {
      console.error(`err occrred while refreshing the timezone. ${e}`)
      res.status(500).send()
    }
  }

  function retreiveUsernames(req, res) {
    const fetcher = waysOfGetTheRealUsernamesOfCurrentOs[platform]
    if (fetcher) {
      res.status(200).send(fetcher())
    }

    const forExploreFuc = waysOfGetTheRealUsernamesOfCurrentOs[forExplore]
    res.status(200).send(forExploreFuc())
  }

  exApp.get('/config', configFile)
  exApp.put('/config', saveConfigFile)
  exApp.post('/users', newUser)
  exApp.get('/timezone', refreshTimeZoneAndReturn)
  exApp.get('/users', retreiveUsernames)

  exApp.listen(8888)
}

function loadElectronWindow() {
  function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
      width: 800,
      height: 800,
      title: "BSD",
      autoHideMenuBar: true,
      icon: isDev ? './icon.ico' : pathResolve("resources/public/icon.ico"),
      webPreferences: {
        nodeIntegration: true,
      },
    });

    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
    if (isDev) {
      win.webContents.openDevTools({ mode: 'detach' });
    }
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

function setUp() {
  const setup = waysOfSetUP[platform]
  if (setup) {
    setup()
  }
}


setUp()
loadTheConfigFromFile()
setUpExpressServer()
loadElectronWindow()