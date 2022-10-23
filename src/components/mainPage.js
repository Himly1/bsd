import React, { useEffect, useReducer, useState } from "react";
import { translate } from '../international/language'
import { mainPage as mainPageKeyRef } from '../international/keyRefs'


function TimeRangeAdd({ whenAdd }) {
    return <button class="button" onClick={whenAdd}>
        <span class="icon is-small">
            <i class="fa-solid fa-plus"></i>
        </span>
    </button>
}

function TimeRangeRemove({ whenRemove }) {
    return <button class="button" onClick={whenRemove}>
        <span class="icon is-small">
            <i class="fa-solid fa-minus"></i>
        </span>
    </button>
}

function TimeRangePicker({ id, defaultTimeRange, whenItChange, isLastOne, whenTimeRangeAdd, whenTimeRangeRemoved, duplicated, showAddButton }) {
    const [timeState, setTimeState] = useReducer((p, n) => ({ ...p, ...n }), {
        start: defaultTimeRange[0],
        end: defaultTimeRange[1],
        ok: isTheTimeOk(defaultTimeRange[0], defaultTimeRange[1]),
        id: id
    })

    function isTheTimeOk(start, end) {
        const valueOk = [start, end].every((time) => {
            return !['', undefined, null].includes(time)
        })

        return valueOk && start !== end
    }

    function passNewRangeToParent() {
        whenItChange(id, [timeState.start, timeState.end])
    }

    function onStartTimeChange(e) {
        const time = e.target.value
        timeState.start = time
        timeState.ok = isTheTimeOk(time, timeState.end)
        setTimeState(timeState)
        passNewRangeToParent()
    }

    function onEndTimeChange(e) {
        const time = e.target.value
        timeState.end = time
        timeState.ok = isTheTimeOk(timeState.start, time)
        setTimeState(timeState)
        passNewRangeToParent()
    }


    return <div className="level">
        <div className="level-left" />
        <div className="levle-item">
            <div className="level-item">
                <input style={{ 'width': '40%' }} onChange={onStartTimeChange} value={timeState.start ? timeState.start : ""} className={timeState.ok && !duplicated ? 'level-item input is-success' : 'level-item input is-danger'} type={'time'} />
                <p className="label ml-3"> : </p>
                <input style={{ 'width': '40%' }} onChange={onEndTimeChange} value={timeState.end ? timeState.end : ""} className={timeState.ok && !duplicated ? 'level-item input ml-3 is-success' : 'level-item input ml-3 is-danger'} type={'time'}></input>
                {isLastOne && showAddButton ? <TimeRangeAdd whenAdd={whenTimeRangeAdd} /> : <TimeRangeRemove whenRemove={() => {
                    whenTimeRangeRemoved(id)
                }} />}
            </div>
        </div>
    </div>
}




function TimeRangesController({ defaultTimeRanges, whenItDone }) {
    const [timeRanges, setTimeRanges] = useState(defaultTimeRanges === undefined || defaultTimeRanges === null ? [['', '']] : defaultTimeRanges)
    const [showSaveButton, setShowSaveButton] = useState(false)
    function checkIfTheRangeSameWithOneOfThem(range, ranges) {
        const rangeStr = range.toString()
        const srtOfRagnes = ranges.reduce((rs, r) => {
            rs.push(r.toString())
            return rs
        }, [])

        const count = srtOfRagnes.filter(v => v === rangeStr).length
        return count > 1
    }

    function isTheTimeRangeAllSetUp(ranges) {
        const setup = ranges.every(([start, end]) => {
            return [start, end].every((time) => {
                return ![undefined, '', null].includes(time)
            }) && start !== end && !checkIfTheRangeSameWithOneOfThem([start, end], ranges)
        })

        return setup
    }

    function shouldShowSaveButton(defaultRanges, newRanges) {
        return isTheTimeRangeAllSetUp(newRanges) && defaultRanges.toString() !== newRanges.toString()
    }

    function updateTimeRangeWithId(id, newRange) {
        const nextTimeRanges = timeRanges.map((range, index) => {
            if (index === id) {
                return newRange
            } else {
                return range
            }
        })
        setTimeRanges(nextTimeRanges)
        setShowSaveButton(shouldShowSaveButton(defaultTimeRanges, nextTimeRanges))
    }

    function newTimeRange() {
        if (timeRanges.length < 10) {
            const newRanges = timeRanges.concat([[]])
            setShowSaveButton(shouldShowSaveButton(defaultTimeRanges, newRanges))
            setTimeRanges(newRanges)
        }
    }

    function timeRangeRemoved(id) {
        const ranges = timeRanges.filter((e, index) => {
            return index !== id + 1
        })
        setShowSaveButton(shouldShowSaveButton(defaultTimeRanges, ranges))
        setTimeRanges(ranges)
    }


    function renderTimeRanges(ranges) {
        const lastOne = ranges.length - 1
        const showAddButton = ranges.length <= 5
        const rs = []
        ranges.forEach((range, index) => {
            const duplicated = checkIfTheRangeSameWithOneOfThem(range, ranges)
            const timeRangePicker = <div key={index} className="field center" style={{ 'marginRight': '10%' }}>
                <div key={index} className="field">
                    <TimeRangePicker showAddButton={showAddButton} duplicated={duplicated} id={index} defaultTimeRange={range ? range : []} whenItChange={updateTimeRangeWithId} isLastOne={index === lastOne} whenTimeRangeAdd={newTimeRange} whenTimeRangeRemoved={timeRangeRemoved} />
                </div>
            </div>
            rs.push(timeRangePicker)
        });

        return rs
    }

    function flush() {
        whenItDone(timeRanges)
        setShowSaveButton(false)
    }

    return <div className="center" style={{ 'height': '100%', marginLeft: '10%', marginTop: '6%' }}>
        <div className="box" style={{ 'width': '80%' }}>
            <label className="label has-text-centered text-color text-font" style={{ 'marginRight': '10%' }}>{translate(mainPageKeyRef.labelOfTimeRanges)}</label>
            {renderTimeRanges(timeRanges)}
            {showSaveButton && <div className="has-text-centered mr-6">
                <button style={{ 'marginRight': '10%' }} onClick={flush} class="button is-primary">{translate(mainPageKeyRef.buttonLabelForSaveTimeRanges)}</button>
            </div>}
        </div>
    </div>
}

function MainPage({ defaultTimeRanges, whenTimeRangesReset}) {
    return <div style={{ 'height': '100%' }}>
        <TimeRangesController defaultTimeRanges={defaultTimeRanges.length == 0 ? [["", ""]] : defaultTimeRanges} whenItDone={whenTimeRangesReset} />
    </div>
}

export default MainPage