from datetime import datetime
import os
import json
import time

from cv2 import inRange

disableToPlayTheWindows = []
limitTheUsers = []
defaultTimeZone = None


def loadConfig():
    try:
        with open('./bsdConfig.json', encoding='utf8') as f:
            config = json.load(f)
            global limitTheUsers, disableToPlayTheWindows, defaultTimeZone
            limitTheUsers = config['onlyWorkForTheUsers']
            disableToPlayTheWindows = config['timeRangesNotAllowToUseTheComputer']
            defaultTimeZone = config['choosedTimeZone']
    except:
        print("Error occrred while loadaing the config")


def syncTimeWithTheDefaultTimeZone():
    try:
        if (defaultTimeZone is not None):
            command = f'tzutil /s "{defaultTimeZone}"'
            os.system(command)
    except:
        print("Error occrred while sync the time with the timezone")


def time_in_range(start, end, x):
    """Return true if x is in the range [start, end]"""
    if start <= end:
        return start <= x <= end
    else:
        return start <= x or x <= end


def isInRange(rangeArr, theTime):
    start = rangeArr[0]
    end = rangeArr[1]
    return time_in_range(start, end, theTime)


def currentUsername():
    try:
        username = os.getlogin()
        name = str(username).replace(" ", "")
        return name
    except:
        print('Error occrred while retriving curreng username')


def timeOk():
    now = datetime.now()
    currentTime = now.strftime('%H:%M')
    notAllowed = next(filter(lambda timeRnage: isInRange(
        timeRnage, currentTime), disableToPlayTheWindows), None)
    return notAllowed is None


def userOk():
    username = currentUsername()
    ok = username not in limitTheUsers
    return ok


def canPlay():
    timeIsFine = timeOk()
    userIsFine = userOk()

    return userIsFine or timeIsFine


while (True):
    loadConfig()
    syncTimeWithTheDefaultTimeZone()
    itsfine = canPlay()
    if (itsfine):
        time.sleep(2)
    else:
        os.system('shutdown -s -t 0')