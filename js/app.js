var app = angular.module('app', []);

app.controller('controller', function ($scope) {

    var index = 0;
    var currentSong = 0;
    var song = {
        title: [],
        artist: [],
        id: [],
        duration: []
    };

    init();
    function init() {
        scInit();
        scStream();
    }

    function scInit() {
        SC.initialize({
            client_id: 'c2Hm1wGeqsWTHQ07QmQqFJqGsw2j1nB9'
        });
    }


    function scStream() {
        SC.get('/playlists/418174355').then(function (playlist) {
            playlist.tracks.forEach(function (track) {
                song.id[index] = track.id;
                console.log(track.title);
                song.title[index] = track.title;
                song.artist[index] = track.user.username;
                song.duration[index] = track.duration;
                console.log(track.duration);
                index++;
            });

            currentSong = getRandomInt(0, index);

            playCurrentSong();

            function playCurrentSong() {
                console.log("got into playCurrentSong function");
                //Stream playlist, looping when end of playlist is reached
                SC.stream('/tracks/' + song.id[currentSong]).then(function (player) {
                    player.play();
                });
                console.log("duration " + song.duration[currentSong]);
                setTimeout(queueNextSong, song.duration[currentSong]);
            }

            function queueNextSong() {
                console.log("got into queueNextSong function");

                if (currentSong < song.id.length) {
                    console.log(currentSong);
                    //next index for next song id
                    currentSong++;
                }
                else {
                    currentSong = 0;
                    console.log(currentSong)
                }
                playCurrentSong();
            }
        });
    }


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


});