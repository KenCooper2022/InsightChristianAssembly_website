$(document).ready(function(){
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
