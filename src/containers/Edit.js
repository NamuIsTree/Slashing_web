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
import TextField from '@material-ui/core/TextField';

import ReactPlayer from 'react-player';

import './Edit.css';

class Edit extends React.Component {
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
    
    updateLyrics = async() => {
        const _id = this.props.location.query.q;
        var resp = await axios.post('http://slashing.duckdns.org:8080/edit/lyric', { _id: _id, Lyrics: this.state.data.Lyrics});

        if (resp.result === 0) {
            alert('수정에 문제가 발생했습니다.\n관리자에게 연락 바랍니다.');
        }
        else {
            alert('정상적으로 수정되었습니다.');
            window.location.href = '/view?q=' + _id;
        }
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
                        <div className="save-button">
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{
                                    fontFamily: "inherit"
                                }}
                                onClick={this.updateLyrics}
                            >
                                save
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
                                    <span className="lyric-segment">
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
                                            {start + '초 ~ ' + end + '초'}
                                        </span>
                                        <div className="video-segment-lyric">
                                            <TextField
                                                variant="outlined"
                                                multiline
                                                value={lyric.text}
                                                style={{
                                                    width: "350px",
                                                    fontFamily: "inherit"
                                                }}
                                                onChange = {(event) => {
                                                    var nData = data;
                                                    nData.Lyrics[index].text = event.target.value;
                                                    this.setState({data: nData});
                                                }}
                                            />

                                        </div>
                                    </span>
                                </div>
                                <br/>
                            </div>
                        );
                    })}
                </div>
                )}
                <div className="save-button-for-mini">
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{
                            fontFamily: "inherit"
                        }}
                        onClick={this.updateLyrics}
                    >
                        save
                    </Button>
                </div>
            </div>
        );
    }
}

export default Edit;