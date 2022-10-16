import React from "react";
import { getLanguageOptions, change } from './../international/language'

class LanguageOptions extends React.Component {
    renderLngOptions() {
        return getLanguageOptions.reduce((rs, op) => {
            rs.push(
                <option>
                    {op}
                </option>
            )
            return rs
        }, [])
    }

    changeLng = (e) => {
        const options = e.target.options
        const language = options[options.selectedIndex].label
        change(language)
        this.forceUpdate()
    }

    render() {
        <div class="control has-icons-left">
            <div class="select">
                <select onChange={this.changeLng}>
                    {this.renderLngOptions()}
                </select>
            </div>
            <div class="icon is-small is-left">
                <i class="fa-solid fa-language"></i>
            </div>
        </div>
    }
}

export default LanguageOptions