$(document).ready(function(){
    $('#submit-prayer').on('click', function(e){
        e.preventDefault();
        
        var name = $('#name').val().trim();
        var email = $('#email').val().trim();
        var prayerRequest = $('#prayer_request').val().trim();
        
        if (!prayerRequest) {
            alert('Please enter your prayer request.');
            return;
        }
        
        var prayerData = {
            name: name || 'Anonymous',
            email: email || '',
            prayerRequest: prayerRequest,
            submittedAt: new Date().toISOString()
        };
        
        var existingPrayers = JSON.parse(localStorage.getItem('prayerRequests') || '[]');
        existingPrayers.push(prayerData);
        localStorage.setItem('prayerRequests', JSON.stringify(existingPrayers));
        
        $('.prayer-form-container').fadeOut(400, function(){
            $('#thank-you-message').fadeIn(600);
        });
    });
});
