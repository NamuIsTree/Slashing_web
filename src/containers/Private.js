import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';

import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { green } from '@material-ui/core/colors';

import ReactPlayer from 'react-player';

import './Private.css'

class Private extends React.Component {
    state = {
        yt_link : "",
        transcript : [],
        isPlaying: [],
        isButtonVisible : true,
        isCompleted : false
    }

    transcriptVideo = async () => {
        this.setState({ isButtonVisible: false });
        const url = "http://54.145.2.231:5000/slashing?url=" + this.state.yt_link;
        var transcripts = await axios.get(url);
        transcripts = transcripts.data;

        var jsonStr = "";
        var key;
        for (key in transcripts) {
            if (key === transcripts.length - 1) {
                break;
            }
            jsonStr = jsonStr + transcripts[key];
        }
        transcripts = JSON.parse(jsonStr);
        transcripts = transcripts.transcripts;

        console.log(transcripts);

        var text = "";
        var obj = [], sub;
        var words;
        var i, j, start, end = -1, s, e, count = 0;

        for (i in transcripts) {
            words = transcripts[i].words;
            for (j in words) {
                s = words[j].start_time;
                e = words[j].start_time + words[j].duration;
                
                if (end === -1) {
                    text = words[j].word + " ";
                    start = s;
                    end = e;
                    count = 1;
                }
                else {
                    if (s - end >= 1.0 || count === 10) {
                        sub = {
                            "text" : text,
                            "start" : start,
                            "end" : end
                        }
                        obj.push(sub);
                        text = "";
                        start = s;
                        count = 0;
                    }
                    text = text + words[j].word + " ";
                    count = count + 1;
                    end = e;
                }
            }
            break;
        }
        if (count > 0) {
            sub = {
                "text" : text,
                "start" : start,
                "end" : end
            }
            obj.push(sub);
        }
        console.log(obj);

        var isPlaying = [];
        for (i = 0; i < obj.length; i++) {
            isPlaying.push(false);
        }

        this.setState({ transcript: obj, isPlaying: isPlaying, isButtonVisible: true, isCompleted: true });
    }

    render() {
        const { yt_link, transcript, isPlaying, isButtonVisible, isCompleted } = this.state;

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
                    width="500px"
                    height="280px"
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
                    !isCompleted ? 
                    (
                        <div className = "progress">
                            <CircularProgress style = {{color: '#4caf50'}} /> 
                            <br/>
                            <Button
                                style = {{color: '#4caf50'}}
                            > 분석하고 있어요</Button>
                        </div>
                    ): (
                        <div className = "completed-icon">
                            <CheckIcon style = {{color: '#4caf50'}} /> 
                            <br/>
                            <Button
                                style = {{color: '#4caf50'}}
                            > 분석이 끝났습니다</Button>
                        </div>
                    )
                )}
                <br/> <br/>
                {
                isCompleted ? (
                    <div className = "videos-wrapper">
                    {transcript.map((t, idx) => {
                        const seg_start = Math.floor(t.start);
                        const seg_end = Math.ceil(t.end);
                        const seg_text = t.text;

                        return (
                            <div key = {idx} className = "video-segment">
                                <ReactPlayer
                                    url = {yt_link}
                                    playing = {isPlaying[idx]}
                                    loop = {true}
                                    controls = {false}
                                    width = "300px"
                                    height = "200px"
                                    style = {{
                                        display: 'inline-block'
                                    }}
                                    config = {{
                                        youtube: {
                                            playerVars: {
                                                start: seg_start,
                                                end: seg_end
                                            }
                                        }
                                    }}
                                />
                                <div>
                                    <IconButton 
                                        color="secondary"
                                        component="span"
                                        onClick = {(event) => {
                                            var nPlaying = isPlaying;
                                            nPlaying[idx] = !nPlaying[idx];
                                            this.setState({isPlaying: nPlaying});
                                        }}
                                    >
                                    {
                                        isPlaying[idx] ? (
                                            <PauseCircleOutlineIcon fontSize="large" />
                                        ) : (
                                            <PlayCircleOutlineIcon fontSize="large" />
                                        )
                                    }
                                    </IconButton>
                                    <TextField
                                        id = "segment-text"
                                        multiline
                                        rowsMax = {4}
                                        value = {seg_text}
                                        style = {{
                                            width: '400px'
                                        }}
                                        onChange = {(event) => {
                                            var ntranscript = transcript;
                                            ntranscript[idx].text = event.target.value;
                                            this.setState({transcript: ntranscript});
                                        }}
                                    />
                                    <br />
                                    <br />
                                </div>
                            </div>
                        );
                    })}
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={(event) => {
                            alert('저장되었습니다.');
                        }}
                    >
                        SAVE
                    </Button>
                    </div> 
                ) : (
                    <div className = "no-data" />
                )}
            </div>
        );
    }
}

export default Private;