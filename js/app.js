var app = angular.module('app', []);

app.config(function () {

});

app.run(function () {

    init();
    function init() {
    }

    $(document).ready(function () {
        $('.hide-all').hide();
    });

});

app.controller('controller', function ($scope, $filter, $timeout) {

    init();
    function init() {
    }

});