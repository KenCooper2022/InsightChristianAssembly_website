const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = 5000;
const CACHE_FILE = 'youtube_cache.json';
const CACHE_DURATION_DAYS = 7;
const LIVE_CHECK_INTERVAL_MINUTES = 5;
const SHORTS_MAX_DURATION = 60;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const CHANNEL_ID = process.env.CHANNEL_ID || 'UCYourChannelID';

let lastLiveCheck = null;
let cachedLiveStream = null;

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

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, { timeout: 10000 }, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(new Error('Failed to parse response'));
                }
            });
        });
        request.on('error', reject);
        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

function parseDuration(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
}

async function checkForLiveStream() {
    if (!YOUTUBE_API_KEY) {
        return null;
    }

    const now = new Date();
    if (lastLiveCheck && (now - lastLiveCheck) < LIVE_CHECK_INTERVAL_MINUTES * 60 * 1000) {
        return cachedLiveStream;
    }

    try {
        const liveUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`;
        const liveData = await httpsGet(liveUrl);
        
        lastLiveCheck = now;

        if (liveData.items && liveData.items.length > 0) {
            const liveVideo = liveData.items[0];
            cachedLiveStream = {
                videoId: liveVideo.id.videoId,
                title: liveVideo.snippet.title,
                publishedAt: liveVideo.snippet.publishedAt,
                thumbnail: liveVideo.snippet.thumbnails?.high?.url || liveVideo.snippet.thumbnails?.default?.url || '',
                description: (liveVideo.snippet.description || '').slice(0, 200),
                isLive: true
            };
            console.log(`Live stream found: "${cachedLiveStream.title}"`);
            return cachedLiveStream;
        } else {
            cachedLiveStream = null;
            return null;
        }
    } catch (err) {
        console.log('Live stream check error:', err.message);
        cachedLiveStream = null;
        return null;
    }
}

async function fetchLatestVideo() {
    if (!YOUTUBE_API_KEY) {
        return { error: 'YouTube API key not configured' };
    }

    try {
        const liveStream = await checkForLiveStream();
        if (liveStream) {
            return liveStream;
        }

        const uploadsPlaylistId = 'UU' + CHANNEL_ID.slice(2);
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=15&key=${YOUTUBE_API_KEY}`;
        
        const playlistData = await httpsGet(playlistUrl);
        
        if (!playlistData.items || playlistData.items.length === 0) {
            return { error: 'No videos found' };
        }

        const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
        
        const videosData = await httpsGet(videosUrl);
        
        if (!videosData.items || videosData.items.length === 0) {
            return { error: 'Could not fetch video details' };
        }

        for (const video of videosData.items) {
            const duration = parseDuration(video.contentDetails.duration);
            
            if (duration > SHORTS_MAX_DURATION) {
                const videoData = {
                    videoId: video.id,
                    title: video.snippet.title,
                    publishedAt: video.snippet.publishedAt,
                    thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || '',
                    description: (video.snippet.description || '').slice(0, 200),
                    duration: duration,
                    isLive: false
                };
                saveToCache(videoData);
                console.log(`Found full video: "${videoData.title}" (${duration} seconds)`);
                return videoData;
            } else {
                console.log(`Skipping Short: "${video.snippet.title}" (${duration} seconds)`);
            }
        }

        return { error: 'No full-length videos found (only Shorts)' };
        
    } catch (err) {
        console.log('YouTube API error:', err.message);
        return { error: err.message };
    }
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

    const liveStream = await checkForLiveStream();
    if (liveStream) {
        return res.json(liveStream);
    }

    const cached = getCachedVideo();
    if (cached && !cached.isLive) {
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
