var app = angular.module('app', []);

app.controller('controller', function ($scope) {

    init();
    function init() {
        soundCloudStreamerInit();
    }

    function soundCloudStreamerInit() {
        var scClientId = 'c2Hm1wGeqsWTHQ07QmQqFJqGsw2j1nB9';
        var scPlaylistId = '418174355';
        var scTracks = [];
        var scTrackIndex = 0;
        var scTrackIndexesPlayed = [];
        var scTrackIndexesNotPlayed = [];
        var scPlayer = {};

        SC.initialize({ client_id: scClientId });

        SC.get('/playlists/' + scPlaylistId).then(function (playlist) {
            scTracks = shuffleArray(playlist.tracks);
            streamTrack(false);
        });

        function streamTrack(autoPlay) {
            SC.stream('/tracks/' + scTracks[scTrackIndex].id).then(function (player) {
                scPlayer = player;
                $scope.isPlaying = autoPlay;
                if (autoPlay === true) {
                    scPlayer.play();
                }
                $scope.trackTitle = scTracks[scTrackIndex].title;
                $scope.trackArtist = scTracks[scTrackIndex].user.username;
                $scope.$digest();
                scPlayer.on('state-change', function (state) {
                    if (state === 'ended') {
                        if (scTrackIndex < scTracks.length) {
                            scTrackIndex++;
                        } else {
                            scTrackIndex = 0;
                        }
                        streamTrack(true);
                    }
                });
            });
        }

        function shuffleArray(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }

        $scope.scPrevious = function () {
            if (scPlayer.currentTime() < 5000) {
                if (scTrackIndex > 0) {
                    scTrackIndex--;
                } else {
                    scTrackIndex = scTracks.length - 1;
                }
            }
            streamTrack($scope.isPlaying);
        };

        $scope.scPlay = function () {
            scPlayer.play();
            $scope.isPlaying = true;
        };

        $scope.scPause = function () {
            scPlayer.pause();
            $scope.isPlaying = false;
        };

        $scope.scNext = function () {
            if (scTrackIndex < scTracks.length - 1) {
                scTrackIndex++;
            } else {
                scTrackIndex = 0;
            }
            streamTrack($scope.isPlaying);
        };
    }


});