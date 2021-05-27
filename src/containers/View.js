import React from 'react';
import axios from 'axios';

import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';

import ReactPlayer from 'react-player';

import './View.css';

class View extends React.Component {
    state = {
        data: [],
        isPlaying: [],
        isLoading: true
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

    componentDidMount() {
        this.getLyrics();
    }

    render() {
        const {data, isPlaying, isLoading} = this.state;
        const Lyrics = data.Lyrics;

        return (
            <div className="view-container">
                {isLoading ? (
                    <div className="loader">
                        Loading Data...
                    </div>
                ) : (
                <div>
                    <h2 className="view-title">
                        {data.youtubeTitle}
                    </h2>
                    <div>
                        {data.lastModifiedTime} 수정됨
                    </div>
                    <br/> <br/>
                    {Lyrics.map((lyric, index) => {
                        const start = Math.floor(lyric.start);
                        const end = Math.ceil(lyric.end);
                        return (
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
                                        display:'inline-block'
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
                                <br/>
                                <IconButton
                                    color="secondary"
                                    component="span"
                                    onClick = {(event) => {
                                        var nPlaying = isPlaying;
                                        nPlaying[index] = !nPlaying[index];
                                        this.setState({isPlaying: nPlaying});
                                    }}
                                > 
                                {
                                    isPlaying[index] ? (
                                        <PauseCircleOutlineIcon fontSize="large"/>                                        
                                    ) : (
                                        <PlayCircleOutlineIcon fontSize="large"/>
                                    )
                                }
                                </IconButton>
                                <div className="video-segment-lyric">
                                    {lyric.text}
                                </div>
                                <br/>
                            </div>
                        );
                    })}
                </div>
                )}
            </div>
        );
    }
}

export default View;