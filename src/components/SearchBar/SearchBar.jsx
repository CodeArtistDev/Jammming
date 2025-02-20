import React from 'react';
import styles from './SearchBar.module.css';

function SearchBar({ setSearchTrack, handleSearch, searchTrack }) {
  return (
    <div className={styles.searchBar}>
      <input className={styles.input}
        type="text" 
        value={searchTrack}
        placeholder={"Search for a song"}
        onChange={(e) => {setSearchTrack(e.target.value)}} />
      <button className={styles.button} onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchBar;