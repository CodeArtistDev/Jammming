import React from 'react';
import styles from './Track.module.css';

function Track({ track, handleAdd, handleRemove, isRemoval}) {

const renderButton = () => {
  if(!isRemoval){
    return (
      <button className={styles.button} onClick={() => handleAdd(track) }>+</button>
    )
  }
  return (
    <button className={styles.button} onClick={() => handleRemove(track) }>-</button>
  )
}
  
  return (
    <div className={styles.track}>
      <div className={styles.info}>
        <h3 className={styles.songTitle}>{track.song}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      {renderButton()}
      
    </div>
  )
}

export default Track;