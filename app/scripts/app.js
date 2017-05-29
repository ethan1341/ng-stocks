/**
 * The base file for the app. Library injection and code to run at init should be placed here
 * @type {angular.Module}
 */

var app = angular.module('ngStocks', ['ui.router','chart.js']);

app.run(['$rootScope', '$window', '$state', 'userService',
    function ($rootScope, $window, $state, userService) {
}]);

/**
 * Contstants that include the API routes and Sample Data
 */

app.constant('API',{
    userStocks:'/stocks',
    register:'/facebook',
    stockCharts:'/stockCharts',
    userInfo:'/userInfo',
    removeStock:'/removeStock'

});


app.constant('SAMPLE_DATA', {
    chart: {
        dates: ["2017-05-21T00:00:00", "2017-05-22T00:00:00", "2017-05-23T00:00:00", "2017-05-24T00:00:00", "2017-05-25T00:00:00", "2017-05-26T00:00:00", "2017-05-27T00:00:00"],
        values: [60.10, 62.40, 50.3, 45.1, 30.5, 60.4, 40.10],
        symbol: 'SAMPLE',
        name: 'Please select more symbols'
    }
});
/**
 * $State routing(angular.ui) uses abstracts for inheritance
 */

angular.module("ngStocks")
    .config(function ($stateProvider) {
        $stateProvider
            .state("login", {
                url: "/login",
                controller: "loginController",
                templateUrl: "app/html/login.html"
            })
            .state("register", {
                url: "/register",
                controller: "registerController",
                templateUrl: "app/html/register.html"
            })
            .state("dashboard", {
                url: "/dashboard",
                abstract: true,
                controller: "dashboardController",
                templateUrl: "app/html/dashboard.html"
            })
            .state("dashboard.overview", {
                url: "/overview",
                controller: "dashboardOverviewController",
                templateUrl: "app/html/dashboard-overview.html"
            })
            .state("dashboard.portfolio", {
                url: "/portfolio",
                controller: "dashboardPortfolioController",
                templateUrl: "app/html/dashboard-portfolio.html"
            })
            .state("redirect", {
                url: "/redirect",
                controller: "redirectController",
                templateUrl: "app/html/login-redirect.html"
            })
            .state("error", {
                url: "/error",
                controller: "errorController",
                templateUrl: "app/html/error.html"
            });;
    });
/**
 * The Parent Controller(Abstract) for profile and overview. Must functions will be called and ran in this controller for re-usability
 */

