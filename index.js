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
    
    // Track if animation has played
    var welcomeAnimated = false;
    
    // Animate welcome section on scroll
    $(window).on('scroll', function(){
        var scrollPosition = $(window).scrollTop();
        var welcomeSection = $('#welcome_section');
        var welcomeOffset = welcomeSection.offset().top;
        var windowHeight = $(window).height();
        
        // Trigger animation when welcome section comes into view
        if (!welcomeAnimated && scrollPosition + windowHeight > welcomeOffset + 100) {
            welcomeAnimated = true;
            $('#welcome_section .welcome_content')
                .slideDown('slow')
                .animate({opacity: 1}, {queue: false, duration: 'slow'});
        }
    });
});

$('#x_button').on('click',function(){
    $('#announcement_dropdown')
    .slideUp('slow')

});
