import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ReactPlayer from 'react-player';

import './Private.css'

class Private extends React.Component {
    state = {
        yt_link : "",
        transcript : [],
        isButtonVisible : true
    }

    transcriptVideo = async () => {
        this.setState({ isButtonVisible: false });
        const url = "http://54.145.2.231:5000/slashing?url=" + this.state.yt_link;
        const res = await axios.get(url);
        this.setState({ transcript: res.data, isButtonVisible: true });
    }

    render() {
        const { yt_link, transcript, isButtonVisible } = this.state;
        
        console.log(transcript);

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
                    controls={true}
                    width="640px"
                    height="360px"
                    style={{
                        display: 'inline-block'
                    }}
                />
                <br/> <br/>
                { isButtonVisible ? (
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={this.transcriptVideo}
                >
                    분석하기
                </Button>
                ) : (
                <h3 align="center"> 분석중 </h3>
                )}
            </div>
        );
    }
}

export default Private;