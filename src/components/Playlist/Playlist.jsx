import React from 'react';
import styles from './Playlist.module.css';
import Track from '../Track/Track';


function Playlist({ playlist, playlistName, setPlaylistName, handleRemove, handleSavePlaylist, handleLogOut }) {

const handleChange = (e) => {
  setPlaylistName(e.target.value);
}

  return (
    <div className={styles.playlist}>
      <h2>Playlist</h2>
      <input 
       type="text"
       value={playlistName}
       className={styles.input}
       placeholder={playlistName}
       onChange={(e) => handleChange(e)}
      />
      {playlist.length > 0 ? (
        playlist.map((track) => (
        <div key={track.id}>
        <Track 
         track={track}
         key={track.id}
         isRemoval={true}
         handleRemove={handleRemove}
         />
         </div>
      ))

      ) : (
      <p>No songs added</p>
      ) }
      <div className={styles.buttons}>
      <button className={styles.buttonSpotify} onClick={handleSavePlaylist} >Save to Spotify</button>
      <button className={styles.buttonSpotify} onClick={handleLogOut}>Log out from Spotify</button>
      </div>
    </div>
  )
}

export default Playlist;