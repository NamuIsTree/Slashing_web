import React from 'react';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import ReactPlayer from 'react-player';

import './View.css';

class View extends React.Component {
    state = {
        data: [],
        isPlaying: [],
        isLoading: true,
        isVideoOpened: false
    }

    getLyrics = async() => {
        const _id = this.props.location.query.q;
        var resp = await axios.post('http://slashing.duckdns.org:8080/find/lyric', { _id: _id });

        var isPlaying = [];
        for (var i = 0; i < resp.data[0].Lyrics.length; i++) {
            isPlaying.push(false);
        }

        this.setState({ data: resp.data[0], isPlaying: isPlaying, isLoading: false });
    }

    copyLyrics = () => {
        const { data } = this.state;
        const Lyrics = data.Lyrics;
        var copied = data.youtubeTitle + ' (' + data.youtubeLink + ')\n\n';
        Lyrics.forEach(lyric => {
            copied = copied + '[ ' + Math.floor(lyric.start) + 'sec ~ ' + Math.ceil(lyric.end) + 'sec ]\n';
            copied = copied + lyric.text + '\n\n';
        }) 
        copied = copied + 'This Lyrics is copied from S/ING (http://slashing.duckdns.org/view?q=' + this.props.location.query.q + ')';

        const t = document.createElement("textarea");
        document.body.appendChild(t);
        t.value = copied;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);

        alert('가사가 클립 보드에 저장되었습니다!')
    }

    componentDidMount() {
        this.getLyrics();
    }

    render() {
        const {data, isPlaying, isLoading, isVideoOpened} = this.state;
        const Lyrics = data.Lyrics;

        return (
            <div className="view-container">
                {isLoading ? (
                    <div className="loader">
                        Loading Data...
                    </div>
                ) : (
                <div>
                    <header className="view-title-wrapper">
                        <h2 className="view-title">
                            {data.youtubeTitle}
                        </h2>
                        <div>
                            {data.lastModifiedTime}에 마지막으로 수정됨
                        </div>
                        <div className="edit-button">
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{
                                    fontFamily: "inherit"
                                }}
                                onClick={this.copyLyrics}
                            >
                                copy
                            </Button>
                            <br/> <br/>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{
                                    fontFamily: "inherit"
                                }}
                                onClick={(event) => {
                                    window.location.href='/edit?q=' + this.props.location.query.q;
                                }}
                            >
                                edit
                            </Button>
                        </div>
                    </header>
                    <br/> 
                    <Divider variant="middle"/>
                    <br/>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick = {(event) => {
                            this.setState({isVideoOpened: !isVideoOpened});
                        }}
                        style ={{
                            padding: "10px",
                            fontFamily: 'inherit'
                        }}
                        startIcon={isVideoOpened ? <ExpandLess /> : <ExpandMore />}
                    >
                        {isVideoOpened ? "Close Original Video" : "Open Original Video"}
                    </Button>
                    <br/>
                    <Collapse in={isVideoOpened} timeout="auto" unmountOnExit>
                        <br/>
                        <ReactPlayer
                            url={data.youtubeLink}
                            playing
                            loop={true}
                            controls={true}
                            width="500px"
                            height="280px"
                            style={{
                                display: 'inline-block'
                            }}
                        />
                    </Collapse>
                    <br/>
                    <Divider variant="middle"/>
                    <br/> <br/>
                    {Lyrics.map((lyric, index) => {
                        const start = Math.floor(lyric.start);
                        const end = Math.ceil(lyric.end);
                        
                        const start_min = Math.floor(start / 60);
                        const start_sec = start % 60;
                        const end_min = Math.floor(end / 60);
                        const end_sec = end % 60;

                        var start_time;
                        var end_time;

                        if (start_min < 1) {
                            start_time = start + '초';
                        }
                        else {
                            start_time = start_min + '분 ' + start_sec + '초';
                        }

                        if (end_min < 1) {
                            end_time = end + '초';
                        }
                        else {
                            end_time = end_min + '분 ' + end_sec + '초';
                        }

                        const texts = lyric.text.split('\n');

                        return (
                            <div key={index}>
                                <div className="video-wrapper">
                                    <ReactPlayer
                                        key={index}
                                        playing={isPlaying[index]}
                                        url={data.youtubeLink}
                                        loop = {true}
                                        controls={false}
                                        width="300px"
                                        height="200px"
                                        style={{
                                            float: 'left',
                                            pointerEvents: 'none'
                                        }}
                                        config={{
                                            youtube: {
                                                playerVars: {
                                                    start: start,
                                                    end: end
                                                }
                                            }
                                        }}
                                    />
                                    <div className="lyric-segment">
                                        <IconButton
                                            color="secondary"
                                            component="span"
                                            onClick = {(event) => {
                                                var nPlaying = [];
                                                for (var i = 0; i < isPlaying.length; i++) {
                                                    nPlaying.push(false);
                                                }
                                                nPlaying[index] = !isPlaying[index];

                                                this.setState({isPlaying: nPlaying});
                                            }}
                                        >
                                        {
                                            isPlaying[index] ? (
                                                <PauseCircleOutlineIcon style={{fontSize:"45px"}}/>                                        
                                            ) : (
                                                <PlayCircleOutlineIcon style={{fontSize:"45px"}}/>
                                            )
                                        }
                                        </IconButton>
                                        <span className="lyric-interval">
                                            {start_time + ' ~ ' + end_time}
                                        </span>
                                        <div className="video-segment-lyric">
                                            {texts.map((t, index) => {
                                                return (
                                                    <span key={index} className="text-segment">
                                                        {t} <br/>
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <br/>
                            </div>
                        );
                    })}
                </div>
                )}
                <div className="edit-button-for-mini">
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{
                            display:'inline-block',
                            fontFamily: "inherit"
                        }}
                        onClick={this.copyLyrics}
                    >
                        copy
                    </Button>
                    {'   '}
                    <Button
                        variant="contained"
                        color="primary"
                        style={{
                            display: 'inline-block',
                            fontFamily: "inherit"
                        }}
                        onClick={(event) => {
                            window.location.href='/edit?q=' + this.props.location.query.q;
                        }}
                    >
                        edit
                    </Button>
                </div>
            </div>
        );
    }
}

export default View;