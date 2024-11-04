const clientId = '98e14b7394344007be6b1c8e067a2f9d';
const clientSecret = '6e61596b01774725a12b8d5d468a6064';
let token = '';

document.getElementById('searchButton').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  if (!username) return alert('Masukkan nama Anda!');
  
  document.getElementById('loadingMessage').style.display = 'block';
  document.getElementById('result').innerHTML = '';

  if (!token) {
    token = await getSpotifyToken();
  }

  const song = await searchSongByUsername(username);
  document.getElementById('loadingMessage').style.display = 'none';
  
  if (song) {
    document.getElementById('result').innerHTML = `
      <h3>Lagu untuk ${username}</h3>
      <p>${song.name} - ${song.artists[0].name}</p>
      <audio controls>
        <source src="${song.preview_url}" type="audio/mpeg">
        Browser Anda tidak mendukung pemutar audio.
      </audio>
    `;
  } else {
    document.getElementById('result').innerHTML = '<p>Tidak ada lagu yang ditemukan.</p>';
  }
});

async function getSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  return data.access_token;
}

async function searchSongByUsername(username) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${username}&type=track&limit=1`, {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  });
  const data = await response.json();
  return data.tracks.items[0];
}
