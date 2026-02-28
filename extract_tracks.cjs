const fs = require('fs');

const html = fs.readFileSync('playlist_html.html', 'utf8');
const regex = /<meta property="music:song" content="https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)"/g;
let match;
const tracks = [];

while ((match = regex.exec(html)) !== null) {
    tracks.push(match[1]);
}

console.log(tracks);
