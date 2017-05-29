var app = angular.module('ngStocks', ['ui.router','chart.js']);

app.run(['$rootScope', '$window', '$state', 'userService',
    function ($rootScope, $window, $state, userService) {
        /**
         * Set the App to watch for login status for every state change
         */
    if($window.sessionStorage["userInfo"]){
        $state.go('dashboard.overview')
    }else{
        $state.go('login')
    }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            userService.loginCheck(event, toState, toParams, fromState, fromParams)
        })




}]);