angular.module('ngStocks').controller('dashboardController', ['$scope', 'stockService', '$q', 'API', '$window','SAMPLE_DATA','$state',function ($scope, stockService, $q, API, $window,SAMPLE_DATA,$state) {
    $scope.dashboard = {};
    $scope.returnedSymbols;
    $scope.graphMap = {};
    $scope.chart = SAMPLE_DATA.chart;
    $scope.setActive = function (id) {
        $('li').removeClass('active');
        console.log($scope);
        $('#' + id).addClass('active');
        console.log('#' + id);
    };

    $scope.searchTicker = function (ticker) {
        var stockAPIURL = function (symbol) {
            var deferred = $q.defer();
            var symbolURL = 'https://s.yimg.com/aq/autoc?query=' + symbol + '&region=CA&lang=en-CA';
            if (symbol == "" || symbol == undefined) {
                deferred.reject({error: 'no stock entered'})
            } else {
                deferred.resolve(symbolURL);
            }
            return deferred.promise;
        };

        stockAPIURL(ticker).then(function (URL) {
            console.log('this ran')
            stockService.stockTickerAutoComplete('GET', URL, {}, {}, function (data) {
                $scope.returnedSymbols = data.data.ResultSet.Result;
                console.log($scope.returnedSymbols)
            }, function (error) {
                console.log('error', error)
            })
        }, function (error) {
            console.log('there was an error',error)
        })
    };
    /**
     * Post a stock selected from the INPUT in the NAVBAR:HTML
     * @param symbol
     */
    $scope.postStock = function (symbol) {
        var data = {};
        var selectedStock = symbol.split(':');
        data.symbol = selectedStock[1];
        if (data.symbol == undefined) {

        } else {
            stockService.postStockSymbol('POST', API.userStocks, data, {headers: {'Content-Type': 'application/json'}}, function (data) {
                $scope.getStocks();
                $scope.getStockCharts();
            }, function (error) {
                console.log('error', error)
            })
        }

    };
    /**
     * Gets all the stocks the user has chosen to follow
     * @returns {Promise}
     */
    $scope.getStocks = function () {
        var deferred = $q.defer();
        stockService.getUserStocks('GET', API.userStocks, {}, {}, function (data) {
            $scope.dashboard.stocks = data.data;
            deferred.resolve($scope.dashboard.stocks);
        }, function (err) {
            deferred.reject(err)
        });
        return deferred.promise;
    };
    /**
     * Removes stock by posting a symbol:HTML
     * @param symbol i.e  string:APPL
     */
    $scope.removeStock = function (symbol) {
        console.log(symbol);
        stockService.removeUserStock('POST', API.removeStock, {symbol: symbol}, {headers: {'Content-Type': 'application/json'}}, function (data) {
            console.log(data);
            $scope.getStocks().then(function(){
                $scope.getStockCharts();
            });

        }, function (err) {
        });
    };
    /**
     * Returns data which is stored in scope variables allowing angular chart js to make graphs
     */
    $scope.getStockCharts = function () {
        console.log('e');
        stockService.getUserStockCharts('GET', API.stockCharts, {}, {}, function (data) {
            console.log('f');
            console.log(data.data.length,'length')
           if(data.data == '404'){
               $window.sessionStorage.clear();
               $state.go('login')
           };
            if (data.data.length == 0) {
                console.log('0')
                $scope.realGraph = false ;
                console.log($scope.currentGraph,'graph');
            } else {
                $scope.realGraph = true ;
                $scope.graphMap = {};
                for (var i = 0; i < data.data.length; i++) {
                    var symbol = data.data[i].Elements[0].Symbol;
                    var name = data.data[i].Elements[0].Name;
                    $scope.graphMap[symbol] = data.data[i];
                    $scope.graphMap[symbol].symbol = symbol
                }
                $scope.currentGraph = $scope.graphMap[data.data[0].Elements[0].Symbol];
                console.log('this si current graph', $scope.graphMap);
            }
        }, function (error) {
            console.log(error)
        })
    };

    $scope.getStocks().then(function(){
        $scope.getStockCharts();
    },function(err){console.log(err)});

    $scope.logOut = function () {
        $window.sessionStorage.clear();
    };

}]);
/**
 * Stock Overview child controller generates the graphs when user clicks on one of the buttons
 */

angular.module('ngStocks').controller('dashboardOverviewController',['$stateParams','$scope',function($stateParams,$scope){
    $scope.generateGraph = function(symbol){
        $scope.$parent.currentGraph = $scope.graphMap[symbol];
        $('.stock-button').removeClass('active');
        $('#' + symbol).addClass('active');

    };
}]);
/**
 * Stock Portfolio child controller generates the information widgets
 */

angular.module('ngStocks').controller('dashboardPortfolioController',['userService','API',function(userService,API){

}]);
/**
 * Error Controller redirect if something goes wrong destroys sessionStorage
 */

angular.module('ngStocks').controller('redirectController',['userService','API','$window','$state',function(userService,API,$window,$state){
    $window.sessionStorage.clear();
}]);
/**
 * Default Home Controller
 */

angular.module('ngStocks').controller('homeController',['$state','$rootScope',function($state,$rootScope){

}]);
/**
 * Controller for login screen
 */
