function(e) {
    var item = $(this);
    $$(this).app.db.openDoc(item.attr("data-id"), {
        success : function(doc) {
            var streamItem = $.eshmana.streamItemDiv(doc);
            $.eshmana.appendItemToStream(streamItem);
        }
    });
    
    $.eshmana.barButtonsTurnOff();
    $.eshmana.stopShuffling();
    $.eshmana.streamTurnOn($('#shuffle-stream'));
    return false;
}