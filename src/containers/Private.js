import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';

import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';

import ReactPlayer from 'react-player';

import './Private.css'

class Private extends React.Component {
    state = {
        yt_link : "",
        yt_title : "",
        transcript : [],
        isPlaying: [],
        isButtonVisible : true,
        isCompleted : false
    }

    transcriptVideo = async () => {
        const { yt_link } = this.state;

        this.setState({ isButtonVisible: false });
        const url = "http://54.243.162.187:5000/slashing?url=" + yt_link;
        
        var check = await axios.post('http://slashing.duckdns.org:8080/find/uri', {youtubeLink: yt_link});
        check = check.data;
        if (check.result === 1) {
            alert('이미 존재하는 영상입니다.\n해당 영상의 보기 페이지로 이동합니다.');
            window.location.href = '/view?q=' + check._id;
        }
        
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
        j = -1;
        for (i = 0; i < obj.length; i++) {
            isPlaying.push(false);

            if (i !== 0 && obj[i].start === 0) {
                obj[i].start = obj[j].end;
            }
            j = i;
        }

        const yt_title = await axios.post("http://slashing.duckdns.org:8080/getYoutubeTitle", { yt_link: yt_link });

        console.log(yt_title);

        this.setState({ transcript: obj, isPlaying: isPlaying, yt_title: yt_title.data, isCompleted: true });
    }

    saveData = async () => {
        const { yt_link, yt_title, transcript } = this.state;
        const obj = {
            yt_link: yt_link,
            yt_title: yt_title,
            transcript: transcript
        }

        var check = await axios.post('http://slashing.duckdns.org:8080/find/uri', {youtubeLink: yt_link});
        check = check.data;
        if (check.result === 1) {
            alert('이미 존재하는 영상입니다.\n해당 영상의 보기 페이지로 이동합니다.');
            window.location.href = '/view?q=' + check._id;
            return;
        }

        const response = await axios.post("http://slashing.duckdns.org:8080/save", obj);

        if (response.data.result === 1) {
            alert('저장이 완료되었습니다.\n');
            
            check = await axios.post('http://slashing.duckdns.org:8080/find/uri', {youtubeLink: yt_link});
            check = check.data;
            window.location.href = '/view?q=' + check._id;
        }
        else {
            alert('저장 중에 문제가 발생했습니다.\n관리자에게 문의 부탁드립니다.');
        }
    }

    render() {
        const { yt_link, yt_title, transcript, isPlaying, isButtonVisible, isCompleted } = this.state;

        return (
            <div className = "private-container">
                <TextField
                    id="youtube-url"
                    label="YouTube URL"
                    variant= {isButtonVisible ? "outlined" : "filled"}
                    value = {yt_link}
                    InputProps = {{
                        readOnly: !isButtonVisible,
                    }}
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
                        display: 'inline-block',
                        backgroundColor: '#D8D8D8'
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
                <br/>
                <h3>
                    {yt_title}
                </h3>
                <br/>
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
                                    key = {idx + '-' + isPlaying[idx]}
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
                                    <span className="segment-interval">
                                        <TextField
                                            label="Start"
                                            type="number"
                                            style ={{
                                                width: "44px"
                                            }}
                                            value={seg_start}
                                            onChange = {(event) => {
                                                var nTranscript = transcript;
                                                var nPlaying = isPlaying;
                                                var newValue = parseInt(event.target.value);
                                                if (newValue < 0) newValue = 0;
                                                if (newValue >= seg_end) newValue = seg_end - 1;
                                                if (isPlaying[idx] === true) nPlaying[idx] = false;
                                                nTranscript[idx].start = newValue;
                                                
                                                this.setState({transcript: nTranscript, isPlaying: nPlaying});
                                            }}
                                        />
                                        <span>
                                            {'초 ~ '}
                                        </span>
                                        <TextField
                                            label="End"
                                            type="number"
                                            style ={{
                                                width: "44px"
                                            }}
                                            value={seg_end}
                                            onChange = {(event) => {
                                                var nTranscript = transcript;
                                                var nPlaying = isPlaying;
                                                var newValue = parseInt(event.target.value);
                                                if (newValue < 0) newValue = 0;
                                                if (newValue <= seg_start) newValue = seg_start + 1;
                                                if (isPlaying[idx] === true) nPlaying[idx] = false;
                                                nTranscript[idx].end = newValue;
                                                this.setState({transcript: nTranscript, isPlaying: nPlaying});
                                            }}
                                        />
                                        <span>
                                            {'초'}
                                        </span>
                                    </span>
                                    <br/>
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
                        onClick={this.saveData}
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