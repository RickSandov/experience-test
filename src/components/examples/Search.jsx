import { useState } from 'react';
import { Search, Typography } from '@ellucian/react-design-system/core';

/**
 * Standard Search
 */
const SearchExample = () => {
    const [search, setSearch] = useState('');
    const [searchEnterPress, setSearchEnterPress] = useState('');
    const [searchKeyDown, setSearchKeyDown] = useState('');
    const [searchKeyUp, setSearchKeyUp] = useState('');

    const handleSearchInvoked = (searchValue) => {
        setSearchEnterPress(searchValue);
    };

    const handleChange = (event) => {
        const { value } = event.target;
        setSearch(value);
    };

    const handleClearClick = () => {
        setSearch('');
        setSearchEnterPress('');
    };

    const handleKeyDown = (event) => {
        setSearchKeyDown(event.key);
    };

    const handleKeyUp = (event) => {
        setSearchKeyUp(event.key);
    };

    return (
        <div>
            <Typography gutterBottom>Press enter to submit.</Typography>
            <Search
                inputProps={{ 'aria-label': 'Search for an item' }}
                id="search-example"
                name="search"
                onSearchInvoked={handleSearchInvoked}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onClear={handleClearClick}
                placeholder="Standard Search"
                value={search}
            />
            <Typography>
                Key down: {searchKeyDown}<br />
                Key up: {searchKeyUp}<br />
                Search invoked: {searchEnterPress}
            </Typography>
        </div>
    );
};

export default SearchExample;
