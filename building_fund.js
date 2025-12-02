$(document).ready(function(){
    
    function animateValue(element, start, end, duration, prefix) {
        prefix = prefix || '$';
        var startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            var timeElapsed = currentTime - startTime;
            var progress = Math.min(timeElapsed / duration, 1);
            
            var easeProgress = 1 - Math.pow(1 - progress, 3);
            var currentValue = Math.floor(start + (end - start) * easeProgress);
            
            element.text(prefix + currentValue.toLocaleString());
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    function animateProgressBar(progressBar, targetPercent, duration) {
        setTimeout(function() {
            progressBar.css('width', targetPercent + '%');
        }, 100);
    }
    
    function animateTrackers() {
        $('.progress-tracker').each(function() {
            var tracker = $(this);
            var raised = parseInt(tracker.data('raised')) || 0;
            var goal = parseInt(tracker.data('goal')) || 1;
            var percent = Math.round((raised / goal) * 100);
            
            var amountDisplay = tracker.find('.amount-display');
            var goalDisplay = tracker.find('.goal-display');
            var percentDisplay = tracker.find('.percent-display');
            var progressBar = tracker.find('.progress-bar');
            
            animateValue(amountDisplay, 0, raised, 2000, '$');
            animateValue(goalDisplay, 0, goal, 2000, '$');
            
            var percentStart = { value: 0 };
            $({ value: 0 }).animate({ value: percent }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    percentDisplay.text(Math.floor(this.value) + '%');
                },
                complete: function() {
                    percentDisplay.text(percent + '%');
                }
            });
            
            animateProgressBar(progressBar, percent, 2000);
        });
    }
    
    var trackerAnimated = false;
    
    function checkTrackerVisibility() {
        if (trackerAnimated) return;
        
        var trackerContainer = $('.progress-trackers-container');
        if (trackerContainer.length === 0) return;
        
        var containerTop = trackerContainer.offset().top;
        var containerBottom = containerTop + trackerContainer.outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        
        if (containerBottom > viewportTop && containerTop < viewportBottom) {
            trackerAnimated = true;
            animateTrackers();
        }
    }
    
    $(window).on('scroll', checkTrackerVisibility);
    checkTrackerVisibility();
    
    var images = [];
    var currentIndex = 0;
    
    $('.image-item img').each(function(){
        images.push($(this).attr('src'));
    });
    
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        $('#lightboxOverlay').fadeIn(300);
        $('body').css('overflow', 'hidden');
    }
    
    function closeLightbox() {
        $('#lightboxOverlay').fadeOut(300);
        $('body').css('overflow', 'auto');
    }
    
    function updateLightboxImage() {
        $('#lightboxImage').attr('src', images[currentIndex]);
        $('#lightboxCounter').text((currentIndex + 1) + ' / ' + images.length);
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }
    
    $('.image-item').on('click', function(){
        var index = parseInt($(this).attr('data-index'));
        openLightbox(index);
    });
    
    $('#expandGalleryBtn').on('click', function(){
        openLightbox(0);
    });
    
    $('#lightboxClose').on('click', function(){
        closeLightbox();
    });
    
    $('#lightboxNext').on('click', function(){
        nextImage();
    });
    
    $('#lightboxPrev').on('click', function(){
        prevImage();
    });
    
    $('#lightboxOverlay').on('click', function(e){
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    $(document).on('keydown', function(e){
        if ($('#lightboxOverlay').is(':visible')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        }
    });
});
