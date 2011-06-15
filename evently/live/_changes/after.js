function() {
    $('.stream-item').first().hide();
    var $old = $('.stream-item').last();
    //First we copy the arrow to the new table cell and get the offset to the document
    $old.clone().appendTo('#live-stream');
    $old.remove();
    $('.stream-item').first().slideDown();
    if ( $('.stream-item').length > 3 ) {
        $('.stream-item').last().remove();
    }
}