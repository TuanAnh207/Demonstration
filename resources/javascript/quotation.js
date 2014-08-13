/**
 * Created by apple on 8/11/14.
 */
// Load native UI library
var gui = require('nw.gui'); //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)

// Get the current window
var win = gui.Window.get();

$(document).ready(function() {
//    win.width=$('#process').outerWidth(true)+37;
//    win.setMaximumSize(win.width, 2000);
//    win.setMinimumSize(win.width, 200);

    $('#back_inventory').click(function () {
        var html = fs.readFileSync("index.html");
        html= html.toString();
        var html_head = html.match(/<head[^>]*>((\r|\n|.)*)<\/head/m),
            html_body = html.match(/<body[^>]*>((\r|\n|.)*)<\/body/m);

        html_head = html_head ? html_head[1] : '';
        html_body = html_body ? html_body[1] : '';

        $('body').html(html_body);
        $('head').html(html_head);
    })
});