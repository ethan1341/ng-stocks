app.service('userService', ['requestWrapper', 'API', '$window', '$state', function (requestWrapper, API, $window, $state) {
    var watchLoginChange = function () {

    };

    var registerUser = function (action, URL, data, successCB, errorCB) {
        requestWrapper.makeRequest(action, URL, data, successCB, errorCB)
    };

    var getUserInfo = function (action, URL, data, successCB, errorCB) {
        console.log('adfadf')
        requestWrapper.makeRequest(action, URL, data, successCB
            , errorCB)
    };
    var loginCheck = function (event, toState, toParams, fromState, fromParams) {
        var parentRoute = toState.name.split('.');

        if (!$window.sessionStorage["userInfo"]) {
            if (toState.name == 'dashboard' || parentRoute[0] == 'dashboard') {
                event.preventDefault()
                $state.go('login')
            }else{
                console.log(toState);
            }
        }


    };


    return {
        watchLoginChange: watchLoginChange,
        registerUser: registerUser,
        getUserInfo: getUserInfo,
        loginCheck: loginCheck


    }
}]);