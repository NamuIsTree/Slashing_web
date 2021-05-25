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
        window.location.href = '/search?q=' + this.state.search_key;
    }

    render() {
        console.log(this.state.search_key);
        return (
            <div className="home-container">
                <TextField
                    className = "search-bar"
                    onChange={(event) => {
                        try {
                            this.setState({search_key: event.target.value});
                        } catch(e) {}
                    }}
                    InputProps = {{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        )
                    }}
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