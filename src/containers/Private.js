import React from 'react';
import TextField from '@material-ui/core/TextField';
import ReactPlayer from 'react-player';

import './Private.css'

class Private extends React.Component {
    state = {
        yt_link : ""
    }

    render() {
        const { yt_link } = this.state;
        return (
            <div className = "private-container">
                <TextField
                    id="youtube-url"
                    label="YouTube URL"
                    variant="outlined"
                    onChange = {(event) => {
                        try {
                            this.setState({yt_link: event.target.value});
                        }
                        catch(e) {}
                    }}
                />
                <br/> <br/>
                <ReactPlayer
                    url={yt_link}
                    playing
                    loop={true}
                    style={{
                        display: 'inline-block'
                    }}
                    config={{
                        youtube: {
                            playerVars: {
                                start: 33,
                                end: 40
                            }
                        }
                    }}
                />
            </div>
        );
    }
}

export default Private;