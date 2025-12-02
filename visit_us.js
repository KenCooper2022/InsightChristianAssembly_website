$(document).ready(function() {
    $('.accordion-header').on('click', function() {
        var $item = $(this).closest('.accordion-item');
        
        if ($item.hasClass('active')) {
            $item.removeClass('active');
        } else {
            $('.accordion-item').removeClass('active');
            $item.addClass('active');
        }
    });
});
