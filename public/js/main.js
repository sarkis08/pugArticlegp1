$(document).ready(function(){
    $('.delete-article').on('click', function(e){
        $target = $(e.target);
        const id = ($target.attr('data-id'));
        $.ajax({
            type: 'DELETE',
            url: '/articles/'+id,
            success: function(response){
                alert('Article Deleted');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});


/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', './particles.json', function() {
  console.log('callback - particles.js config loaded');
});