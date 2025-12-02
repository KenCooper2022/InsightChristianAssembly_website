#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
import urllib.request
import urllib.error
from datetime import datetime, timedelta

PORT = 5000
DIRECTORY = "."
CACHE_FILE = "youtube_cache.json"
CACHE_DURATION_DAYS = 7

YOUTUBE_API_KEY = os.environ.get('YOUTUBE_API_KEY', '')
CHANNEL_ID = 'UCYourChannelID'

def get_cached_video():
    try:
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, 'r') as f:
                cache = json.load(f)
                cached_time = datetime.fromisoformat(cache.get('cached_at', '2000-01-01'))
                if datetime.now() - cached_time < timedelta(days=CACHE_DURATION_DAYS):
                    return cache.get('video_data')
    except Exception as e:
        print(f"Cache read error: {e}")
    return None

def save_to_cache(video_data):
    try:
        cache = {
            'cached_at': datetime.now().isoformat(),
            'video_data': video_data
        }
        with open(CACHE_FILE, 'w') as f:
            json.dump(cache, f)
    except Exception as e:
        print(f"Cache write error: {e}")

def fetch_latest_video():
    if not YOUTUBE_API_KEY:
        return {'error': 'YouTube API key not configured'}
    
    try:
        uploads_playlist_id = 'UU' + CHANNEL_ID[2:]
        url = f'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={uploads_playlist_id}&maxResults=1&key={YOUTUBE_API_KEY}'
        
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            
            if 'items' in data and len(data['items']) > 0:
                video = data['items'][0]['snippet']
                video_data = {
                    'videoId': video['resourceId']['videoId'],
                    'title': video['title'],
                    'publishedAt': video['publishedAt'],
                    'thumbnail': video['thumbnails'].get('high', {}).get('url', ''),
                    'description': video.get('description', '')[:200]
                }
                save_to_cache(video_data)
                return video_data
            return {'error': 'No videos found'}
    except urllib.error.HTTPError as e:
        return {'error': f'YouTube API error: {e.code}'}
    except Exception as e:
        return {'error': str(e)}

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def do_GET(self):
        if self.path == '/api/latest-video':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            cached = get_cached_video()
            if cached:
                self.wfile.write(json.dumps(cached).encode())
            else:
                video_data = fetch_latest_video()
                self.wfile.write(json.dumps(video_data).encode())
            return
        
        return super().do_GET()
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

os.chdir(DIRECTORY)

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with ReusableTCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running at http://0.0.0.0:{PORT}/")
    httpd.serve_forever()
