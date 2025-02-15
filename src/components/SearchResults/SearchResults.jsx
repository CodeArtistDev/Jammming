import React from 'react';
import styles from './SearchResults.module.css';
import Tracklist from '../Tracklist/Tracklist';

function SearchResults({ searchResults, handleAdd}) {
  return (
    <div className={styles.searchResults}>
      <h2>Search Results</h2>
      <Tracklist searchResults={searchResults}  handleAdd={handleAdd} isRemoval={false} />
    </div>
  )
}

export default SearchResults;