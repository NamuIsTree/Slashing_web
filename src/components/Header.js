import React from 'react';
import { Link } from 'react-router';

import './Header.css'

const MenuItem = ({children, to}) => (
    <Link to={to} className="menu-item">
        {children}
    </Link>
)

const Header = (props, context) => {
    const { router } = context;
    return (
        <div className="header-container">
            <a href="/">
                <header className="web-header">
                    <h1>S/ing Demo</h1>
                </header>
            </a>
            <nav className="web-menu">
                <MenuItem to={'/'}>
                    Home
                </MenuItem>
                {' | '}
                <MenuItem to={'/private'}>
                    Private
                </MenuItem>
                <br/> <br/>
            </nav>
        </div>
    )
}

export default Header;