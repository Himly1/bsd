import { translate } from './../international/language'
import { mainPage } from './../international/keyRefs'

function ParentalSettingClickableButton({ onClicked }) {
    return <button onClick={onClicked} class="button is-link is-light is-primary">{translate(mainPage.labelOfParentalSettingButton)}</button>
}

export default ParentalSettingClickableButton