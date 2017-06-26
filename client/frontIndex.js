var $chirpButton = $('#chirp-btn');
var $chirpField = $('#chirp-field');
var $chirpList = $('#chirp-list');
var $userSelector = $('#user-selector');

$chirpButton.click(postChirp);

//chirp button disable logic 
 $chirpField.on('input', function(){
    var isEmpty = $chirpField.val().length === 0;
        $chirpButton.prop('disabled', isEmpty);
 });

function postChirp(){
    var chirp = {
        userid: $userSelector.val(),
        message: $chirpField.val()
    };
    $.ajax({
        method: 'POST',
        url: '/api/chirps',
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function(success) {
        $chirpField.val('');
        $chirpButton.prop('disabled', true);
        getChirps();
    }, function(err) {
        console.log(err);
    });
}

function getChirps() {
    $.ajax({
        method: 'GET',
        url: '/api/chirps'
    }).then(function(chirps) {
        $chirpList.empty();
        for (var i = 0; i < chirps.length; i++) {
            addChirpDiv(chirps[i]);
        }
    }, function(err) {
        console.log(err);
    });
}
getChirps();

function addChirpDiv(chirp) {
var $chirpDiv = $('<div class="chirp"></div>');
    var $user = $('<h4></h4>');            
    var $message = $('<p></p>');
    var $timestamp = $('<h5></h5>');
    var $viewBtn = $('<button class="btn btn-primary btn-xs edit-btn"><i class="glyphicon glyphicon-zoom-in" aria-hidden="true"></i>VIEW</button>');
    var $deleteBtn = $('<button class="btn btn-danger btn-xs delete-btn"><i class="fa fa-trash-o"></i>DELETE</button>');
    $viewBtn.on('click', function() {
        window.location.replace('http://localhost:3000/chirps/' + chirp.id);
    })
    $deleteBtn.click(function() {
        deleteChirp(chirp.id);
    });

    $user.text(chirp.userName);
    $message.text(chirp.message);
    $timestamp.text(new Date(chirp.timestamp).toLocaleString());

    $user.appendTo($chirpDiv);
    $message.appendTo($chirpDiv);
    $timestamp.appendTo($chirpDiv);
    $viewBtn.appendTo($chirpDiv);
    $deleteBtn.appendTo($chirpDiv);

    $chirpDiv.appendTo($chirpList);
}

function deleteChirp(id) {
    $.ajax({
        method: 'DELETE',
        url: '/api/chirps/' + id
    }).then(function() {
        getChirps();
    }, function(err) {
        console.log(err);
    });
}

function populateUsers() {
    $.ajax({
        method: 'GET',
        url: '/api/users'
    }).then(function(users) {
        for(var i = 0; i < users.length; i++) {
            var $userOption = $('<option value="' + users[i].id + '">' + users[i].name + '</option>');
            $userSelector.append($userOption);
        }
    }, function(err) {
        console.log(err);
    });
}

populateUsers();