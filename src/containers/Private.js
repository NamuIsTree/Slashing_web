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
        var res = await axios.get(url);
        res = res.data;

        var jsonStr = "";
        var key;
        for (key in res) {
            if (key === res.length - 1) {
                break;
            }
            jsonStr = jsonStr + res[key];
        }
        res = JSON.parse(jsonStr);

        this.setState({ transcript: res, isButtonVisible: true });
    }

    render() {
        const { yt_link, transcript, isButtonVisible } = this.state;
        
        var text = "";
        var transcripts = transcript.transcripts;
        var words;
        var i, j;

        console.log(transcripts);

        for (i in transcripts) {
            console.log(i);
            words = transcripts[i].words;
            console.log(words)
            for (j in words) {
                text = text + words[j].word + " ";
            }
            break;
        }
       
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

                <br/>
                <br/>
                <div className = "transcript-text">
                    {text}
                </div>
            </div>
        );
    }
}

export default Private;