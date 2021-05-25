import React from 'react';
import './Search.css';

const Search = ({router}) => {
    const search_key = router.location.query.q;
    return (
        <div className = "search-container">
            "<span className="search-key">{search_key}</span>"에 대한 검색 결과입니다.
        </div>
    )
}

export default Search;