var socket = io();

var playersArray = [];
var clientUsername;
var playerNumber;
var sortedPlayers;
var myPosition;

function hostChecker() {
    socket.emit('looking for quizmaster');
}

socket.on('set quizmaster', function() {
    username = "host";
    playerNumber = playersArray.length;
    socket.emit('new user', playerNumber, username = {
        gebruikersnaam : username,
        host : true,
        id : playersArray.length
    });
});

// Knop uit totdat waarde in zit
function send() {

    var username = $('#welkom-btn-mob-text-veld').val();

    if (username == "") {
        return;
    }
        playerNumber = playersArray.length;

        socket.emit('new user', playerNumber, username = {
            gebruikersnaam : username,
            host : false,
            score : 0,
            id : playersArray.length
        });

    clientUsername = username.gebruikersnaam;
}

// playerNumber = playersArray.length;

function leaderLoad() {
    // sortedPlayers = playersArray.sort(function(a, b){return b.score-a.score});

    // if (playersArray[playerNumber] != undefined && playersArray[playerNumber].host == false) {
    //     for (var sp = 0; sp < playersArray.length; sp++) {
    //         if (sortedPlayers[sp].gebruikersnaam == playersArray[playerNumber].gebruikersnaam) {
    //             myPosition = sortedPlayers.indexOf(sortedPlayers[sp]);
    //         }
    //     }
    // }

    var p = playersArray.length;
    var cards = "";
    for (i = 0; i < p; i++) {
        if (playersArray[i].host != true) {
            if (i >= 0 && i < 10) {
                cards += "<div class='leaderboard-card'>" + playersArray[i].gebruikersnaam + "<div class='leaderboard-card-score'>" + playersArray[i].score + "</div></div>";
            }
        }
    }
    angular.element(document).find('#leaderboard').html(cards);
}

setInterval(leaderLoad, 1000);

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

socket.on('send array', function(players) {
    playersArray = players;
});

// When a new client connects, this makes sure they'll receive the latest array of players.
socket.on('update playerArray', function(data) {
    playersArray = data;
    playerNumber = findWithAttr(playersArray, 'gebruikersnaam', clientUsername);

    socket.emit('player shifted', playerNumber);
});

socket.on('please send me your scores', function() {
    socket.emit('this is my new score', playersArray, playerNumber);
});