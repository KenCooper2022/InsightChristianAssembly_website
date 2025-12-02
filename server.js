const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = 5000;
const CACHE_FILE = 'youtube_cache.json';
const CACHE_DURATION_DAYS = 7;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const CHANNEL_ID = process.env.CHANNEL_ID || 'UCYourChannelID';

function getCachedVideo() {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
            const cachedTime = new Date(cache.cached_at || '2000-01-01');
            const now = new Date();
            const daysDiff = (now - cachedTime) / (1000 * 60 * 60 * 24);
            
            if (daysDiff < CACHE_DURATION_DAYS) {
                return cache.video_data;
            }
        }
    } catch (err) {
        console.log('Cache read error:', err.message);
    }
    return null;
}

function saveToCache(videoData) {
    try {
        const cache = {
            cached_at: new Date().toISOString(),
            video_data: videoData
        };
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    } catch (err) {
        console.log('Cache write error:', err.message);
    }
}

function fetchLatestVideo() {
    return new Promise((resolve) => {
        if (!YOUTUBE_API_KEY) {
            resolve({ error: 'YouTube API key not configured' });
            return;
        }

        const uploadsPlaylistId = 'UU' + CHANNEL_ID.slice(2);
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${YOUTUBE_API_KEY}`;

        const request = https.get(url, { timeout: 10000 }, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    
                    if (parsed.items && parsed.items.length > 0) {
                        const video = parsed.items[0].snippet;
                        const videoData = {
                            videoId: video.resourceId.videoId,
                            title: video.title,
                            publishedAt: video.publishedAt,
                            thumbnail: video.thumbnails?.high?.url || '',
                            description: (video.description || '').slice(0, 200)
                        };
                        saveToCache(videoData);
                        resolve(videoData);
                    } else {
                        resolve({ error: 'No videos found' });
                    }
                } catch (err) {
                    resolve({ error: 'Failed to parse YouTube response' });
                }
            });
        });

        request.on('error', (err) => {
            resolve({ error: err.message });
        });

        request.on('timeout', () => {
            request.destroy();
            resolve({ error: 'Request timeout' });
        });
    });
}

app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

app.get('/api/latest-video', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json');

    const cached = getCachedVideo();
    if (cached) {
        return res.json(cached);
    }

    const videoData = await fetchLatestVideo();
    res.json(videoData);
});

app.use(express.static('.', {
    index: 'index.html'
}));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
});
