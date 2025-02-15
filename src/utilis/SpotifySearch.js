import { getAccessToken } from './SpotifyAuth';

const searchEndpoint = 'https://api.spotify.com/v1/search?type=track';


export async function spotifySearch(searchTrack) {
    const accessToken = getAccessToken();

    if(!accessToken){
        console.error('No access token available');
        return ;
    }

    try{
        const response = await fetch(`${searchEndpoint}&q=${encodeURIComponent(searchTrack)}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(!response.ok){
            throw new Error(`Spotify API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.tracks.items.map(track => ({
            id: track.id,
            artist: track.artists[0].name,
            song: track.name,
            album: track.album.name,
            uri: track.uri
        }))

    }catch(e){
        console.error("Error fetching data from the Spotify API:", e);
        return [];
    }
}