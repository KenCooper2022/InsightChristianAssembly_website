$(document).ready(function(){
    // Hide scripture hero initially
    $('.scripture-hero').css({
        opacity: 0,
        transform: 'translateY(-30px)'
    });
    
    var scriptureAnimated = false;
    
    // Animate on scroll
    $(window).on('scroll', function(){
        var scrollPosition = $(window).scrollTop();
        var windowHeight = $(window).height();
        
        // Animate scripture hero when it comes into view
        var $scriptureHero = $('.scripture-hero');
        if ($scriptureHero.length > 0) {
            var heroOffset = $scriptureHero.offset().top;
            
            if (!scriptureAnimated && scrollPosition + windowHeight > heroOffset + 50) {
                scriptureAnimated = true;
                $scriptureHero.animate({
                    opacity: 1
                }, {
                    duration: 800,
                    queue: false
                });
                $scriptureHero.css({
                    transition: 'transform 0.8s ease-out',
                    transform: 'translateY(0)'
                });
            }
        }
    });
    
    // Trigger scroll event on load to check initial visibility
    $(window).trigger('scroll');
});
