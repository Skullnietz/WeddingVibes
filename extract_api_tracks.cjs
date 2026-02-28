const fs = require('fs');
const https = require('https');

async function extractTracks() {
    try {
        console.log("Fetching Spotify embed JSON...");
        // Spotify Embed actually has an API endpoint we can hit for the embed payload directly!
        const embedApiUrl = 'https://open.spotify.com/oembed?url=spotify:playlist:4bl2WwIx291W46C25nixgY';

        https.get(embedApiUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const oembedData = JSON.parse(data);

                // For a more comprehensive track list without authentication, we usually parse the initial HTML payload of the public page
                const playlistUrl = 'https://open.spotify.com/playlist/4bl2WwIx291W46C25nixgY';
                https.get(playlistUrl, {
                    headers: {
                        // Pretend to be a browser to get SSR HTML
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                }, (pageRes) => {
                    let pageData = '';
                    pageRes.on('data', chunk => pageData += chunk);
                    pageRes.on('end', () => {
                        // The initial state is stored in a script tag with id 'initial-state'
                        const regex = /<script id="initial-state" type="text\/plain">(.*?)<\/script>/;
                        const match = pageData.match(regex);

                        if (match && match[1]) {
                            const stateStr = Buffer.from(match[1], 'base64').toString('utf8');
                            const state = JSON.parse(stateStr);

                            // Find the playlist entities
                            const trackItems = [];

                            // Dive into the complex state object (it varies, we search for track entities)
                            for (const key in state) {
                                if (key.startsWith('spotify:track:')) {
                                    try {
                                        const trackInfo = state[key];
                                        const trackName = trackInfo?.name;
                                        // This is a rough extraction as Spotify's internal SSR state structure is heavily obfuscated
                                        if (trackName) {
                                            trackItems.push({
                                                id: key,
                                                name: trackName,
                                            });
                                        }
                                    } catch (e) { }
                                }
                            }

                            // Let's also try a more direct regex on the HTML for track names
                            // looking for aria-label="Play [Song Name] by [Artist]"
                            const trackRegex = /aria-label="Play (.*?) by (.*?)"/g;
                            let trackMatch;
                            const simpleTrackList = [];
                            while ((trackMatch = trackRegex.exec(pageData)) !== null) {
                                simpleTrackList.push({
                                    song: trackMatch[1].replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&"),
                                    artist: trackMatch[2].replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&")
                                });
                            }

                            const uniqueTracks = [];
                            const seen = new Set();
                            for (const t of simpleTrackList) {
                                const key = `${t.song}-${t.artist}`;
                                if (!seen.has(key)) {
                                    seen.add(key);
                                    uniqueTracks.push(t);
                                }
                            }

                            console.log(`\n=== FOUND ${uniqueTracks.length} TRACKS ===\n`);
                            uniqueTracks.forEach((t, i) => {
                                console.log(`${i + 1}. ${t.song} - ${t.artist}`);
                            });

                            const markdownList = `# Wedding Playlist Extraction\n\n` + uniqueTracks.map((t, i) => `${i + 1}. **${t.song}** - ${t.artist}`).join('\n');
                            fs.writeFileSync('C:/Users/black/.gemini/antigravity/brain/d3580bdd-0949-4fc2-97b6-415180cbcdb2/playlist_extraction.md', markdownList);
                            console.log("\nResults saved to playlist_extraction.md");

                        } else {
                            console.log("Failed to find initial state script");
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

extractTracks();
