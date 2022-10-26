from datetime import datetime
import os
import json
import time


disableToPlayTheWindows = []
limitTheUsers = []
defaultTimeZone = None


def loadConfig():
    try:
        with open('./../../config.json', encoding='utf8') as f:
            config = json.load(f)
            global limitTheUsers, disableToPlayTheWindows, defaultTimeZone
            limitTheUsers = config['onlyWorkForTheUsers']
            disableToPlayTheWindows = config['timeRangesNotAllowToUseTheComputer']
            defaultTimeZone = config['choosedTimeZone']
    except Exception as e:
        print(f"Error occrred while loadaing the config. err: ${e}")


def syncTimeWithTheDefaultTimeZone():
    try:
        if (defaultTimeZone is not None):
            command = f'tzutil /s "{defaultTimeZone}"'
            os.system(command)
    except Exception as e:
        print(f"Error occrred while sync the time with the timezone. err: ${e}")


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
    except Exception as e:
        print(f'Error occrred while retriving curreng username. err: ${e}')


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


loadConfig()
syncTimeWithTheDefaultTimeZone()
itsfine = canPlay()
if (not itsfine):
    counter = 10
    while(counter > 0):
        os.system('shutdown -s -t 0')
        counter = counter - 1
