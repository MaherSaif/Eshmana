function(e) {
    var item = $(this);
    $$(this).app.db.openDoc(item.attr("data-id"), {
        success : function(doc) {
            var streamItem = $.eshmana.streamItemDiv(doc);
            $('#stream').prepend(streamItem);
            $('.stream-item').first().slideDown();
            if ( $('.stream-item').length > 3 ) {
                $('.stream-item').last().remove();
            }
        }
    });
    
    $.eshmana.barButtonsTurnOFf();
    $.eshmana.stopShuffling();
    $('#live-stream').hide();
    $('#side-note').hide();
    $('#stream').show();
    return false;
}