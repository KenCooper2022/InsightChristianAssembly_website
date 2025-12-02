$(document).ready(function() {
    $('.product-header').on('click', function() {
        const productCard = $(this).closest('.product-card');
        
        if (productCard.hasClass('expanded')) {
            productCard.removeClass('expanded');
        } else {
            productCard.addClass('expanded');
        }
    });

    $('.product-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
    });
});
