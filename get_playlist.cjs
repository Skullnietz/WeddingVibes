const https = require('https');
const fs = require('fs');

const url = 'https://open.spotify.com/playlist/4bl2WwIx291W46C25nixgY';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        fs.writeFileSync('playlist_html.html', data);
        console.log('Saved to playlist_html.html');
    });
}).on('error', (err) => {
    console.log('Error: ' + err.message);
});
