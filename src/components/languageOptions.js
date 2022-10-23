import {getNameOfCurrentLng} from './../international/language'

function LngOptions({ whenLngChange, lngOptions }) {

    function renderOptions() {
        return lngOptions.reduce((rs, option) => {
            rs.push(<option key={option}>
                {option}
            </option>)
            return rs
        }, [])
    }

    function languageChanged(e) {
        const options = e.target.options
        const language = options[options.selectedIndex].label
        whenLngChange(language)
    }

    return <div style={{ 'width': '100%' }} >
        <nav class="level">
            <div className="level-item"></div>

            <div class="level-right">
                <div className="level-item">
                    <div class="control has-icons-left">
                        <div class="select is-success">
                            <select defaultValue={getNameOfCurrentLng()} onChange={languageChanged} >
                                {renderOptions()}
                            </select>
                        </div>
                        <span class="icon is-left">
                            <i class="fa-solid fa-language"></i>
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    </ div>
}

export default LngOptions