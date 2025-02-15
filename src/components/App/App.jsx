import React, { useEffect, useState } from 'react';
import SearchBar from "../SearchBar/SearchBar";
import Playlist from "../Playlist/Playlist";
import SearchResults from "../SearchResults/SearchResults";
import styles from './App.module.css';
import { spotifySearch } from '../../utilis/SpotifySearch';
import { loginWithSpotify, getUserId, createPlaylist, addToPlaylist, clearAccessToken } from '../../utilis/SpotifyAuth';
import { getAccessToken, handleCallback } from '../../utilis/SpotifyAuth'



function App() {

const [searchTrack, setSearchTrack] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [playlist, setPlaylist] = useState([]);
const [playlistName, setPlaylistName] = useState('');

useEffect(() => {
  handleCallback();
}, []);
 
const handleSearch = async () => {
  const token = getAccessToken();
  if(!token){
    loginWithSpotify();
  }else{
  const results = await spotifySearch(searchTrack);
  setSearchResults(results);
  }
}

const handleAdd = (track) => {
  
 if(!playlist.some((t) => t.id === track.id)){
   setPlaylist((prev) => [ ...prev, track]);
 }
}

const handleRemove = (track) => {
  setPlaylist((prev) =>  prev.filter((t) => t.id !== track.id) )
}

const handleSavePlaylist = async () => {
  if(playlistName === ''){
    alert('Please provide a playlist name');
    return;
  }
  const accessToken = getAccessToken();

  if(!accessToken){
    loginWithSpotify();
    return;
  }
  
  const userId = await getUserId(accessToken);
  if(playlistName === ''){
    alert('Please provide a playlist name');
  }
  const name = playlistName;
  const playlistId = await createPlaylist(userId, name, accessToken);
  const uris = playlist.map((track) => track.uri);
  await addToPlaylist(playlistId, uris, accessToken);

  setPlaylistName('');
  setPlaylist([]);
  alert('Playlist saved and reset!');
};

const handleLogOut = () => {
  clearAccessToken();
  alert('Log out successful');
};


  return (
    <div className={styles.app}>
      <h1 className={styles.header}>Ja<span className={styles.mmm}>mmm</span>ing</h1>
      <SearchBar setSearchTrack={setSearchTrack} handleSearch={handleSearch} />
      <div className={styles.mainContainer}>
        <SearchResults searchResults={searchResults} handleAdd={handleAdd}/>
        <Playlist playlist={playlist} setPlaylist={setPlaylist} playlistName={playlistName} setPlaylistName={setPlaylistName} handleRemove={handleRemove} handleSavePlaylist={handleSavePlaylist} handleLogOut={handleLogOut} />
      </div>
    </div>
  );
}

export default App;


