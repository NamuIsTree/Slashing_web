import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from './App';
import Home from './containers/Home';
import Private from './containers/Private';
import Search from './containers/Search';
import View from './containers/View';
import Edit from './containers/Edit';

import './index.css';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/search" component={Search}/>
            <Route path="/view" component={View}/>
            <Route path="/private" component={Private}/>
            <Route path="/edit" component={Edit}/>
        </Route>
    </Router>,
    document.getElementById('root')
);