angular.module('ngStocks').controller('loginController',['$state','$scope','userService',function($state,$scope,userService){

}]);
/**
 * The controller for the page that the user is redirected to once he/she is logged in correctly creates the sessionStorage which is how the client side tells if the user is logged i;
 */

angular.module('ngStocks').controller('redirectController',['userService','API','$window','$state',function(userService,API,$window,$state){
    userService.getUserInfo('GET',API.userInfo,{},{},function(data){
        if(data.data.name){
            $window.sessionStorage["userInfo"] = JSON.stringify(data.data);
            $state.go('dashboard.overview');
        }else{
            $state.go('login')
        }
    },function(err){console.log(err)})
}]);
/**
 * Controller for the registration page not in use
 */

angular.module('ngStocks').controller('registerController',['$scope','userService','API',function($scope,userService,API){

}]);



/**
 * API services called in controllers involving stocks
 */

app.service('stockService',['requestWrapper','API',function(requestWrapper,API){

    var stockTickerAutoComplete = function(action,URL,data,options,successCB,errorCB){
        requestWrapper.makeRequest(action,URL,data,options,successCB,errorCB);
    };

    var postStockSymbol = function(action,URL,data,options,successCB,errorCB){
        requestWrapper.makeRequest(action,URL,data,options,successCB,errorCB);
    };

    var getUserStocks = function(action,URL,data,options,successCB,errorCB){
        requestWrapper.makeRequest(action,URL,data,options,successCB,errorCB);
    };

    var getUserStockCharts = function(action,URL,data,options,successCB,errorCB){
        requestWrapper.makeRequest(action,URL,data,options,successCB,errorCB)
    };

    var removeUserStock = function(action,URL,data,options,successCB,errorCB){
        requestWrapper.makeRequest(action,URL,data,options,successCB,errorCB)
    };

    return{
        stockTickerAutoComplete:stockTickerAutoComplete,
        postStockSymbol:postStockSymbol,
        getUserStocks:getUserStocks,
        getUserStockCharts:getUserStockCharts,
        removeUserStock:removeUserStock
    }
}]);
/**
 * API services called in controllers involving the User
 */

app.service('userService', ['requestWrapper', 'API', '$window', '$state', function (requestWrapper, API, $window, $state) {

    var getUserInfo = function (action, URL, data, successCB, errorCB) {
        requestWrapper.makeRequest(action, URL, data, successCB,errorCB)
    };

    var loginCheck = function (event, toState, toParams, fromState, fromParams) {
        var parentRoute = toState.name.split('.');
        if (!$window.sessionStorage["userInfo"]) {
            if (toState.name == 'dashboard' || parentRoute[0] == 'dashboard') {
                event.preventDefault();
                $state.go('login');
            } else {
                console.log(toState);
            }
        }
    };


    return {
        getUserInfo: getUserInfo,
        loginCheck: loginCheck
    }
}]);
/**
 * Generic request function used with ALL API requests
 */

app.service('requestWrapper', function($http, $q){

    var basePath = 'http://localhost:4000';
    //  => http://domain.com/api/path/foo/bar

    function makeRequest(verb, uri, data,options,successCB,errorCB){
        var defer = $q.defer();
        verb = verb.toLowerCase();
        //start with the uri
        var httpArgs = [basePath + uri];
        if (verb.match(/post|put/)){
            $http[verb](uri,data,options)
                .then(successCB,errorCB);
        }else{
            $http[verb](uri,data)
                .then(successCB,errorCB);
        }

        return defer.promise
    }

    return {
        makeRequest:makeRequest,
        get: function( uri ){
            return makeRequest( 'get', uri );
        }
        ,post: function( uri, data ){
            return makeRequest( 'post', uri,data,options );
        }
        ,put: function( uri, data ){
            return makeRequest( 'put', uri, data );
        }
        ,delete: function( uri ){
            return makeRequest( 'delete', uri );
        }
    };
});