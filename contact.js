function element_dropdown(element){
    $(element)
        .hide()
        .css('opacity', 0)
        .slideDown('slow')
        .animate({opacity: 1},
            {queue: false, duration: 'slow'}
        )
}

$(document).ready(function(){
    element_dropdown('#contact_element');
    
    $('.submit-btn').on('click', function(e){
        e.preventDefault();
        
        var name = $('#name').val().trim();
        var email = $('#email').val().trim();
        var phone = $('#phone').val().trim();
        var message = $('#message').val().trim();
        
        if (!name || !email || !message) {
            alert('Please fill in all required fields (Name, Email, and Message).');
            return;
        }
        
        var contactData = {
            name: name,
            email: email,
            phone: phone,
            message: message,
            submittedAt: new Date().toISOString()
        };
        
        var existingContacts = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        existingContacts.push(contactData);
        localStorage.setItem('contactSubmissions', JSON.stringify(existingContacts));
        
        $('.form-container').fadeOut(400, function(){
            $('#thank-you-message').fadeIn(600);
        });
    });
});
