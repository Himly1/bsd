import {translate} from './../international/language'
import {notSupported} from './../international/keyRefs'

function NotSupported({ whenUserWantToExporeThisApp }) {
    return <div className="center" style={{ 'height': '80%', 'marginTop': '3%' }}>
        <div style={{ 'width': '20%' }}>
            <article class="message">
                <div class="message-header">
                    <label style={{ 'width': '100%' }} className="has-text-centered">{translate(notSupported.labelOfHeader)}</label>
                </div>
                <div class="has-text-centered message-body">
                    {translate(notSupported.labelOfContent)}
                </div>

                <div className="has-text-centered">
                    <button onClick={whenUserWantToExporeThisApp} className="has-text-centered button">{translate(notSupported.labelOfExploreButton)}</button>
                </div>
            </article>
        </div>
    </div>
}

export default NotSupported