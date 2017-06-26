var fullUrl = window.location.pathname;
var chirpNum = fullUrl.split('/');
var id = chirpNum[2];
var $chirpList = $('#chirp-list');

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
    var $message = $('<p></p>');
    var $timestamp = $('<h5></h5>');
    var $editBtn = $('<button class="btn btn-primary btn-xs edit-btn"><i class="glyphicon glyphicon-pencil" aria-hidden="true"></i>EDIT</button>');
    var $deleteBtn = $('<button class="btn btn-danger btn-xs delete-btn"><i class="fa fa-trash-o"></i>DELETE</button>');
    $deleteBtn.on('click', function() {
        checkDelete(id);
    });
    $editBtn.on('click', function() {
        window.location.replace('http://localhost:3000/chirps/' + id + '/update');
    })

    $user.text(chirp.userName);
    $message.text(chirp.message);
    $timestamp.text(new Date(chirp.timestamp).toLocaleString());

    $user.appendTo($chirpDiv);
    $message.appendTo($chirpDiv);
    $timestamp.appendTo($chirpDiv);
    $deleteBtn.appendTo($chirpDiv);
    $editBtn.appendTo($chirpDiv);

    $chirpDiv.appendTo($chirpList);
}

function deleteChirp(id) {
    $.ajax({
        method: 'DELETE',
        url: '/api/chirps/' + id
    }).then(function() {
    //go to all chirps page
    window.location.replace('http://localhost:3000/chirps');
    }, function(err) {
        console.log(err);
    });
}

function checkDelete(id) {
    var r = confirm('Are you sure you want to Delete?');
    if (r === true) {
        deleteChirp(id);
    }
    else {
        console.log('Cancelled delete');
    }
}