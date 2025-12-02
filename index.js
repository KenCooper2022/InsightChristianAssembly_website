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

$('#moreInfoTrigger').on('click', function(){
    $(this).toggleClass('active');
    $('#moreInfoContent').toggleClass('expanded');
});

function loadLatestYouTubeVideo() {
    var container = $('#youtube_embed_container');
    
    $.ajax({
        url: '/api/latest-video',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.error) {
                container.html('<p class="video_error">Unable to load video. Please check back later.</p>');
                console.log('YouTube API Error:', data.error);
                return;
            }
            
            var embedHtml = '<div class="video_wrapper">' +
                '<iframe src="https://www.youtube.com/embed/' + data.videoId + 
                '?rel=0" title="' + data.title + 
                '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
                '</div>' +
                '<p class="video_title">' + data.title + '</p>';
            
            container.html(embedHtml);
        },
        error: function() {
            container.html('<p class="video_error">Unable to load video. Please check back later.</p>');
        }
    });
}

$(document).ready(function(){
    loadLatestYouTubeVideo();
});
