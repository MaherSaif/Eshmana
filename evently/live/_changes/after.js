function() {
    var $old = $('#live-stream-items .stream-item').last();
    $old.clone().appendTo('#live-stream-items');
    $old.remove();
    $('#live-stream-items .stream-item').first().hide();
    if ( $('#live-stream-items .stream-item').length > 3 ) {
        $('#live-stream-items .stream-item').last().remove();
    }
    $('#live-stream-items .stream-item').first().slideDown();
}