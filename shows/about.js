function(doc, req) {
var ddoc = this,
    mustache = require("vendor/couchapp/lib/mustache")
    
    return mustache.to_html(ddoc.templates.page, {name: 'hello'});
}