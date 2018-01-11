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
                $scope.scIsPlaying = autoPlay;
                if (autoPlay === true) {
                    scPlayer.play();
                }
                $scope.trackTitle = scTracks[scTrackIndex].title;
                $scope.trackArtist = scTracks[scTrackIndex].user.username;
                $scope.$digest();
                scPlayer.on('pause', function () {
                    $scope.scIsPlaying = false;
                });
                scPlayer.on('play-start', function () {
                    $scope.scIsPlaying = true;
                    $scope.scIsLoading = false;
                    $scope.$digest();
                });
                scPlayer.on('play-resume', function () {
                    $scope.scIsPlaying = true;
                    $scope.scIsLoading = false;
                });
                scPlayer.on('finish', function () {
                    if (scTrackIndex < scTracks.length) {
                        scTrackIndex++;
                    } else {
                        scTrackIndex = 0;
                    }
                    $scope.scIsLoading = true;
                    streamTrack(true);
                });
            });
        }

        function shuffleArray(array) {
            var currentIndex = array.length
            var temporaryValue;
            var randomIndex;
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }

        $scope.scPreviousClick = function () {
            if (scPlayer.currentTime() < 5000) {
                if (scTrackIndex > 0) {
                    scTrackIndex--;
                } else {
                    scTrackIndex = scTracks.length - 1;
                }
                $scope.scIsLoading = true;
                streamTrack($scope.scIsPlaying);
            } else {
                scPlayer.seek(0);
            }

        };

        $scope.scPlayClick = function () {
            $scope.scIsLoading = true;
            scPlayer.play();
        };

        $scope.scPauseClick = function () {
            scPlayer.pause();
        };

        $scope.scNextClick = function () {
            if (scTrackIndex < scTracks.length - 1) {
                scTrackIndex++;
            } else {
                scTrackIndex = 0;
            }
            $scope.scIsLoading = true;
            streamTrack($scope.scIsPlaying);
        };

    }


});