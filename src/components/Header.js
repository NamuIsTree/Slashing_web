import React from 'react';
import { Link } from 'react-router';

import './Header.css'

const MenuItem = ({children, to}) => (
    <Link to={to} className="menu-item">
        {children}
    </Link>
)

const Header = (props, context) => {
    return (
        <div className="header-container">
            <a href="/" text-decoration="none">
                <header className="web-header">
                    <span className="logo-slogan">Sing Along With The World!</span>
                    <br/>
                    <span className="logo">S<span className="logo-slash">/</span>ING</span>
                    <br/>
                    <span className="sub-logo">S L A S H I N G</span>
                </header>
            </a>
            <nav className="web-menu">
                <MenuItem to={'/'}>
                    Search
                </MenuItem>
                <MenuItem to={'/analysis'}>
                    Analysis
                </MenuItem>
            </nav>
            <br/>
        </div>
    )
}

export default Header;