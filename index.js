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
})
$('#x_button').on('click',function(){
    $('#announcement_dropdown')
    .slideUp('slow')

});
