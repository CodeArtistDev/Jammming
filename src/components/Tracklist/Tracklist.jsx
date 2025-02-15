import React from 'react';
import styles from './Tracklist.module.css';
import Track from '../Track/Track';

function Tracklist({ searchResults, handleAdd, isRemoval }) {
  return (
    <div className={styles.tracklist}>
      {searchResults.length > 0 ? ( searchResults.map((track) => (

        <Track 
        track={track}
        key = {track.id}
        handleAdd={handleAdd}
        isRemoval={isRemoval}
        />

      ))
      ) : (
        <p>No tracks found.</p>
      )}
    </div>
  )
}

export default Tracklist;