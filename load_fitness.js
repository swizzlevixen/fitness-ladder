/*
*
* Helper functions
*
*/

var RUNG_MAX = 48;

function set_rung(rung_number) {
    Cookies.set('rung', rung_number);
    return rung_number;
};

function current_rung() {
    var rung_number;
    
    // Check to make sure the cookie is set. If not, reset it to '1'.
    if (typeof Cookies.get('rung') == 'undefined') {
        console.log("Cookie 'rung' was not set.");
        set_rung(1);
    }
    
    try {
        rung_number = parseInt(Cookies.get('rung'));
    }
    catch(err) {
        console.log(err.message);
    }
    return rung_number;
};

function get_rung_data(rung_number) {
    try {
        // $.getJSON() is asynchronous
        $.getJSON('fitness_ladder.json', function (data) {
            //console.log(data)
            //console.log("rung_number: " + rung_number);
            
            // This returns an array with (hopefully) one object, so we return just that one.
            // TODO: check to make sure there's one object here, and that it's valid
            var rung_data = $.grep(data.rungs, function(e){
                //console.log(e.rung);
                return e.rung == rung_number;
            })[0];
            
            // Callback to do something with the data
            show_data(rung_data);
        });
    }
    catch(err) {
        console.log(err.message);
    }
};

function get_current_rung_data() {
    get_rung_data(current_rung());
};

function show_data(rung_data) {
    // Asynchronous callback when the JSON parsing is done.
    var showData = $('#show-data');
    var showRung = $('#rung-data');
    var showBend = $('#bend-data');
    var showSitup = $('#situp-data');
    var showLeglift = $('#leglift-data');
    var showPushup = $('#pushup-data');
    var showSteps = $('#steps-data');
    
    if (typeof rung_data != 'undefined') {
        // TODO: Something a little prettier
        showData.text('Rung Loaded.');
        showRung.text(rung_data.rung);
        showBend.text(rung_data.bend);
        showSitup.text(rung_data.situp);
        showLeglift.text(rung_data.leglift);
        showPushup.text(rung_data.pushup);
        showSteps.text(rung_data.steps);
    } else {
        console.log("Error loading data.");
    };
}



/*
*
* JQuery button functions
*
*/

$(document).ready(function () {
    get_current_rung_data();

    $('#get-data').click(function () {
        var showData = $('#show-data');

        get_current_rung_data();  // asynchronous
            
        showData.empty();

        showData.text('Loading the JSON file.');
    });
   
    $('#set-cookie').click(function () {
        var showCookie = $('#show-cookie');
        var rung = 1;  // Need some logic here to set which one!
        //console.log(rung);

        showCookie.empty();
        
        showCookie.text('Saving the cookie.');
        set_rung(rung);
    });
   
    $('#get-cookie').click(function () {
        var showCookie = $('#show-cookie');
        showCookie.empty();
        
        var loaded_rung = current_rung();
        //console.log(loaded_rung);

        if (loaded_rung) {
            showCookie.text('Loading the cookie.');
            var content = '<li>Rung: ' + loaded_rung + '</li>';
            var list = $('<ul />').html(content);
            showCookie.append(list);
        }
    });
   
    $('#delete-cookie').click(function () {
        var showCookie = $('#show-cookie');
        showCookie.empty();
        
        try {
            Cookies.remove('rung');
            showCookie.text('Deleting the cookie.');
        }
        catch(err) {
            console.log(err.message);
        }
        
    });
   
    $('#increment-rung').click(function () {
        
        var rung = current_rung();
        // TODO: disable button if we're already at last rung
        if (RUNG_MAX == rung) {
            rung = RUNG_MAX;
        } else {
            rung = rung + 1;
        };
        
        set_rung(rung);
        get_current_rung_data();
    });
    
    
   
    $('#decrement-rung').click(function () {
        
        var rung = current_rung();
        // TODO: disable button if we're already at first rung
        if (1 == rung) {
            rung = 1;
        } else {
            rung = rung - 1;
        };
        
        set_rung(rung);
        get_current_rung_data();
    });
 
});
