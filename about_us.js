$(document).ready(function(){
    // Hide hero titles initially
    $('.hero__title').css({
        opacity: 0,
        transform: 'translateY(50px)'
    });
    
    // Hide pastor bio initially
    $('.pastor-bio').css({
        opacity: 0,
        transform: 'translateY(100%)'
    });
    
    // Track which elements have been animated
    var animatedTitles = {};
    var pastorBioAnimated = false;
    
    // Animate on scroll
    $(window).on('scroll', function(){
        var scrollPosition = $(window).scrollTop();
        var windowHeight = $(window).height();
        
        // Animate each hero title when it comes into view
        $('.hero__title').each(function(index){
            var $title = $(this);
            var titleOffset = $title.offset().top;
            
            if (!animatedTitles[index] && scrollPosition + windowHeight > titleOffset + 100) {
                animatedTitles[index] = true;
                $title.animate({
                    opacity: 1
                }, {
                    duration: 800,
                    queue: false
                });
                $title.css({
                    transition: 'transform 0.8s ease-out',
                    transform: 'translateY(0)'
                });
            }
        });
        
        // Animate pastor bio emerging from image
        var $pastorBio = $('.pastor-bio');
        if ($pastorBio.length > 0) {
            var bioOffset = $pastorBio.parent().offset().top;
            
            if (!pastorBioAnimated && scrollPosition + windowHeight > bioOffset + 200) {
                pastorBioAnimated = true;
                $pastorBio.animate({
                    opacity: 1
                }, {
                    duration: 600,
                    queue: false
                });
                $pastorBio.css({
                    transition: 'transform 0.6s ease-out',
                    transform: 'translateY(0)'
                });
            }
        }
    });
    
    // Trigger scroll event on load to check initial visibility
    $(window).trigger('scroll');
});
