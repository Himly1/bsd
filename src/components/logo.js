import React from "react";
import png from '../fonts/logo.png'

class Logo extends React.Component {
    render() {
        return <figure className="image is-128">
            <img src={png} />
        </figure>
    }
}

export default Logo