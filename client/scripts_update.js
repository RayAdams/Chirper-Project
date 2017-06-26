var fullUrl = window.location.pathname;
var chirpNum = fullUrl.split('/');
var id = chirpNum[2];
var $chirpList = $('#chirp-list');
var $chirpField;


function getChirp() {
    $.ajax({
        method: 'GET',
        url: '/api/chirps/' + id 
    }).then(function(chirp) {
        addChirpDiv(chirp);
    }, function(err) {
        console.log(err);
    });
}
getChirp();

function addChirpDiv(chirp) {
var $chirpDiv = $('<div class="chirp"></div>');
    var $user = $('<h4></h4>');            
    $chirpField = $('<input type="text" id="chirp-field" class="form-control text" placeholder="' + chirp.message + '">');
    var $timestamp = $('<h5></h5>');
    var $submitBtn = $('<button class="btn btn-primary btn-xs edit-btn">Submit</button>');
    $submitBtn.on('click', function() {
        updateChirp(id);
    });

    $user.text(chirp.userName);
    $chirpField.text(chirp.message);
    $timestamp.text(new Date(chirp.timestamp).toLocaleString());

    $user.appendTo($chirpDiv);
    $chirpField.appendTo($chirpDiv);
    $timestamp.appendTo($chirpDiv);
    $submitBtn.appendTo($chirpDiv);


    $chirpDiv.appendTo($chirpList);
}

function updateChirp(id) {
    var chirp = {
        message: $chirpField.val()
    };
    console.log(chirp.message);
    $.ajax({
        method: 'PUT',
        url: '/api/chirps/' + id,
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function(success) {
        window.location.replace('http://localhost:3000/chirps');
    }, function(err) {
        console.log(err);
    });
}