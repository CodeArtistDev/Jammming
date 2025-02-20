import { sha256 } from 'js-sha256';
import { encode } from './base64url';


const clientId = '87a875039dec40d99d5cca6a27a59135';
const redirectUri = 'https://jammming-codeartistdev.netlify.app/';
const scope = 'playlist-modify-public playlist-modify-private user-read-private user-read-email';


function generateCodeVerifier() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return encode(array);
}

async function generateCodeChallenge(codeVerifier) {
    const hashed =   await sha256.arrayBuffer(codeVerifier);
    return encode(new Uint8Array(hashed));
}

export async function loginWithSpotify() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem('code_verifier', codeVerifier);

    const authUrl = new URL ('https://accounts.spotify.com/authorize');

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        scope: scope,
    });

    window.location.href = `${authUrl}?${params.toString()}`;
}

export async function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if(!code) {
      console.error("Authorization code not found");
      return;
    }

    const codeVerifier = localStorage.getItem('code_verifier');

    if(!codeVerifier){
        console.error("Code verifier not found in local storage");
        return;
    }

    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
    });
try{
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
        body: body.toString()
    });

    const data = await response.json();

    if(data.access_token){
        localStorage.setItem("spotify_access_token", data.access_token);
        localStorage.setItem(
            "spotify_token_expires",
            Date.now() + data.expires_in * 1000
        );

        window.history.replaceState({}, document.title, redirectUri);

        return data.access_token;

    }
    else{
        console.error("Failed to retrieve access token", data);
    }
    

} catch(e){
    console.error("Error fetching access token:", e);
}
}


export function getAccessToken() {
    const token = localStorage.getItem("spotify_access_token");
    const expiresAt = localStorage.getItem("spotify_token_expires");

    if(token && Date.now() < expiresAt){

        return token;

    }else{
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_token_expires");
        return null;
    }
}

export async function getUserId(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    return data.id;
}

export async function createPlaylist(userId, name, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ name })
    });

    const data = await response.json();
    return data.id;

}


export async function addToPlaylist(playlistId, uris, accessToken) {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ uris })
    });

}

export function clearAccessToken() {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expires');
}


export default loginWithSpotify;