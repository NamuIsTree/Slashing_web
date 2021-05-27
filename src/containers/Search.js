import React from 'react';
import axios from 'axios';

import Divider from '@material-ui/core/Divider';

import './Search.css';

class Search extends React.Component {
    state = {
        search_key: "",
        resultList: []
    }

    getList = async () => {
        const search_key = this.props.location.query.q;
        console.log(search_key);
        var resp = await axios.post('http://slashing.duckdns.org:8080/find', { search_key: search_key });
        
        this.setState({ search_key: search_key, resultList: resp.data });
    }

    componentDidMount() {
        this.getList();
    }

    render() {
        const {search_key, resultList} = this.state;
        
        return (
            <div className="search-container">
                <h3>"{search_key}"에 대한 검색 결과입니다.</h3>
                <Divider variant="middle"/>
                {resultList.map((index, data) => {
                    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                    var match = resultList[data].youtubeLink.match(regExp);
                    const imgsrc = 'https://img.youtube.com/vi/' + match[7] + '/0.jpg';
                    const imgalt = 'video-thumbnail-' + data;
                    return (
                        <a key={resultList[data]._id} href={"/view?q=" + resultList[data]._id}>
                            <div className="video-container">
                                <img src={imgsrc} alt={imgalt} width="200px" />
                                <div>{resultList[data].youtubeTitle} </div>
                            </div>
                        </a>
                    )
                })}
            </div>

        )
    }
}

export default Search;