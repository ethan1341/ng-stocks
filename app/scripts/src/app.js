/**
 * The base file for the app. Library injection and code to run at init should be placed here
 * @type {angular.Module}
 */
å
var app = angular.module('ngStocks', ['ui.router','chart.js']);

app.run(['$rootScope', '$window', '$state', 'userService',
    function ($rootScope, $window, $state, userService) {
}]);
