function element_dropdown(element){
    $(element)
        .hide()
        .css('opacity' ,0)
        .slideDown('slow')
        .animate({opacity:1},
                  {queue:false,duration:'slow'}

        )
}

//animate on refresh 
$(document).ready(function(){
    element_dropdown('#announcement_dropdown');
    
    // Hide welcome section initially
    $('#welcome_section .welcome_content').hide().css('opacity', 0);
    
    // Hide plan visit section initially
    $('#plan_visit_section .plan_visit_content').hide().css('opacity', 0);
    $('#plan_visit_section .plan_visit_cards').hide().css('opacity', 0);
    
    // Track if animations have played
    var welcomeAnimated = false;
    var planVisitAnimated = false;
    
    // Animate sections on scroll
    $(window).on('scroll', function(){
        var scrollPosition = $(window).scrollTop();
        var windowHeight = $(window).height();
        
        // Welcome section animation
        var welcomeSection = $('#welcome_section');
        var welcomeOffset = welcomeSection.offset().top;
        
        if (!welcomeAnimated && scrollPosition + windowHeight > welcomeOffset + 100) {
            welcomeAnimated = true;
            $('#welcome_section .welcome_content')
                .slideDown('slow')
                .animate({opacity: 1}, {queue: false, duration: 'slow'});
        }
        
        // Plan a Visit section animation
        var planVisitSection = $('#plan_visit_section');
        var planVisitOffset = planVisitSection.offset().top;
        
        if (!planVisitAnimated && scrollPosition + windowHeight > planVisitOffset + 100) {
            planVisitAnimated = true;
            $('#plan_visit_section .plan_visit_content')
                .slideDown('slow')
                .animate({opacity: 1}, {queue: false, duration: 'slow'});
            
            // Animate cards with a slight delay
            setTimeout(function(){
                $('#plan_visit_section .plan_visit_cards')
                    .slideDown('slow')
                    .animate({opacity: 1}, {queue: false, duration: 'slow'});
            }, 300);
        }
    });
});

$('#x_button').on('click',function(){
    $('#announcement_dropdown')
    .slideUp('slow')

});

var YOUTUBE_CONFIG = {
    API_KEY: 'AIzaSyDIa7kCQwpPdp8P4VScRMgfzw8UFGQA24I',
    CHANNEL_ID: 'UCCBgiwEdpxE2OkFvPAqMJ3w',
    SHORTS_MAX_DURATION: 60
};

function parseDuration(duration) {
    var match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    var hours = parseInt(match[1] || 0);
    var minutes = parseInt(match[2] || 0);
    var seconds = parseInt(match[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
}

function displayVideo(data) {
    var container = $('#youtube_embed_container');
    var liveIndicator = data.isLive ? '<span class="live_indicator">LIVE</span>' : '';
    var sectionTitle = data.isLive ? 'Live Now' : 'Latest Message';
    
    $('.video_section_content h2').text(sectionTitle);
    $('.video_subtitle').text(data.isLive ? 'Watch our live stream' : 'Watch our most recent sermon');
    
    var embedHtml = '<div class="video_wrapper">' +
        '<iframe src="https://www.youtube.com/embed/' + data.videoId + 
        '?rel=0' + (data.isLive ? '&autoplay=1' : '') + '" title="' + data.title + 
        '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
        '</div>' +
        '<p class="video_title">' + liveIndicator + data.title + '</p>';
    
    container.html(embedHtml);
}

function checkForLiveStream() {
    return new Promise(function(resolve) {
        var liveUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + 
            YOUTUBE_CONFIG.CHANNEL_ID + '&eventType=live&type=video&key=' + YOUTUBE_CONFIG.API_KEY;
        
        $.ajax({
            url: liveUrl,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.items && data.items.length > 0) {
                    var liveVideo = data.items[0];
                    resolve({
                        videoId: liveVideo.id.videoId,
                        title: liveVideo.snippet.title,
                        isLive: true
                    });
                } else {
                    resolve(null);
                }
            },
            error: function() {
                resolve(null);
            }
        });
    });
}

function fetchLatestVideo() {
    return new Promise(function(resolve, reject) {
        var uploadsPlaylistId = 'UU' + YOUTUBE_CONFIG.CHANNEL_ID.slice(2);
        var playlistUrl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + 
            uploadsPlaylistId + '&maxResults=15&key=' + YOUTUBE_CONFIG.API_KEY;
        
        $.ajax({
            url: playlistUrl,
            method: 'GET',
            dataType: 'json',
            success: function(playlistData) {
                if (!playlistData.items || playlistData.items.length === 0) {
                    reject('No videos found');
                    return;
                }
                
                var videoIds = playlistData.items.map(function(item) {
                    return item.snippet.resourceId.videoId;
                }).join(',');
                
                var videosUrl = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=' + 
                    videoIds + '&key=' + YOUTUBE_CONFIG.API_KEY;
                
                $.ajax({
                    url: videosUrl,
                    method: 'GET',
                    dataType: 'json',
                    success: function(videosData) {
                        if (!videosData.items || videosData.items.length === 0) {
                            reject('Could not fetch video details');
                            return;
                        }
                        
                        for (var i = 0; i < videosData.items.length; i++) {
                            var video = videosData.items[i];
                            var duration = parseDuration(video.contentDetails.duration);
                            
                            if (duration > YOUTUBE_CONFIG.SHORTS_MAX_DURATION) {
                                resolve({
                                    videoId: video.id,
                                    title: video.snippet.title,
                                    isLive: false
                                });
                                return;
                            }
                        }
                        
                        reject('No full-length videos found');
                    },
                    error: function() {
                        reject('Failed to fetch video details');
                    }
                });
            },
            error: function() {
                reject('Failed to fetch playlist');
            }
        });
    });
}

function loadLatestYouTubeVideo() {
    var container = $('#youtube_embed_container');
    
    checkForLiveStream().then(function(liveStream) {
        if (liveStream) {
            displayVideo(liveStream);
            return;
        }
        
        fetchLatestVideo().then(function(video) {
            displayVideo(video);
        }).catch(function(error) {
            container.html('<p class="video_error">Unable to load video. Please check back later.</p>');
            console.log('YouTube Error:', error);
        });
    });
}

$(document).ready(function(){
    loadLatestYouTubeVideo();
    
    setInterval(function() {
        checkForLiveStream().then(function(liveStream) {
            if (liveStream) {
                displayVideo(liveStream);
            }
        });
    }, 60000);
});
