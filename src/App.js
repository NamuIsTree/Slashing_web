import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';

class App extends React.Component {
    render() {
        return (
            <div className="web-container">
                <Header/>
                    {this.props.children}
                <Footer/>
            </div>
        );
    }
}

export default App;
