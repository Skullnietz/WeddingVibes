const https = require('https');
const fs = require('fs');
const path = require('path');

// To get public playlist tracks without an API key, we can often request the embed JSON
const embedUrl = 'https://open.spotify.com/oembed?url=spotify:playlist:4bl2WwIx291W46C25nixgY';

https.get(embedUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log("\n=== PLAYLIST INFOMATION ===");
            console.log("Title:", parsed.title);
            console.log("Description:", parsed.description || "N/A");

            // Wait, the oembed just gives high level info. 
            // We need to request the token from the web player's JS directly to authorize a real API call.
            console.log("Fetching anonymous token...");
            https.get('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                }
            }, (tokenRes) => {
                let tokenData = '';
                tokenRes.on('data', chunk => tokenData += chunk);
                tokenRes.on('end', () => {
                    const tokenParsed = JSON.parse(tokenData);
                    const token = tokenParsed.accessToken || tokenParsed.clientId;
                    if (!token) {
                        console.log("Failed to get anonymous token");
                        return;
                    }

                    console.log("Got token, fetching tracks...");
                    const options = {
                        hostname: 'api.spotify.com',
                        path: '/v1/playlists/4bl2WwIx291W46C25nixgY',
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    };

                    const req = https.request(options, (apiRes) => {
                        let apiData = '';
                        apiRes.on('data', chunk => apiData += chunk);
                        apiRes.on('end', () => {
                            const playlist = JSON.parse(apiData);
                            if (playlist.error) {
                                console.error("API Error:", playlist.error.message);
                                return;
                            }

                            const tracks = playlist.tracks.items.map(item => {
                                const t = item.track;
                                return {
                                    title: t.name,
                                    artist: t.artists.map(a => a.name).join(', '),
                                    album: t.album.name,
                                    previewUrl: t.preview_url
                                };
                            });

                            const mdPath = 'C:/Users/black/.gemini/antigravity/brain/d3580bdd-0949-4fc2-97b6-415180cbcdb2/playlist_extraction.md';
                            const markdown = `# Lista de Canciones de la Boda\n\n` +
                                tracks.map((t, i) => `${i + 1}. **${t.title}** - ${t.artist} *(Álbum: ${t.album})*`).join('\n');

                            fs.writeFileSync(mdPath, markdown);
                            console.log(`\nSuccessfully saved ${tracks.length} tracks to the artifact folder!`);
                        });
                    });
                    req.on('error', console.error);
                    req.end();
                });
            });

        } catch (e) {
            console.error(e);
        }
    });
});
