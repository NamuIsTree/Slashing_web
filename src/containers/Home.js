import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import './Home.css';

class Home extends React.Component {
    state = {
        search_key: ""
    }

    search = () => {
        var skey = this.state.search_key;

        if (skey === "") {
            alert('검색어를 입력해주세요!');
            return;
        }

        skey = encodeURIComponent(skey);

        window.location.href = '/search?q=' + skey;
    }

    handleKeyPress = e => {
        if (e.key === 'Enter') {
            this.search();
        }
    }

    render() {
        console.log(this.state.search_key);
        return (
            <div className="home-container">
                <TextField
                    onChange={(event) => {
                        try {
                            this.setState({search_key: event.target.value});
                        } catch(e) {}
                    }}
                    placeholder="Youtube Video Title"
                    style = {{
                        width: '50%',
                        maxWidth: '500px'
                    }}
                    InputProps = {{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        )
                    }}
                    onKeyPress={this.handleKeyPress}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "20px"}}
                    onClick={this.search}
                >검색</Button>
            </div>
        );
    }

}

export default Home;